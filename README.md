# 🌻 Abuelitos Contentos

> *"Por ella soy capaz de lo imposible."* — Argenis Carruyo

**La app que une a las familias en el cuidado de sus mayores.**


## 💛 La historia detrás del proyecto

Me llamo Dimitry. Soy cuidador de mi mamá, que tiene 81 años y tiene incapacidad visual de 80%. No salgo de casa porque la cuido todos los días.

Un día pensé: si yo tengo este problema, ¿cuántas familias más lo tienen?

Cuidar a un adulto mayor es un acto de amor. Pero también es agotador, solitario, y difícil de coordinar cuando la familia está separada. 

Nadie sabe si tomó las pastillas. Nadie registra cómo se siente el cuidador. Nadie guarda esas historias que se van con el tiempo.

**Abuelitos Contentos nació de esa realidad.**

---

## 🚀 Demo en vivo

👉 **[https://abuelitoscontentos.com](https://abuelitoscontentos.com)**
📱 **App:** [https://abuelitoscontentos.com/app.html](https://abuelitoscontentos.com/app.html)
🕯️ **Cápsulas de Vida:** [https://abuelitoscontentos.com/capsulas.html](https://abuelitoscontentos.com/capsulas.html)

---

## ✨ Funcionalidades principales

### 💊 Cuidado diario coordinado
- Registro de medicamentos con horarios y colores
- Marcado de toma con un solo toque
- Seguimiento de alimentación (desayuno, almuerzo, cena)
- Notas del día compartidas con toda la familia

### 💰 Control de gastos
- Registro por categorías (medicina, alimento, transporte, emergencia)
- Meta mensual con alerta cuando se acerca al límite

### 💙 Diario del cuidador
- Espacio íntimo para registrar el estado emocional
- Gráfica de los últimos 14 días
- Porque quien cuida también necesita que lo cuiden

### 🕯️ Cápsulas de Vida — Lo más especial
**La función que ninguna app tiene.**

El abuelito graba mensajes de voz guardados para siempre en la nube, programados para momentos específicos del futuro: su graduación, su boda, cuando esté triste, cuando ya no esté.

**Diseñada para personas con discapacidad visual:** guía de voz paso a paso, botón grande táctil, sin necesidad de leer nada.

### 📋 Tablero familiar de notas
Mensajes entre cuidadores con código familiar compartido. Sin redes sociales, sin publicidad.

### 📧 Emails automáticos con Resend
Confirmaciones, notificaciones de cápsulas e invitaciones familiares desde hola@abuelitoscontentos.com

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express |
| Base de datos | SQLite (better-sqlite3) |
| Emails | Resend API |
| Frontend | HTML + CSS + JavaScript (PWA) |
| Servidor | **CubePath VPS** (Ubuntu 22, Miami) |
| Proxy | Nginx + SSL (Let's Encrypt) |
| Proceso | PM2 |

---

## ☁️ Cómo se usa CubePath

Desplegado en un **VPS gp.nano de CubePath** (1 vCPU, 2GB RAM, 40GB SSD) en Miami, Florida.

```
https://abuelitoscontentos.com → Nginx (443/SSL)
                                        ↓
                                Node.js (3000)
                                        ↓
                              SQLite (abuelitos.db)
```

**IP:** `157.254.174.239` · **VPS:** CubePath gp.nano · **OS:** Ubuntu 22.04

---

## 🚀 Instalación local

```bash
git clone https://github.com/dimicasopcdev/abuelitos-contentos.git
cd abuelitos-contentos/abuelitosbackend
npm install
cp .env.example .env
# Edita .env con tus valores
npm run dev
# http://localhost:3000/app.html
```

---

## 🌍 Impacto

- Para **cuidadores reales** en Latinoamérica
- Accesible para personas con **discapacidad visual**
- **Cero costo** para las familias
- Construido desde **Venezuela** 🇻🇪 con amor

---

## 👨‍💻 Autor

**Dimitry Castillo Ramírez** — [@dimicasopcdev](https://github.com/dimicasopcdev)

Cuidador, desarrollador, y creyente de que la tecnología puede hacer el amor más duradero.

---

*Hecho con ❤️ para los abuelitos del mundo · abuelitoscontentos.com*
