// ============================================
// GILMIER EJ CABIL — AI VIDEO PORTFOLIO
// High-Detail UI/UX Interactions & Direct Player
// ============================================

const videos = [
  {
    title: "AI Product Advertisement",
    duration: "00:30",
    driveUrl: "https://drive.google.com/file/d/1YqKH3NRDqfuTgzvopBkwZ5eGVpIH3Rmp/view?usp=drive_link",
    thumbnail: "assets/thumbnails/2.png"
  },
  {
    title: "AI Product Showcase",
    duration: "00:25",
    driveUrl: "https://drive.google.com/file/d/1FPyNt5-WvR8PPxaU5bKAobQd32uabrCQ/view?usp=drive_link",
    thumbnail: "assets/thumbnails/3.png"
  },
  {
    title: "Social Media Advertisement",
    duration: "00:15",
    driveUrl: "https://drive.google.com/file/d/11Rz761o8WrVvBeWuD-zubItv9E6QeTOu/view?usp=sharing",
    thumbnail: "assets/thumbnails/4.png"
  },
  {
    title: "UGC-Style Product Promo",
    duration: "00:30",
    driveUrl: "https://drive.google.com/file/d/1JAqho9Tt7Idwog4bepQV0Mhw54NP5_HS/view?usp=drive_link",
    thumbnail: "assets/thumbnails/5.png"
  },
  {
    title: "Brand Story Edit",
    duration: "00:45",
    driveUrl: "https://drive.google.com/file/d/1m8287eaD28jFKDWtPxR1OpglWcAXenaL/view?usp=drive_link",
    thumbnail: "assets/thumbnails/6.png"
  },
  {
    title: "Short-Form Campaign Teaser",
    duration: "00:15",
    driveUrl: "https://drive.google.com/file/d/1FIAR8fb95SNZ2wuryj5fPkj9fGVcIOST/view?usp=drive_link",
    thumbnail: "assets/thumbnails/1.png"
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
  const fileMatch = value.match(/\/file\/d\/([^/]+?)(?=[/?#]|$)/);
  if (fileMatch) return fileMatch[1];
  const openMatch = value.match(/[?&]id=([^&]+)/);
  if (openMatch) return openMatch[1];
  const ucMatch = value.match(/drive\.google\.com\/uc\?export=[^&]+&id=([^&]+)/);
  if (ucMatch) return ucMatch[1];
  return null;
}

function drivePreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

// --------------------------------------------
// 1. SCROLL PROGRESS BAR (UI/UX DETAIL)
// --------------------------------------------
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (!scrollProgress) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const current = window.scrollY;
  const pct = total > 0 ? (current / total) * 100 : 0;
  scrollProgress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}, { passive: true });

// --------------------------------------------
// 2. LIVE MANILA, PH TIME (UI/UX DETAIL)
// --------------------------------------------
function updateManilaTime() {
  const el = document.getElementById('manilaTime');
  if (!el) return;
  try {
    const now = new Date();
    const formatted = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    el.textContent = `• ${formatted}`;
  } catch (e) {
    el.textContent = '• GMT+8';
  }
}
updateManilaTime();
setInterval(updateManilaTime, 30000);

// --------------------------------------------
// 3. VIDEO EDITOR TIMECODE TICKER
// --------------------------------------------
const heroTimecode = document.getElementById('heroTimecode');
if (heroTimecode) {
  let frame = 12;
  let sec = 24;
  setInterval(() => {
    frame = (frame + 1) % 30;
    if (frame === 0) sec = (sec + 1) % 60;
    const fStr = frame.toString().padStart(2, '0');
    const sStr = sec.toString().padStart(2, '0');
    heroTimecode.textContent = `REC 00:00:${sStr}:${fStr}`;
  }, 100);
}

// --------------------------------------------
// 4. VIDEO GRID & DIRECT PLAY (NO MODAL)
// --------------------------------------------
const videoGrid = document.getElementById('videoGrid');
let currentlyPlayingCard = null;

function createVideoCard(video, index) {
  const title = escapeHtml(video.title);
  const fileId = extractDriveFileId(video.driveUrl);
  const thumbSrc = video.thumbnail ? escapeHtml(video.thumbnail) : '';
  const num = (index + 1).toString().padStart(2, '0');
  const duration = escapeHtml(video.duration || '00:30');

  const posterHtml = thumbSrc
    ? `<img src="${thumbSrc}" alt="${title}" class="video-thumb" loading="lazy">`
    : `<div class="static-placeholder"><span class="static-text">${title}</span></div>`;

  return `
    <article class="video-card" data-video-index="${index}" data-file-id="${escapeHtml(fileId || '')}">
      <div class="video-media-wrap">
        <div class="video-poster-box" aria-label="Play ${title}">
          ${posterHtml}
          <div class="media-corner-info">
            <span class="media-aspect-badge">9:16</span>
            <span class="media-duration">${duration}</span>
          </div>
          <div class="play-overlay">
            <button class="play-btn" type="button" aria-label="Play ${title}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="video-meta">
        <span class="video-num">${num}</span>
        <h3 class="video-title">${title}</h3>
      </div>
    </article>
  `;
}

function renderVideos() {
  if (!videoGrid) return;
  videoGrid.innerHTML = videos.map((video, index) => createVideoCard(video, index)).join('');
}

function stopCurrentVideo() {
  if (!currentlyPlayingCard) return;

  const card = currentlyPlayingCard;
  const index = Number(card.dataset.videoIndex);
  const video = videos[index];
  const mediaWrap = card.querySelector('.video-media-wrap');

  if (mediaWrap && video) {
    const title = escapeHtml(video.title);
    const thumbSrc = video.thumbnail ? escapeHtml(video.thumbnail) : '';
    const duration = escapeHtml(video.duration || '00:30');
    const posterHtml = thumbSrc
      ? `<img src="${thumbSrc}" alt="${title}" class="video-thumb" loading="lazy">`
      : `<div class="static-placeholder"><span class="static-text">${title}</span></div>`;

    mediaWrap.innerHTML = `
      <div class="video-poster-box" aria-label="Play ${title}">
        ${posterHtml}
        <div class="media-corner-info">
          <span class="media-aspect-badge">9:16</span>
          <span class="media-duration">${duration}</span>
        </div>
        <div class="play-overlay">
          <button class="play-btn" type="button" aria-label="Play ${title}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  card.classList.remove('is-playing');
  currentlyPlayingCard = null;
}

function playVideoInline(card) {
  if (card === currentlyPlayingCard && card.classList.contains('is-playing')) {
    return;
  }

  // Stop previous video if one is active
  stopCurrentVideo();

  const index = Number(card.dataset.videoIndex);
  const video = videos[index];
  if (!video) return;

  const fileId = card.dataset.fileId || extractDriveFileId(video.driveUrl);
  if (!fileId) return;

  const mediaWrap = card.querySelector('.video-media-wrap');
  if (!mediaWrap) return;

  card.classList.add('is-playing');
  currentlyPlayingCard = card;

  const iframeSrc = drivePreviewUrl(fileId);

  // Inject responsive player with live Equalizer badge & close button
  mediaWrap.innerHTML = `
    <div class="video-embed-box">
      <div class="embed-top-bar">
        <div class="now-playing-badge" aria-label="Now playing inline">
          <span class="eq-bar bar-1"></span>
          <span class="eq-bar bar-2"></span>
          <span class="eq-bar bar-3"></span>
          <span class="np-text">Playing</span>
        </div>
        <button type="button" class="video-stop-btn" aria-label="Close video (Esc)" title="Close video (Esc)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span class="esc-tag">Esc</span>
        </button>
      </div>

      <div class="embed-loader" aria-hidden="true">
        <span class="loader-spinner"></span>
        <span class="loader-label">Buffering cut...</span>
      </div>

      <iframe
        src="${iframeSrc}"
        title="${escapeHtml(video.title)}"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        loading="eager"
        onload="this.parentElement.querySelector('.embed-loader')?.remove();">
      </iframe>
    </div>
  `;
}

// Click listener on video grid
if (videoGrid) {
  videoGrid.addEventListener('click', (e) => {
    const stopBtn = e.target.closest('.video-stop-btn');
    if (stopBtn) {
      e.stopPropagation();
      stopCurrentVideo();
      return;
    }

    if (e.target.closest('.video-embed-box')) return;

    const card = e.target.closest('.video-card');
    if (card) playVideoInline(card);
  });
}

// Press Escape key to close active video
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentlyPlayingCard) {
    stopCurrentVideo();
  }
});

// Initial render
renderVideos();

// --------------------------------------------
// 5. RELIABLE NAVIGATION & SCROLL HANDLING
// --------------------------------------------
const siteHeader = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = ['home', 'projects', 'about', 'contact'].map(id => document.getElementById(id)).filter(Boolean);

// Sticky header class
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    siteHeader?.classList.add('is-scrolled');
  } else {
    siteHeader?.classList.remove('is-scrolled');
  }
}, { passive: true });

// Mobile toggle
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Explicit smooth scroll handler for all hash anchors
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    e.preventDefault();

    // Close mobile nav if open
    navMenu?.classList.remove('is-open');
    navToggle?.classList.remove('is-active');
    navToggle?.setAttribute('aria-expanded', 'false');

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#home'));
      if (history.replaceState) history.replaceState(null, '', ' ');
      return;
    }

    const targetEl = document.querySelector(href);
    if (targetEl) {
      const headerOffset = 76;
      const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: 'smooth'
      });
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === href));
      if (history.replaceState) history.replaceState(null, '', href);
    }
  });
});

// Active scroll spy with top-of-page safety check
function updateActiveNavLink() {
  if (window.scrollY < 160) {
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#home'));
    return;
  }

  const scrollMiddle = window.scrollY + 180;
  let currentSectionId = 'home';

  sections.forEach(sec => {
    if (sec.offsetTop <= scrollMiddle) {
      currentSectionId = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// Ensure page starts at top 0 on load if on Home or no hash
window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash || window.location.hash === '#home') {
    window.scrollTo(0, 0);
  }
});

// --------------------------------------------
// 6. TOAST NOTIFICATION HELPER
// --------------------------------------------
const toastNotice = document.getElementById('toastNotice');
let toastTimer = null;

function showToast(message) {
  if (!toastNotice) return;
  clearTimeout(toastTimer);
  toastNotice.textContent = message;
  toastNotice.classList.add('show');
  toastTimer = setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 2500);
}

// --------------------------------------------
// 7. TACTILE COPY EMAIL
// --------------------------------------------
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = 'gilmiercabil@gmail.com';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      copyEmailBtn.classList.add('copied');
      const copyText = copyEmailBtn.querySelector('.copy-text');
      if (copyText) copyText.textContent = 'Copied!';

      showToast(`Email copied: ${email}`);

      setTimeout(() => {
        copyEmailBtn.classList.remove('copied');
        if (copyText) copyText.textContent = 'Copy';
      }, 2200);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  });
}