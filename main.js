// ============================================
// MAIN JAVASCRIPT — AI VIDEO EDITOR PORTFOLIO
// 1) Sticky nav
// 2) Mobile menu toggle
// 3) Timeline rail (scroll nav + timecode readout)
// 4) Single restrained reveal animation
// 5) Google Drive video portfolio (featured video work)
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Open straight on the video portfolio section on load / refresh
window.addEventListener('load', () => {
  const portfolio = document.getElementById('video-portfolio');
  if (portfolio) portfolio.scrollIntoView();
});

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
const sectionIds = ['home', 'video-portfolio', 'framework', 'services', 'about', 'contact'];
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

// 4) Single, restrained reveal — section headers only, once
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

// ============================================
// 5) Google Drive video portfolio
// --------------------------------------------
// Add or remove videos from the `videos` array below.
// Each video object accepts:
//   title       — shown on the card and in the modal
//   category    — "AI Ads", "Video Editing", "Social Media" or "Other"
//                 (linked to the filter buttons, case-insensitive)
//   description — short description shown on the card and in the modal
//   driveUrl    — Google Drive share link, e.g.
//                 https://drive.google.com/file/d/FILE_ID/view
//                 The FILE_ID is extracted automatically. Other formats
//                 such as .../view?usp=sharing, .../preview and
//                 .../open?id=FILE_ID are also supported.
//   thumbnail   — OPTIONAL custom thumbnail image path/URL.
//                 When empty or missing, a CSS-designed placeholder is
//                 shown instead. A Drive thumbnail URL is never assumed.
//
// Videos stay hosted on Google Drive. An iframe with
// https://drive.google.com/file/d/FILE_ID/preview is created only when
// the user opens a video, and removed again when the modal closes.
// ============================================

const videos = [
  {
    title: "AI Product Advertisement",
    category: "AI Ads",
    description: "AI-generated product advertisement created for a marketing campaign.",
    driveUrl: "https://drive.google.com/file/d/1YqKH3NRDqfuTgzvopBkwZ5eGVpIH3Rmp/view?usp=drive_link",
    thumbnail: "./assets/thumbnails/2.png"
  },
  {
    title: "AI Product Advertisement",
    category: "AI Ads",
    description: "AI-generated product advertisement created for a marketing campaign.",
    driveUrl: "https://drive.google.com/file/d/1FPyNt5-WvR8PPxaU5bKAobQd32uabrCQ/view?usp=drive_link",
    thumbnail: "./assets/thumbnails/3.png"
  },
  {
    title: "Social Media Advertisement",
    category: "Social Media",
    description: "Short-form promotional video edited for social media.",
    driveUrl: "https://drive.google.com/file/d/1A08ywN6TyWPc3Eock8opXAnA2ObHqHB5/view?usp=drive_link",
    thumbnail: "./assets/thumbnails/4.png"
  },
  {
    title: "UGC-Style Product Promo",
    category: "AI Ads",
    description: "Native-feeling creator ad built with AI-generated footage.",
    driveUrl: "https://drive.google.com/file/d/1JAqho9Tt7Idwog4bepQV0Mhw54NP5_HS/view?usp=drive_link",
    thumbnail: "./assets/thumbnails/5.png"
  },
  {
    title: "Brand Story Edit",
    category: "Video Editing",
    description: "Narrative cut mixing motion graphics with live-action footage.",
    driveUrl: "https://drive.google.com/file/d/1m8287eaD28jFKDWtPxR1OpglWcAXenaL/view?usp=drive_link",
    thumbnail: "./assets/thumbnails/6.png"
  },
  {
    title: "Short-Form Campaign Teaser",
    category: "Social Media",
    description: "Caption-heavy teaser paced for a fast-feed platform.",
    driveUrl: "https://drive.google.com/file/d/1FIAR8fb95SNZ2wuryj5fPkj9fGVcIOST/view?usp=drive_link",
    thumbnail: "./assets/thumbnails/1.png"
  },
  {
    title: "Concept Reel",
    category: "Other",
    description: "Experimental AI-style tests and works-in-progress reel.",
    driveUrl: "https://drive.google.com/file/d/YOUR_DRIVE_FILE_ID/view",
    thumbnail: ""
  }
];

function escapeHtml(str) {
  return String(str === null || str === undefined ? '' : str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function extractDriveFileId(url) {
  const value = String(url || '').trim();
  if (!value) return null;
  // https://drive.google.com/file/d/FILE_ID/view (+ ?usp=sharing, /preview, /edit, ...)
  const fileMatch = value.match(/\/file\/d\/([^/]+?)(?=[/?#]|$)/);
  if (fileMatch) return fileMatch[1];
  // https://drive.google.com/open?id=FILE_ID (+ &usp=sharing, ...)
  const openMatch = value.match(/[?&]id=([^&]+)/);
  if (openMatch) return openMatch[1];
  // https://drive.google.com/uc?export=view&id=FILE_ID (direct-link forms)
  const ucMatch = value.match(/drive\.google\.com\/uc\?export=[^&]+&id=([^&]+)/);
  if (ucMatch) return ucMatch[1];
  return null;
}

function drivePreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

const videoGrid = document.getElementById('videoGrid');
const videoFilterBtns = document.querySelectorAll('.video-filter');
const videoModal = document.getElementById('videoModal');
const videoPlayerContainer = document.getElementById('videoPlayerContainer');
const videoModalTitle = document.getElementById('videoModalTitle');
const videoModalCategory = document.getElementById('videoModalCategory');
const videoModalDesc = document.getElementById('videoModalDesc');
const videoModalClose = document.getElementById('videoModalClose');
let videoModalFocus = null;

function createVideoCard(video, index, delay) {
  const title = escapeHtml(video.title);
  const category = escapeHtml(video.category);
  const description = escapeHtml(video.description || '');
  const thumb = video.thumbnail
    ? `<img src="${escapeHtml(video.thumbnail)}" alt="${title} - video thumbnail" loading="lazy" onerror="this.style.display='none'">`
    : '';
  const style = delay === undefined ? '' : ` style="animation-delay:${delay}ms"`;

  return `<button type="button" class="video-card is-enter"${style}
      data-video-index="${index}"
      aria-label="Play video: ${title}">
      <span class="vc-thumb">
        ${thumb}
        <span class="vc-play" aria-hidden="true">
          <span class="vc-play-ico">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <span class="vc-watch">Watch video</span>
        </span>
      </span>
      <span class="vc-info">
        <span class="vc-category">${category}</span>
        <span class="vc-title">${title}</span>
        <span class="vc-desc">${description}</span>
      </span>
    </button>`;
}

function renderVideos(category = 'all') {
  const normalized = String(category).toLowerCase();
  const filtered = videos
    .map((video, index) => ({ video, index }))
    .filter(({ video }) => normalized === 'all' || String(video.category).toLowerCase() === normalized);

  videoGrid.innerHTML = filtered
    .map(({ video, index }, position) => createVideoCard(video, index, position * 60))
    .join('');
}

function filterVideos(category) {
  const active = String(category || 'all');
  videoFilterBtns.forEach((btn) => {
    const isActive = btn.dataset.category === active;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  renderVideos(active);
}

function openVideo(video) {
  const fileId = video ? extractDriveFileId(video.driveUrl) : null;
  if (!fileId) {
    console.error('Video portfolio: could not extract a Google Drive file ID from:', video && video.driveUrl);
    return;
  }

  videoModalFocus = document.activeElement;

  const iframe = document.createElement('iframe');
  iframe.src = drivePreviewUrl(fileId);
  iframe.title = video.title ? `Video: ${video.title}` : 'Google Drive video';
  iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');

  videoPlayerContainer.innerHTML = '';
  videoPlayerContainer.appendChild(iframe);

  videoModalTitle.textContent = video.title || '';
  videoModalCategory.textContent = video.category || '';
  videoModalDesc.textContent = video.description || '';

  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  videoModalClose.focus();
}

function closeVideo() {
  if (!videoModal.classList.contains('open')) return;
  videoModal.classList.remove('open');
  videoPlayerContainer.innerHTML = '';
  videoModalTitle.textContent = '';
  videoModalCategory.textContent = '';
  videoModalDesc.textContent = '';
  document.body.style.overflow = '';
  if (videoModalFocus && videoModalFocus.focus) videoModalFocus.focus();
}

videoGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.video-card');
  if (!card) return;
  const video = videos[Number(card.dataset.videoIndex)];
  if (video) openVideo(video);
});

videoFilterBtns.forEach((btn) => {
  btn.addEventListener('click', () => filterVideos(btn.dataset.category));
});

videoModalClose.addEventListener('click', closeVideo);
videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) closeVideo();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideo();
});

renderVideos('all');