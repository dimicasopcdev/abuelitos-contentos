require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { Resend } = require('resend');
const db      = require('./db');
const { confirmationEmail } = require('./emails/confirmation');
const { launchEmail }       = require('./emails/launch');
const { careInviteEmail }   = require('./emails/care');
const capsulasRouter        = require('./routes/capsulas');
const cuidadoRouter = require('./routes/cuidado');

const app    = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.FROM_EMAIL || 'noreply@abuelitoscontentos.com';
const PORT   = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static('public'));

// Cápsulas de Vida routes
app.use('/api', capsulasRouter);
app.use('/api', cuidadoRouter);

/* ─────────────────────────────────────────
   AUTH MIDDLEWARE — admin routes
───────────────────────────────────────── */
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!process.env.ADMIN_TOKEN) return res.status(500).json({ error: 'ADMIN_TOKEN no configurado' });
  if (token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'No autorizado' });
  next();
}

/* ─────────────────────────────────────────
   WAITLIST
───────────────────────────────────────── */

// POST /api/waitlist — Registrar email
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email, name = '', source = 'landing' } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const existing = db.prepare('SELECT id FROM waitlist WHERE email = ?').get(email.toLowerCase());
    if (existing) return res.json({ ok: true, already: true, message: 'Ya estabas en la lista 💛' });

    db.prepare(
      'INSERT INTO waitlist (email, name, source, created_at) VALUES (?, ?, ?, ?)'
    ).run(email.toLowerCase(), name.trim(), source, new Date().toISOString());

    // Enviar confirmación por Resend
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: '¡Ya estás en la lista! 🌻 Abuelitos Contentos',
      html: confirmationEmail({ name, email }),
    });

    if (error) console.error('Resend error:', error);

    const total = db.prepare('SELECT COUNT(*) as n FROM waitlist').get().n;
    res.json({ ok: true, total, message: '¡Bienvenido/a a la familia!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/waitlist/count — Contador público (para el frontend)
app.get('/api/waitlist/count', (req, res) => {
  const { n } = db.prepare('SELECT COUNT(*) as n FROM waitlist').get();
  res.json({ total: n });
});

/* ─────────────────────────────────────────
   CÍRCULO DE CUIDADO
───────────────────────────────────────── */

// POST /api/care/circle — Crear círculo de cuidado
app.post('/api/care/circle', async (req, res) => {
  try {
    const { creatorEmail, creatorName, grandparentName } = req.body;

    if (!creatorEmail || !grandparentName) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const result = db.prepare(
      'INSERT INTO care_circles (circle_name, grandparent, creator_email, created_at) VALUES (?, ?, ?, ?)'
    ).run(`Círculo de ${grandparentName}`, grandparentName, creatorEmail.toLowerCase(), new Date().toISOString());

    // Añadir al creador como primer miembro
    db.prepare(
      'INSERT INTO care_members (circle_id, email, role, joined_at) VALUES (?, ?, ?, ?)'
    ).run(result.lastInsertRowid, creatorEmail.toLowerCase(), 'creador', new Date().toISOString());

    res.json({ ok: true, circleId: result.lastInsertRowid });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el círculo' });
  }
});

// POST /api/care/invite — Invitar a un familiar al círculo
app.post('/api/care/invite', async (req, res) => {
  try {
    const { circleId, inviterName, inviteeEmail, role = 'cuidador' } = req.body;

    if (!circleId || !inviteeEmail) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const circle = db.prepare('SELECT * FROM care_circles WHERE id = ?').get(circleId);
    if (!circle) return res.status(404).json({ error: 'Círculo no encontrado' });

    // Guardar miembro (pendiente de aceptar)
    const existing = db.prepare('SELECT id FROM care_members WHERE circle_id = ? AND email = ?').get(circleId, inviteeEmail.toLowerCase());
    if (!existing) {
      db.prepare(
        'INSERT INTO care_members (circle_id, email, role, joined_at) VALUES (?, ?, ?, ?)'
      ).run(circleId, inviteeEmail.toLowerCase(), role, new Date().toISOString());
    }

    // Enviar email de invitación
    const { error } = await resend.emails.send({
      from: FROM,
      to: inviteeEmail,
      subject: `${inviterName} te invita al círculo de cuidado de ${circle.grandparent} 💛`,
      html: careInviteEmail({
        inviterName,
        grandparentName: circle.grandparent,
        circleId,
        inviteeEmail,
      }),
    });

    if (error) console.error('Resend error:', error);

    res.json({ ok: true, message: `Invitación enviada a ${inviteeEmail}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar invitación' });
  }
});

// GET /api/care/circle/:id — Ver miembros del círculo
app.get('/api/care/circle/:id', (req, res) => {
  try {
    const circle  = db.prepare('SELECT * FROM care_circles WHERE id = ?').get(req.params.id);
    if (!circle) return res.status(404).json({ error: 'Círculo no encontrado' });
    const members = db.prepare('SELECT * FROM care_members WHERE circle_id = ? ORDER BY joined_at').all(req.params.id);
    res.json({ circle, members });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

/* ─────────────────────────────────────────
   ADMIN — rutas protegidas
───────────────────────────────────────── */

// GET /api/admin/stats
app.get('/api/admin/stats', adminAuth, (req, res) => {
  const total    = db.prepare('SELECT COUNT(*) as n FROM waitlist').get().n;
  const today    = db.prepare("SELECT COUNT(*) as n FROM waitlist WHERE date(created_at) = date('now')").get().n;
  const launched = db.prepare('SELECT COUNT(*) as n FROM waitlist WHERE launched = 1').get().n;
  const circles  = db.prepare('SELECT COUNT(*) as n FROM care_circles').get().n;
  const members  = db.prepare('SELECT COUNT(*) as n FROM care_members').get().n;
  const byDay    = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as n
    FROM waitlist
    GROUP BY day
    ORDER BY day DESC
    LIMIT 14
  `).all();
  const recent   = db.prepare('SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 100').all();

  res.json({ total, today, launched, circles, members, byDay, recent });
});

// POST /api/admin/launch — Enviar email de lanzamiento a todos
app.post('/api/admin/launch', adminAuth, async (req, res) => {
  try {
    const { playStoreUrl } = req.body;
    const pendientes = db.prepare('SELECT * FROM waitlist WHERE launched = 0').all();

    let sent = 0, errors = 0;

    for (const row of pendientes) {
      try {
        await resend.emails.send({
          from: FROM,
          to: row.email,
          subject: '🎉 ¡Ya está aquí! Abuelitos Contentos ya disponible en Google Play',
          html: launchEmail({ name: row.name, playStoreUrl }),
        });
        db.prepare('UPDATE waitlist SET launched = 1 WHERE id = ?').run(row.id);
        sent++;
      } catch (e) {
        console.error(`Error enviando a ${row.email}:`, e);
        errors++;
      }

      // Pequeña pausa para no saturar la API de Resend
      await new Promise(r => setTimeout(r, 100));
    }

    res.json({ ok: true, sent, errors, total: pendientes.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error enviando emails de lanzamiento' });
  }
});

// DELETE /api/admin/waitlist/:id
app.delete('/api/admin/waitlist/:id', adminAuth, (req, res) => {
  db.prepare('DELETE FROM waitlist WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ─────────────────────────────────────────
   START
───────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🌻 Abuelitos Contentos Backend`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   → Admin panel: http://localhost:${PORT}/admin.html\n`);
});
