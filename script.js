/* ============================================================
   emjay Odsinada— PORTFOLIO JAVASCRIPT
   Features: Preloader, Custom Cursor, Typed Text, Canvas Particles,
   Scroll Animations, Navbar, Theme Toggle, Portfolio Filter,
   Testimonial Slider, Form Validation, Back-To-Top
   ============================================================ */

'use strict';

// ── DOM READY ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────────────────
  // 1. PRELOADER
  // ────────────────────────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger hero entrance
      document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        if (isInViewport(el)) el.classList.add('revealed');
      });
    }, 900);
  });

  // ────────────────────────────────────────────────────────────
  // 2. CUSTOM CURSOR
  // ────────────────────────────────────────────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Smooth ring follow
  const animateCursor = () => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Hover states
  document.querySelectorAll('a, button, .project-card, .service-card, .filter-btn, .tech-chip, .tctrl-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.5'; });

  // ────────────────────────────────────────────────────────────
  // 3. HERO CANVAS — PARTICLE NETWORK
  // ────────────────────────────────────────────────────────────
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [], mouseX = -9999, mouseY = -9999;
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 140;
  const MOUSE_RADIUS = 120;

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.8 + 0.6;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Mouse repulsion
      const dx = this.x - mouseX, dy = this.y - mouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 1.5;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }
      // Wrap
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist/CONNECT_DIST) * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  };
  drawParticles();

  // ────────────────────────────────────────────────────────────
  // 4. TYPED TEXT ANIMATION
  // ────────────────────────────────────────────────────────────
  const typedEl = document.getElementById('typed-text');
  const roles = [
    'Web Developer',
    'Video Editor',
    'Graphic Designer',
    'Creative Thinker',
    'UI/UX Designer'
  ];
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  const typeLoop = () => {
    const current = roles[roleIndex];
    if (isDeleting) {
      typedEl.textContent = current.slice(0, --charIndex);
    } else {
      typedEl.textContent = current.slice(0, ++charIndex);
    }

    let delay = isDeleting ? 60 : 100;
    if (!isDeleting && charIndex === current.length) {
      delay = 1800; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(typeLoop, delay);
  };
  setTimeout(typeLoop, 1200);

  // ────────────────────────────────────────────────────────────
  // 5. NAVBAR — SCROLL & MOBILE
  // ────────────────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateBackToTop();
  });

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ────────────────────────────────────────────────────────────
  // 6. THEME TOGGLE
  // ────────────────────────────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  // Persist theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  // ────────────────────────────────────────────────────────────
  // 7. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
  // ────────────────────────────────────────────────────────────
  const isInViewport = el => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.92 && r.bottom > 0;
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Trigger skill bars when they enter view
        if (entry.target.closest('#skills')) {
          animateSkillBars();
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // ────────────────────────────────────────────────────────────
  // 8. SKILL BAR ANIMATION
  // ────────────────────────────────────────────────────────────
  let skillsAnimated = false;
  const animateSkillBars = () => {
    if (skillsAnimated) return;
    skillsAnimated = true;
    document.querySelectorAll('.skill-fill').forEach((bar, i) => {
      const target = bar.getAttribute('data-width');
      setTimeout(() => {
        bar.style.width = target + '%';
      }, i * 80);
    });
  };

  // Also observe skills section directly
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) animateSkillBars();
    }, { threshold: 0.2 }).observe(skillsSection);
  }

  // ────────────────────────────────────────────────────────────
  // 9. PORTFOLIO FILTER
  // ────────────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.display = '';
          // Re-trigger animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 380);
        }
      });
    });
  });

  // ────────────────────────────────────────────────────────────
  // 10. TESTIMONIAL SLIDER
  // ────────────────────────────────────────────────────────────
  const track  = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('tctrl-dots');
  const cards  = track ? track.querySelectorAll('.testimonial-card') : [];
  let current  = 0, autoplayTimer;

  if (cards.length > 0) {
    // Build dots
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'tctrl-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });

    const goTo = (idx) => {
      current = (idx + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.tctrl-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    document.getElementById('tprev').addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    document.getElementById('tnext').addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

    // Autoplay
    const startAutoplay = () => { autoplayTimer = setInterval(() => goTo(current + 1), 5000); };
    const resetAutoplay = () => { clearInterval(autoplayTimer); startAutoplay(); };
    startAutoplay();

    // Touch / drag support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAutoplay(); }
    });
  }

  // ────────────────────────────────────────────────────────────
  // 11. CONTACT FORM VALIDATION
  // ────────────────────────────────────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    const nameInput    = document.getElementById('cf-name');
    const emailInput   = document.getElementById('cf-email');
    const messageInput = document.getElementById('cf-message');
    const errName      = document.getElementById('err-name');
    const errEmail     = document.getElementById('err-email');
    const errMessage   = document.getElementById('err-message');
    const successMsg   = document.getElementById('form-success');
    const btnLabel     = form.querySelector('.btn-label');

    const validate = () => {
      let valid = true;
      errName.textContent = '';
      errEmail.textContent = '';
      errMessage.textContent = '';

      if (!nameInput.value.trim()) {
        errName.textContent = 'Please enter your name.';
        nameInput.focus(); valid = false;
      } else if (nameInput.value.trim().length < 2) {
        errName.textContent = 'Name must be at least 2 characters.';
        valid = false;
      }

      if (!emailInput.value.trim()) {
        errEmail.textContent = 'Please enter your email address.';
        if (valid) { emailInput.focus(); } valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        errEmail.textContent = 'Please enter a valid email address.';
        valid = false;
      }

      if (!messageInput.value.trim()) {
        errMessage.textContent = 'Please enter a message.';
        if (valid) { messageInput.focus(); } valid = false;
      } else if (messageInput.value.trim().length < 10) {
        errMessage.textContent = 'Message must be at least 10 characters.';
        valid = false;
      }

      return valid;
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate()) return;

      // Simulate submission
      btnLabel.textContent = 'Sending...';
      form.querySelector('.btn-primary').disabled = true;

      setTimeout(() => {
        form.reset();
        form.querySelector('.btn-primary').style.display = 'none';
        successMsg.style.display = 'flex';
        btnLabel.textContent = 'Send Message';
        form.querySelector('.btn-primary').disabled = false;

        // Hide success after 5s
        setTimeout(() => {
          successMsg.style.display = 'none';
          form.querySelector('.btn-primary').style.display = '';
        }, 5000);
      }, 1200);
    });

    // Live validation
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('blur', () => validate());
    });
  }

  // ────────────────────────────────────────────────────────────
  // 12. BACK TO TOP
  // ────────────────────────────────────────────────────────────
  const btt = document.getElementById('back-to-top');
  const updateBackToTop = () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  };
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ────────────────────────────────────────────────────────────
  // 13. ACTIVE NAV LINK ON SCROLL (Highlight)
  // ────────────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) {
        a.style.color = 'var(--accent)';
      }
    });
  };
  window.addEventListener('scroll', highlightNav);

  // ────────────────────────────────────────────────────────────
  // 14. FOOTER YEAR
  // ────────────────────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ────────────────────────────────────────────────────────────
  // 15. SMOOTH SCROLL for anchor links
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ────────────────────────────────────────────────────────────
  // 16. ABOUT IMAGE — Tilt Effect
  // ────────────────────────────────────────────────────────────
  const aboutImg = document.querySelector('.about-img-wrapper');
  if (aboutImg) {
    aboutImg.addEventListener('mousemove', e => {
      const r = aboutImg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      aboutImg.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
    aboutImg.addEventListener('mouseleave', () => {
      aboutImg.style.transform = '';
    });
  }

  // ────────────────────────────────────────────────────────────
  // 17. SERVICE CARD ripple on click
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', e => {
      const ripple = document.createElement('span');
      const r = card.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - r.left - size/2}px;
        top:${e.clientY - r.top - size/2}px;
        background:rgba(56,189,248,0.1);
        transform:scale(0); pointer-events:none;
        animation: ripple-anim 0.6s ease forwards;
      `;
      if (!document.getElementById('ripple-style')) {
        const st = document.createElement('style');
        st.id = 'ripple-style';
        st.textContent = '@keyframes ripple-anim{to{transform:scale(1);opacity:0}}';
        document.head.appendChild(st);
      }
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ────────────────────────────────────────────────────────────
  // 18. COUNTER ANIMATION for hero stats
  // ────────────────────────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  const animateStats = () => {
    if (statsAnimated) return;
    statsAnimated = true;
    statNums.forEach(el => {
      const target = parseInt(el.textContent);
      const suffix = el.textContent.replace(/[0-9]/g, '');
      let count = 0;
      const step = target / 50;
      const interval = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = Math.floor(count) + suffix;
        if (count >= target) clearInterval(interval);
      }, 30);
    });
  };

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) animateStats();
  }, { threshold: 0.5 }).observe(document.querySelector('.hero-stats') || document.body);

  // Trigger on load since hero is visible
  setTimeout(animateStats, 1500);

});
