/* ═══════════════════════════════════════════
   Avni Gupta Portfolio — script.js
   ═══════════════════════════════════════════ */

/* ── THEME TOGGLE ── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);
themeToggle.checked = saved === 'light';

themeToggle.addEventListener('change', () => {
  const t = themeToggle.checked ? 'light' : 'dark';
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .award-card, .proj-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1.7)';
    ring.style.opacity   = '.25';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.opacity   = '.55';
  });
});

/* ── TYPING ANIMATION ── */
const roles = [
  'Data Engineer',
  'Automation Specialist',
  'Python Developer',
  'Power BI Analyst',
  'Technology Solutions Developer'
];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typedRole');

function typeIt() {
  const word = roles[ri];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(typeIt, 2000); return; }
  } else {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeIt, deleting ? 55 : 95);
}
typeIt();

/* ── FLOATING PARTICLES ── */
const heroEl = document.getElementById('hero');
const symbols = ['01','10','{}','[]','//','>>','fn','if','&&','!=','==','->','</>','df','pd','sql','api'];

function spawnParticle() {
  const p = document.createElement('span');
  p.className = 'particle';
  p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  p.style.left   = Math.random() * 100 + '%';
  p.style.bottom = '0';
  const dur = 6 + Math.random() * 9;
  p.style.animationDuration = dur + 's';
  p.style.animationDelay    = Math.random() * 2 + 's';
  heroEl.appendChild(p);
  setTimeout(() => p.remove(), (dur + 2) * 1000);
}
setInterval(spawnParticle, 550);

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── INTERSECTION OBSERVER (scroll reveals + progress bars) ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      en.target.querySelectorAll('.progress-fill').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* Progress bars — direct observer for robustness */
document.querySelectorAll('.progress-fill').forEach(bar => {
  new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.style.width = en.target.dataset.w + '%'; });
  }, { threshold: .3 }).observe(bar);
});

/* ── SCROLL PROGRESS BAR ── */
const prog = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  prog.style.width = pct + '%';
});

/* ── ACTIVE NAV + BACK TO TOP visibility ── */
const sections   = document.querySelectorAll('section[id]');
const backToTop  = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (pageYOffset >= s.offsetTop - 220) current = s.id; });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });

  backToTop.classList.toggle('show', window.scrollY > 500);
});

/* ── BACK TO TOP ── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── CONTACT FORM ── */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');

  btn.textContent = '⏳ Sending...';
  btn.disabled = true;

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    from_name:  document.getElementById('f-name').value,
    from_email: document.getElementById('f-email').value,
    message:    document.getElementById('f-message').value,
    reply_to:   document.getElementById('f-email').value,
  })
  .then(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'var(--green)';
    status.style.display = 'block';
    status.style.color = 'var(--green)';
    status.textContent = '✔ Your message was delivered. I\'ll get back to you soon!';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = '⚡ Send Message';
      btn.style.background = '';
      btn.disabled = false;
      status.style.display = 'none';
    }, 5000);
  })
  .catch((err) => {
    btn.textContent = '⚡ Send Message';
    btn.disabled = false;
    status.style.display = 'block';
    status.style.color = '#ff5f56';
    status.textContent = '✖ Something went wrong. Please email me directly at avnigupta.works@gmail.com';
    console.error('EmailJS error:', err);
  });
});
