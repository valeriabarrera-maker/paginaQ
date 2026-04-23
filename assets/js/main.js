/* ==========================================
   QBRETE — Micro-interactions & Animations
   JavaScript vanilla (no frameworks)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. SCROLL PROGRESS BAR ──
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  // ── 2. HEADER SCROLL EFFECT ──
  const header = document.querySelector('.header');

  let targetProgress = 0;
  let currentProgress = 0;
  let rafId = null;

  function animateProgress() {
    currentProgress += (targetProgress - currentProgress) * 0.12;
    progressBar.style.transform = `scaleX(${currentProgress})`;
    if (Math.abs(targetProgress - currentProgress) > 0.0005) {
      rafId = requestAnimationFrame(animateProgress);
    } else {
      currentProgress = targetProgress;
      progressBar.style.transform = `scaleX(${currentProgress})`;
      rafId = null;
    }
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

    if (rafId === null) {
      rafId = requestAnimationFrame(animateProgress);
    }

    if (header) {
      header.classList.toggle('header--scrolled', scrollY > 60);
    }
  }, { passive: true });

  // ── 3. IMAGE LOAD SHIMMER REMOVAL ──
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    const wrapper = heroImg.closest('.hero-image-wrapper');
    if (heroImg.complete) {
      wrapper.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', () => wrapper.classList.add('loaded'));
    }
    setTimeout(() => wrapper.classList.add('loaded'), 3000);
  }

  // ── 4. SMOOTH SCROLL PARA ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target && header) {
        const headerH = header.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── 6. RIPPLE EFFECT ON BUTTONS ──
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes ripple { to { transform:scale(2.5); opacity:0; } }';
  document.head.appendChild(rippleStyle);

  document.querySelectorAll('.btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,.3); border-radius:50%;
        transform:scale(0); animation:ripple .6s ease-out forwards;
        pointer-events:none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ── 7. HAMBURGER MENU TOGGLE ──
  const hamburgerBtn = document.querySelector('.header__hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.add('mobile-nav--open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (mobileNavClose) mobileNavClose.focus();
    });

    const closeNav = () => {
      mobileNav.classList.remove('mobile-nav--open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburgerBtn.focus();
    };

    if (mobileNavClose) mobileNavClose.addEventListener('click', closeNav);

    // Close when clicking a link
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) closeNav();
    });
  }

});
