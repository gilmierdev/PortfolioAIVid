// ============================================
// MAIN JAVASCRIPT FOR AI VIDEO EDITOR PORTFOLIO
// 1) Sticky nav background on scroll
// 2) Mobile menu toggle
// 3) Scroll reveal animations
// 4) Project filter functionality
// 5) Video play/pause controls
// 6) Lightbox modal
// 7) Form submission
// 8) Back to top button
// 9) Micro-interactions & lively effects
// ============================================

// 1) Sticky nav background on scroll
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Background blur on scroll
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Hide/show nav based on scroll direction
  if (currentScroll > lastScroll && currentScroll > 200) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  
  lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

// 2) Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// 3) Scroll reveal animations with staggered effect
const revealElements = document.querySelectorAll('.hero-reveal, .section-content, .project-card, .service-item, .about-image, .about-text, .tool-badge, .step');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -30px 0' });

revealElements.forEach(el => revealObserver.observe(el));

// Also reveal on load for elements already in viewport
document.addEventListener('DOMContentLoaded', () => {
  revealElements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
});

// 4) Project filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const videoCards = document.querySelectorAll('.video-card');
const aiItems = document.querySelectorAll('.ai-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.dataset.filter;
    
    // Filter projects
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'grid';
        // Add stagger animation
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
      }
    });
    
    // Filter videos
    videoCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    
    // Filter AI items
    aiItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// 5) Video play/pause controls
const cards = document.querySelectorAll('.project-card');
const allVideos = document.querySelectorAll('.card-video, .video-thumb video');

function pauseAllVideos(exceptVideo) {
  allVideos.forEach(v => {
    if (v !== exceptVideo && !v.paused) {
      v.pause();
      const card = v.closest('.project-card, .video-card');
      const btn = card?.querySelector('.play-btn, .play-overlay');
      if (btn) btn.classList.add('hidden');
    }
  });
}

cards.forEach(card => {
  const video = card.querySelector('.card-video');
  const thumb = card.querySelector('.thumb');
  const playBtn = card?.querySelector('.play-btn');
  
  if (!video) return;
  
  // Click play button on thumb
  const playOverlay = card.querySelector('.play-overlay');
  if (playOverlay) {
    playOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        pauseAllVideos(video);
        video.play();
        playOverlay.style.opacity = '0';
      } else {
        video.pause();
        playOverlay.style.opacity = '1';
      }
    });
  }
  
  // Click on video to toggle
  video.addEventListener('click', (e) => {
    e.stopPropagation();
    if (video.paused) {
      pauseAllVideos(video);
      video.play();
    } else {
      video.pause();
    }
  });
  
  // Show/hide play button based on video state
  video.addEventListener('play', () => {
    if (playBtn) playBtn.classList.add('hidden');
    if (playOverlay) playOverlay.style.opacity = '0';
  });
  
  video.addEventListener('pause', () => {
    if (playBtn) playBtn.classList.remove('hidden');
    if (playOverlay) playOverlay.style.opacity = '1';
  });
  
  video.addEventListener('ended', () => {
    if (playBtn) playBtn.classList.remove('hidden');
    if (playOverlay) playOverlay.style.opacity = '1';
  });
});

// 6) Lightbox modal
const lightbox = document.getElementById('lightbox');
const lightboxFrame = document.getElementById('lightboxFrame');
const lightboxNote = document.getElementById('lightboxNote');
const lightboxClose = document.getElementById('lightboxClose');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const video = card.querySelector('.card-video');
    const title = card.dataset.title;
    const tag = card.dataset.tag;
    const category = card.dataset.category || '';
    if (!video) return;
    
    lightboxFrame.innerHTML = '';
    const clone = video.cloneNode(true);
    clone.controls = true;
    clone.removeAttribute('preload');
    lightboxFrame.appendChild(clone);
    lightboxFrame.querySelector('.notch')?.remove();
    lightboxFrame.querySelector('.play-btn')?.remove();
    lightboxFrame.querySelector('.duration')?.remove();
    
    // Build note with title, tag, and category
    let noteText = `${title} — ${tag}`;
    if (category) noteText += ` | ${category}`;
    lightboxNote.textContent = noteText;
    
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

// 7) Back to top button
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 600) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 8) Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Message Sent!';
  btn.style.background = 'var(--accent)';
  
  setTimeout(() => {
    btn.textContent = originalText;
    contactForm.reset();
  }, 3000);
});

// 9) Micro-interactions & lively effects

// Hover expansion on project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease';
    card.style.transform = 'translateY(-12px) scale(1.02)';
    card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 170, 0.2)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
  });
});

// Pulse animation on hover filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    if (!btn.classList.contains('active')) {
      btn.style.transition = 'all 0.3s ease';
      btn.style.transform = 'scale(1.05)';
    }
  });
  
  btn.addEventListener('mouseleave', () => {
    if (!btn.classList.contains('active')) {
      btn.style.transform = 'scale(1)';
    }
  });
});

// Staggered on scroll animation
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -20px 0'
};

const staggeredObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
}, observerOptions);

document.querySelectorAll('.about-image, .about-text, .service-item, .tool-badge').forEach(el => {
  staggeredObserver.observe(el);
});

// Reduced motion support
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-speed', '0ms !important');
  revealObserver.disconnect();
  staggeredObserver.disconnect();
}