// ============================================
// SIMPLE JAVASCRIPT
// 1) toggle the mobile menu
// 2) play/pause video on play-btn click (pause other videos)
// 3) close the lightbox (keep for any future use)
// ============================================

// 1) Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// 2) Play/pause video when clicking the play button or video
const cards = document.querySelectorAll('.card');
const allVideos = document.querySelectorAll('.card-video');

function pauseAllVideos(exceptVideo) {
  allVideos.forEach(v => {
    if (v !== exceptVideo && !v.paused) {
      v.pause();
      const card = v.closest('.card');
      const btn = card?.querySelector('.play-btn');
      if (btn) btn.classList.remove('hidden');
    }
  });
}

cards.forEach(card => {
  const video = card.querySelector('.card-video');
  const playBtn = card.querySelector('.play-btn');

  if (video && playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        pauseAllVideos(video);
        video.play();
        playBtn.classList.add('hidden');
      } else {
        video.pause();
        playBtn.classList.remove('hidden');
      }
    });

    // Also toggle on video click
    video.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        pauseAllVideos(video);
        video.play();
        playBtn.classList.add('hidden');
      } else {
        video.pause();
        playBtn.classList.remove('hidden');
      }
    });

    // Show play button when video ends
    video.addEventListener('ended', () => {
      playBtn.classList.remove('hidden');
    });

    // Show play button when video is paused
    video.addEventListener('pause', () => {
      playBtn.classList.remove('hidden');
    });
  }
});

// 3) Lightbox — open on card click, close via X or backdrop click
const lightbox = document.getElementById('lightbox');
const lightboxFrame = document.getElementById('lightboxFrame');
const lightboxNote = document.getElementById('lightboxNote');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const video = card.querySelector('.card-video');
    const title = card.dataset.title;
    const tag = card.dataset.tag;
    if (!video) return;

    lightboxFrame.innerHTML = '';
    const clone = video.cloneNode(true);
    clone.controls = true;
    clone.removeAttribute('preload');
    lightboxFrame.appendChild(clone);
    lightboxFrame.querySelector('.notch')?.remove();
    lightboxFrame.querySelector('.play-btn')?.remove();
    lightboxFrame.querySelector('.duration')?.remove();

    lightboxNote.textContent = `${title} — ${tag}`;
    lightbox.classList.add('open');
    clone.play();
  });
});

document.getElementById('lightboxClose').addEventListener('click', () => {
  lightbox.classList.remove('open');
  lightboxFrame.innerHTML = '';
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('open');
    lightboxFrame.innerHTML = '';
  }
});