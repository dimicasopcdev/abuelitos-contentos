const express = require('express');
const db = require('../db');
const router = express.Router();

/* ════════════════════════════════════
   FAMILIA — get + update abuelito name
════════════════════════════════════ */
router.patch('/familias/:code', (req, res) => {
  const { abuelito } = req.body;
  db.prepare('UPDATE familias SET abuelito = ? WHERE code = ?').run(abuelito || '', req.params.code.toUpperCase());
  res.json({ ok: true });
});

/* ════════════════════════════════════
   MEDICAMENTOS
════════════════════════════════════ */

// GET — listar medicamentos activos de la familia
router.get('/medicamentos', (req, res) => {
  const { family_code } = req.query;
  if (!family_code) return res.status(400).json({ error: 'family_code requerido' });
  const meds = db.prepare(
    'SELECT * FROM medicamentos WHERE family_code = ? AND activo = 1 ORDER BY hora ASC'
  ).all(family_code.toUpperCase());
  res.json({ ok: true, medicamentos: meds });
});

// POST — crear medicamento
router.post('/medicamentos', (req, res) => {
  const { family_code, nombre, dosis = '', hora, dias = 'todos', color = '#F5A623' } = req.body;
  if (!family_code || !nombre || !hora) return res.status(400).json({ error: 'Faltan datos' });
  const r = db.prepare(
    'INSERT INTO medicamentos (family_code, nombre, dosis, hora, dias, color, created_at) VALUES (?,?,?,?,?,?,?)'
  ).run(family_code.toUpperCase(), nombre.trim(), dosis.trim(), hora, dias, color, new Date().toISOString());
  res.json({ ok: true, id: r.lastInsertRowid });
});

// DELETE — eliminar (soft delete)
router.delete('/medicamentos/:id', (req, res) => {
  db.prepare('UPDATE medicamentos SET activo = 0 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ════════════════════════════════════
   REGISTROS DEL DÍA
════════════════════════════════════ */

// GET — registros de una fecha
router.get('/registros', (req, res) => {
  const { family_code, fecha } = req.query;
  if (!family_code) return res.status(400).json({ error: 'family_code requerido' });
  const hoy = fecha || new Date().toISOString().slice(0, 10);
  const registros = db.prepare(
    'SELECT * FROM registros_dia WHERE family_code = ? AND fecha = ? ORDER BY created_at DESC'
  ).all(family_code.toUpperCase(), hoy);
  res.json({ ok: true, fecha: hoy, registros });
});

// POST — guardar o actualizar registro
router.post('/registros', (req, res) => {
  const { family_code, fecha, tipo, ref_id = 0, valor = 'ok', nota = '' } = req.body;
  if (!family_code || !tipo) return res.status(400).json({ error: 'Faltan datos' });
  const hoy = fecha || new Date().toISOString().slice(0, 10);
  // Upsert: si ya existe un registro del mismo tipo+ref_id+fecha, actualizar
  const existing = db.prepare(
    'SELECT id FROM registros_dia WHERE family_code = ? AND fecha = ? AND tipo = ? AND ref_id = ?'
  ).get(family_code.toUpperCase(), hoy, tipo, ref_id);

  if (existing) {
    db.prepare('UPDATE registros_dia SET valor = ?, nota = ? WHERE id = ?').run(valor, nota, existing.id);
    res.json({ ok: true, id: existing.id, updated: true });
  } else {
    const r = db.prepare(
      'INSERT INTO registros_dia (family_code, fecha, tipo, ref_id, valor, nota, created_at) VALUES (?,?,?,?,?,?,?)'
    ).run(family_code.toUpperCase(), hoy, tipo, ref_id, valor, nota, new Date().toISOString());
    res.json({ ok: true, id: r.lastInsertRowid, updated: false });
  }
});

/* ════════════════════════════════════
   DIARIO DEL CUIDADOR
════════════════════════════════════ */

// GET — últimas 30 entradas
router.get('/diario', (req, res) => {
  const { family_code } = req.query;
  if (!family_code) return res.status(400).json({ error: 'family_code requerido' });
  const entradas = db.prepare(
    'SELECT * FROM diario_cuidador WHERE family_code = ? ORDER BY fecha DESC LIMIT 30'
  ).all(family_code.toUpperCase());
  res.json({ ok: true, entradas });
});

// POST — guardar entrada del día (upsert por fecha)
router.post('/diario', (req, res) => {
  const { family_code, emoji = 'bien', momento_para_mi = 0, nota = '' } = req.body;
  if (!family_code) return res.status(400).json({ error: 'family_code requerido' });
  const hoy = new Date().toISOString().slice(0, 10);
  const existing = db.prepare(
    'SELECT id FROM diario_cuidador WHERE family_code = ? AND fecha = ?'
  ).get(family_code.toUpperCase(), hoy);

  if (existing) {
    db.prepare('UPDATE diario_cuidador SET emoji=?, momento_para_mi=?, nota=? WHERE id=?')
      .run(emoji, momento_para_mi ? 1 : 0, nota, existing.id);
    res.json({ ok: true, id: existing.id, updated: true });
  } else {
    const r = db.prepare(
      'INSERT INTO diario_cuidador (family_code, fecha, emoji, momento_para_mi, nota, created_at) VALUES (?,?,?,?,?,?)'
    ).run(family_code.toUpperCase(), hoy, emoji, momento_para_mi ? 1 : 0, nota, new Date().toISOString());
    res.json({ ok: true, id: r.lastInsertRowid });
  }
});

/* ════════════════════════════════════
   GASTOS
════════════════════════════════════ */

// GET — gastos del mes actual + meta
router.get('/gastos', (req, res) => {
  const { family_code, mes } = req.query;
  if (!family_code) return res.status(400).json({ error: 'family_code requerido' });
  const mesActual = mes || new Date().toISOString().slice(0, 7); // YYYY-MM
  const gastos = db.prepare(
    "SELECT * FROM gastos WHERE family_code = ? AND strftime('%Y-%m', fecha) = ? ORDER BY fecha DESC"
  ).all(family_code.toUpperCase(), mesActual);
  const total = gastos.reduce((s, g) => s + g.monto, 0);
  const meta = db.prepare('SELECT * FROM meta_gasto WHERE family_code = ?').get(family_code.toUpperCase());
  res.json({ ok: true, mes: mesActual, gastos, total: Math.round(total * 100) / 100, meta_mensual: meta?.meta_mensual || 200 });
});

// POST — registrar gasto
router.post('/gastos', (req, res) => {
  const { family_code, categoria, monto, fecha, nota = '' } = req.body;
  if (!family_code || !categoria || !monto) return res.status(400).json({ error: 'Faltan datos' });
  const fechaGasto = fecha || new Date().toISOString().slice(0, 10);
  const r = db.prepare(
    'INSERT INTO gastos (family_code, categoria, monto, fecha, nota, created_at) VALUES (?,?,?,?,?,?)'
  ).run(family_code.toUpperCase(), categoria, parseFloat(monto), fechaGasto, nota, new Date().toISOString());
  res.json({ ok: true, id: r.lastInsertRowid });
});

// DELETE gasto
router.delete('/gastos/:id', (req, res) => {
  db.prepare('DELETE FROM gastos WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// PUT — actualizar meta mensual
router.put('/gastos/meta', (req, res) => {
  const { family_code, meta_mensual } = req.body;
  if (!family_code || !meta_mensual) return res.status(400).json({ error: 'Faltan datos' });
  db.prepare(`
    INSERT INTO meta_gasto (family_code, meta_mensual, updated_at) VALUES (?,?,?)
    ON CONFLICT(family_code) DO UPDATE SET meta_mensual=excluded.meta_mensual, updated_at=excluded.updated_at
  `).run(family_code.toUpperCase(), parseFloat(meta_mensual), new Date().toISOString());
  res.json({ ok: true });
});

/* ════════════════════════════════════
   NOTAS FAMILIARES
════════════════════════════════════ */

// GET — últimas 50 notas
router.get('/notas', (req, res) => {
  const { family_code } = req.query;
  if (!family_code) return res.status(400).json({ error: 'family_code requerido' });
  const notas = db.prepare(
    'SELECT * FROM notas_familia WHERE family_code = ? ORDER BY created_at DESC LIMIT 50'
  ).all(family_code.toUpperCase());
  res.json({ ok: true, notas });
});

// POST — publicar nota
router.post('/notas', (req, res) => {
  const { family_code, autor, mensaje } = req.body;
  if (!family_code || !autor || !mensaje) return res.status(400).json({ error: 'Faltan datos' });
  if (mensaje.length > 300) return res.status(400).json({ error: 'Máximo 300 caracteres' });
  const r = db.prepare(
    'INSERT INTO notas_familia (family_code, autor, mensaje, created_at) VALUES (?,?,?,?)'
  ).run(family_code.toUpperCase(), autor.trim(), mensaje.trim(), new Date().toISOString());
  res.json({ ok: true, id: r.lastInsertRowid });
});

// DELETE nota
router.delete('/notas/:id', (req, res) => {
  db.prepare('DELETE FROM notas_familia WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ════════════════════════════════════
   DASHBOARD — resumen del día
════════════════════════════════════ */
router.get('/dashboard', (req, res) => {
  const { family_code } = req.query;
  if (!family_code) return res.status(400).json({ error: 'family_code requerido' });
  const fc = family_code.toUpperCase();
  const hoy = new Date().toISOString().slice(0, 10);
  const mes = new Date().toISOString().slice(0, 7);

  const familia = db.prepare('SELECT * FROM familias WHERE code = ?').get(fc);
  if (!familia) return res.status(404).json({ error: 'Familia no encontrada' });

  const medicamentos = db.prepare('SELECT * FROM medicamentos WHERE family_code = ? AND activo = 1 ORDER BY hora').all(fc);
  const registros_hoy = db.prepare('SELECT * FROM registros_dia WHERE family_code = ? AND fecha = ?').all(fc, hoy);
  const diario_hoy = db.prepare('SELECT * FROM diario_cuidador WHERE family_code = ? AND fecha = ?').get(fc, hoy);
  const gastos_mes = db.prepare("SELECT SUM(monto) as total FROM gastos WHERE family_code = ? AND strftime('%Y-%m',fecha) = ?").get(fc, mes);
  const meta = db.prepare('SELECT meta_mensual FROM meta_gasto WHERE family_code = ?').get(fc);
  const ultima_nota = db.prepare('SELECT * FROM notas_familia WHERE family_code = ? ORDER BY created_at DESC LIMIT 1').get(fc);
  const total_capsulas = db.prepare('SELECT COUNT(*) as n FROM capsulas WHERE family_code = ?').get(fc);

  res.json({
    ok: true,
    familia,
    hoy,
    medicamentos,
    registros_hoy,
    diario_hoy: diario_hoy || null,
    gasto_mes: Math.round((gastos_mes?.total || 0) * 100) / 100,
    meta_mensual: meta?.meta_mensual || 200,
    ultima_nota: ultima_nota || null,
    total_capsulas: total_capsulas.n
  });
});

module.exports = router;
