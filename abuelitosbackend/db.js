const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'abuelitos.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT '',
    source TEXT DEFAULT 'landing',
    launched INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS familias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    abuelito TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS capsulas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_code TEXT NOT NULL,
    nombre TEXT NOT NULL,
    para TEXT NOT NULL,
    momento TEXT NOT NULL,
    msg TEXT DEFAULT '',
    audio_file TEXT DEFAULT '',
    duracion_seg INTEGER DEFAULT 0,
    opened INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_code TEXT NOT NULL,
    nombre TEXT NOT NULL,
    dosis TEXT DEFAULT '',
    hora TEXT NOT NULL,
    dias TEXT DEFAULT 'todos',
    activo INTEGER DEFAULT 1,
    color TEXT DEFAULT '#F5A623',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS registros_dia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_code TEXT NOT NULL,
    fecha TEXT NOT NULL,
    tipo TEXT NOT NULL,
    ref_id INTEGER DEFAULT 0,
    valor TEXT DEFAULT 'ok',
    nota TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS diario_cuidador (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_code TEXT NOT NULL,
    fecha TEXT NOT NULL,
    emoji TEXT DEFAULT 'bien',
    momento_para_mi INTEGER DEFAULT 0,
    nota TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_code TEXT NOT NULL,
    categoria TEXT NOT NULL,
    monto REAL NOT NULL,
    fecha TEXT NOT NULL,
    nota TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS meta_gasto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_code TEXT UNIQUE NOT NULL,
    meta_mensual REAL DEFAULT 200,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS notas_familia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_code TEXT NOT NULL,
    autor TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS care_circles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    circle_name TEXT NOT NULL,
    grandparent TEXT NOT NULL,
    creator_email TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS care_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    circle_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'cuidador',
    joined_at TEXT NOT NULL
  );
`);

// Safe migrations
['abuelito'].forEach(col => {
  try { db.exec(`ALTER TABLE familias ADD COLUMN ${col} TEXT DEFAULT '';`); } catch(e) {}
});

console.log('✅ Base de datos lista');
module.exports = db;
