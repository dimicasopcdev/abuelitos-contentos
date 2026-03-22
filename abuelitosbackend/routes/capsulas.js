const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { v4: uuidv4 } = require('uuid');
const { Resend } = require('resend');
const db      = require('../db');
const { capsuleNotifyEmail } = require('../emails/capsule');

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

/* ── Audio upload storage ── */
const audioDir = path.join(__dirname, 'uploads', 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const storage = multer.diskStorage({
  destination: audioDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${uuidv4()}.webm`)
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype.startsWith('audio/');
    cb(ok ? null : new Error('Solo se permiten archivos de audio'), ok);
  }
});

/* ════════════════════════════════════
   FAMILIA — Crear o unirse
════════════════════════════════════ */

// POST /api/familias — Crear familia nueva
router.post('/familias', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2)
      return res.status(400).json({ error: 'Nombre de familia requerido' });

    // Generar código corto y memorable: XXXX-XXXX
    const code = generateCode();
    db.prepare(
      'INSERT INTO familias (code, name, created_at) VALUES (?, ?, ?)'
    ).run(code, name.trim(), new Date().toISOString());

    res.json({ ok: true, code, name: name.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando la familia' });
  }
});

// GET /api/familias/:code — Verificar que el código existe
router.get('/familias/:code', (req, res) => {
  const familia = db.prepare('SELECT * FROM familias WHERE code = ?').get(req.params.code.toUpperCase());
  if (!familia) return res.status(404).json({ error: 'Familia no encontrada' });
  const total = db.prepare('SELECT COUNT(*) as n FROM capsulas WHERE family_code = ?').get(familia.code).n;
  res.json({ ok: true, ...familia, total_capsulas: total });
});

/* ════════════════════════════════════
   CÁPSULAS
════════════════════════════════════ */

// POST /api/capsulas — Crear cápsula (multipart: texto + audio)
router.post('/capsulas', upload.single('audio'), async (req, res) => {
  try {
    const { family_code, nombre, para, momento, msg = '', duracion_seg = 0, notify_email = '' } = req.body;

    if (!family_code || !nombre || !para || !momento)
      return res.status(400).json({ error: 'Faltan campos obligatorios: family_code, nombre, para, momento' });

    const familia = db.prepare('SELECT * FROM familias WHERE code = ?').get(family_code.toUpperCase());
    if (!familia) return res.status(404).json({ error: 'Código de familia no válido' });

    const audio_file = req.file ? req.file.filename : '';

    const result = db.prepare(`
      INSERT INTO capsulas (family_code, nombre, para, momento, msg, audio_file, duracion_seg, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      family_code.toUpperCase(),
      nombre.trim(),
      para.trim(),
      momento.trim(),
      msg.trim(),
      audio_file,
      parseInt(duracion_seg) || 0,
      new Date().toISOString()
    );

    // Notificación por email (opcional)
    if (notify_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notify_email)) {
      const appUrl = process.env.APP_URL || 'https://abuelitoscontentos.com/capsulas';
      resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@abuelitoscontentos.com',
        to: notify_email,
        subject: `🕯️ Nueva cápsula de ${nombre} — Familia ${familia.name}`,
        html: capsuleNotifyEmail({ familyName: familia.name, nombre, para, momento, appUrl })
      }).catch(e => console.error('Email notify error:', e));
    }

    res.json({ ok: true, id: result.lastInsertRowid, audio_file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error guardando la cápsula' });
  }
});

// GET /api/capsulas?family_code=XXXX-XXXX — Listar cápsulas de la familia
router.get('/capsulas', (req, res) => {
  const { family_code } = req.query;
  if (!family_code) return res.status(400).json({ error: 'family_code requerido' });

  const familia = db.prepare('SELECT * FROM familias WHERE code = ?').get(family_code.toUpperCase());
  if (!familia) return res.status(404).json({ error: 'Familia no encontrada' });

  const capsulas = db.prepare(
    'SELECT * FROM capsulas WHERE family_code = ? ORDER BY created_at DESC'
  ).all(family_code.toUpperCase());

  // Add audio URL to each capsule
  const base = process.env.APP_URL || '';
  const withUrls = capsulas.map(c => ({
    ...c,
    audio_url: c.audio_file ? `${base}/api/audio/${c.audio_file}` : null
  }));

  res.json({ ok: true, familia, capsulas: withUrls });
});

// GET /api/capsulas/:id — Obtener cápsula individual
router.get('/capsulas/:id', (req, res) => {
  const c = db.prepare('SELECT * FROM capsulas WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Cápsula no encontrada' });
  const base = process.env.APP_URL || '';
  res.json({ ok: true, ...c, audio_url: c.audio_file ? `${base}/api/audio/${c.audio_file}` : null });
});

// PATCH /api/capsulas/:id/open — Marcar como abierta
router.patch('/capsulas/:id/open', (req, res) => {
  db.prepare('UPDATE capsulas SET opened = 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// DELETE /api/capsulas/:id — Eliminar cápsula (con archivo de audio)
router.delete('/capsulas/:id', (req, res) => {
  const c = db.prepare('SELECT * FROM capsulas WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'No encontrada' });

  if (c.audio_file) {
    const filePath = path.join(audioDir, c.audio_file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  db.prepare('DELETE FROM capsulas WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ════════════════════════════════════
   AUDIO — Streaming seguro
════════════════════════════════════ */

// GET /api/audio/:filename — Servir archivo de audio
router.get('/audio/:filename', (req, res) => {
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filePath = path.join(audioDir, filename);

  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: 'Audio no encontrado' });

  const stat = fs.statSync(filePath);
  const range = req.headers.range;

  res.setHeader('Content-Type', 'audio/webm');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'private, max-age=86400');

  if (range) {
    // Range request — streaming support
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Content-Length': chunkSize,
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.setHeader('Content-Length', stat.size);
    fs.createReadStream(filePath).pipe(res);
  }
});

/* ── Helpers ── */
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusable chars
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  let code;
  do { code = `${seg()}-${seg()}`; }
  while (db.prepare('SELECT 1 FROM familias WHERE code = ?').get(code));
  return code;
}

module.exports = router;
