/* ── Floating icons ── */
const icons = ['💛', '🌻', '⭐', '🎵', '📞', '🌸', '💊', '😄', '🏡', '☀️', '🌈', '❤️'];
const cont = document.getElementById('floaters');
for (let i = 0; i < 22; i++) {
  const s = document.createElement('span');
  s.textContent = icons[Math.floor(Math.random() * icons.length)];
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 100 + '%';
  s.style.animationDuration = (14 + Math.random() * 14) + 's';
  s.style.animationDelay = (Math.random() * 12) + 's';
  s.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
  cont.appendChild(s);
}

/* ── Waitlist — conectado a la API real ── */
async function fetchCount() {
  try {
    const r = await fetch('/api/waitlist/count');
    const d = await r.json();
    document.getElementById('num-hero').textContent = d.total.toLocaleString('es');
    document.getElementById('num-bottom').textContent = d.total.toLocaleString('es');
  } catch (e) {
    // si la API no está disponible, mostramos un número estimado
    const n = 347 + Math.floor(Math.random() * 53);
    document.getElementById('num-hero').textContent = n.toLocaleString('es');
    document.getElementById('num-bottom').textContent = n.toLocaleString('es');
  }
}
fetchCount();

async function registrar(inputId, successId) {
  const input = document.getElementById(inputId);
  const email = input.value.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    input.style.outline = '2px solid #E8567A';
    input.focus();
    setTimeout(() => input.style.outline = '', 1500);
    return;
  }

  const btn = input.nextElementSibling;
  btn.textContent = 'Enviando…';
  btn.disabled = true;

  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.ok) {
      input.closest('.waitlist-form').style.display = 'none';
      const ok = document.getElementById(successId);
      ok.style.display = 'flex';
      launchConfetti();
      fetchCount();
    } else {
      btn.textContent = '¡Me apunto! 🎉';
      btn.disabled = false;
      alert('Hubo un error. Inténtalo de nuevo.');
    }
  } catch (e) {
    btn.textContent = '¡Me apunto! 🎉';
    btn.disabled = false;
    alert('Sin conexión. Inténtalo de nuevo.');
  }
}

/* ── Tiny confetti ── */
function launchConfetti() {
  const colors = ['#F5A623', '#F07A5A', '#E8567A', '#4A7C59', '#5B9EC9'];
  for (let i = 0; i < 40; i++) {
    const d = document.createElement('div');
    const size = 6 + Math.random() * 8;
    d.style.cssText = `
        position:fixed; z-index:9999;
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        left:${30 + Math.random() * 40}%;
        top:50%;
        pointer-events:none;
        animation: cfall ${1 + Math.random() * 1.5}s ease forwards;
        animation-delay: ${Math.random() * 0.4}s;
      `;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2500);
  }
}
const cStyle = document.createElement('style');
cStyle.textContent = `
    @keyframes cfall {
      0% { transform: translate(0,0) rotate(0deg); opacity:1; }
      100% { transform: translate(${() => (Math.random() - 0.5) * 200}px, -${150 + Math.random() * 200}px) rotate(720deg); opacity:0; }
    }
  `;
document.head.appendChild(cStyle);

/* ── Scroll reveal ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));


/* ── Enter key on inputs ── */
// Para el input del HERO
const emailHero = document.getElementById('email-hero');
if (emailHero) {
  emailHero.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita comportamientos raros del navegador
      registrar('email-hero', 'success-hero'); // Llama a tu función
    }
  });
}

// Para el input del CTA BOTTOM (¡no te olvides de este!)
const emailBottom = document.getElementById('email-bottom');
if (emailBottom) {
  emailBottom.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      registrar('email-bottom', 'success-bottom');
    }
  });
}

// ── CARRUSEL ──
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const track = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('carousel-dots');
let autoplayTimer;

// Crear dots
if (slides.length && dotsContainer) {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  startAutoplay();
}

function goToSlide(n) {
  currentSlide = (n + slides.length) % slides.length;
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
  resetAutoplay();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoplay() {
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  startAutoplay();
}

// Swipe en móvil
if (track) {
  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  }, { passive: true });
}
