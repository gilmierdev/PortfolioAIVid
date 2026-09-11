// ============================================
// MAIN JAVASCRIPT — AI VIDEO EDITOR PORTFOLIO
// 1) Sticky nav
// 2) Mobile menu toggle
// 3) Timeline rail (scroll nav + timecode readout)
// 4) Filter functionality
// 5) Scrub-preview on video thumbnails
// 6) Lightbox modal
// 7) Contact form
// 8) Single restrained reveal animation
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1) Sticky nav background + hide on scroll down
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.pageYOffset;
  header.classList.toggle('scrolled', current > 80);

  if (current > lastScroll && current > 200) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  lastScroll = current <= 0 ? 0 : current;
}, { passive: true });

// 2) Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// 3) Timeline rail — active section highlight + timecode readout
const railDots = document.querySelectorAll('.rail-dot');
const railCode = document.getElementById('railCode');
const sectionIds = ['home', 'work', 'framework', 'services', 'about', 'contact'];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

railDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.target);
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});

function setActiveRailDot(id) {
  railDots.forEach(dot => dot.classList.toggle('active', dot.dataset.target === id));
}

const railObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveRailDot(entry.target.id);
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => railObserver.observe(section));

function formatTimecode(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateRailTimecode() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = docHeight > 0 ? window.pageYOffset / docHeight : 0;
  const runtimeSeconds = 240; // treated as a fictional total "runtime" for the scroll
  updateRailTimecode.raf = null;
  railCode.textContent = formatTimecode(fraction * runtimeSeconds);
}

window.addEventListener('scroll', () => {
  if (updateRailTimecode.raf) return;
  updateRailTimecode.raf = requestAnimationFrame(updateRailTimecode);
}, { passive: true });

updateRailTimecode();

// 4) Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});

// 5) Scrub-preview on video thumbnails
projectCards.forEach(card => {
  const video = card.querySelector('.card-video');
  const thumb = card.querySelector('.thumb');
  const scrubFill = card.querySelector('.scrub-fill');
  if (!video || !thumb) return;

  let duration = 0;
  video.addEventListener('loadedmetadata', () => { duration = video.duration || 0; });

  thumb.addEventListener('mousemove', (e) => {
    if (!duration) return;
    const rect = thumb.getBoundingClientRect();
    const fraction = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    video.currentTime = fraction * duration;
    if (scrubFill) scrubFill.style.width = `${fraction * 100}%`;
  });

  thumb.addEventListener('mouseleave', () => {
    video.currentTime = 0;
    if (scrubFill) scrubFill.style.width = '0%';
  });

  // Touch: scrub across a touch-drag instead of hover
  thumb.addEventListener('touchmove', (e) => {
    if (!duration || !e.touches[0]) return;
    const rect = thumb.getBoundingClientRect();
    const fraction = Math.min(Math.max((e.touches[0].clientX - rect.left) / rect.width, 0), 1);
    video.currentTime = fraction * duration;
    if (scrubFill) scrubFill.style.width = `${fraction * 100}%`;
  }, { passive: true });
});

// 6) Lightbox modal
const lightbox = document.getElementById('lightbox');
const lightboxFrame = document.getElementById('lightboxFrame');
const lightboxNote = document.getElementById('lightboxNote');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(card) {
  const video = card.querySelector('.card-video');
  if (!video) return;

  const title = card.dataset.title || '';
  const platform = card.dataset.platform || '';
  const duration = card.dataset.duration || '';

  lightboxFrame.innerHTML = '';
  const clone = video.cloneNode(true);
  clone.controls = true;
  clone.muted = false;
  clone.currentTime = 0;
  clone.removeAttribute('preload');
  lightboxFrame.appendChild(clone);

  lightboxNote.textContent = [title, platform, duration].filter(Boolean).join('  ·  ');
  lightbox.classList.add('open');
  clone.play().catch(() => {});
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxFrame.innerHTML = '';
}

projectCards.forEach(card => {
  card.addEventListener('click', () => openLightbox(card));
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// 7) Contact form — submits to Netlify Forms (requires deployment on Netlify)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function encodeFormData(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  formStatus.textContent = '';
  formStatus.classList.remove('error');

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeFormData(contactForm),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Submission failed');
      btn.textContent = 'Message sent';
      formStatus.textContent = "Thanks — I'll reply within a day or two.";
      contactForm.reset();
      setTimeout(() => { btn.textContent = original; }, 2600);
    })
    .catch(() => {
      btn.textContent = original;
      formStatus.textContent = "Couldn't send that. Email me directly at gilmiercabil@gmail.com instead.";
      formStatus.classList.add('error');
    })
    .finally(() => {
      btn.disabled = false;
    });
});

// 8) Single, restrained reveal — section headers only, once
if (!prefersReducedMotion) {
  document.querySelectorAll('.section-header, .intro-lead').forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}