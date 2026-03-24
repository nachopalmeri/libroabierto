/* =============================================
   A LIBRO ABIERTO — Interactive Scripts
   ============================================= */

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initParticles();
  initSmoothScroll();
  initCatalogLinks();
});

// =============================================
// NAVBAR — Scroll effect
// =============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// =============================================
// MOBILE MENU — Hamburger toggle
// =============================================
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// =============================================
// SCROLL REVEAL — IntersectionObserver
// =============================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px . 0px -60px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

// =============================================
// PARTICLES — Canvas animated background
// =============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
      this.fadeDir = 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeSpeed * this.fadeDir;

      if (this.opacity >= 0.5) this.fadeDir = -1;
      if (this.opacity <= 0.05) this.fadeDir = 1;

      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 114, 42, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 114, 42, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  resizeCanvas();
  createParticles();
  animate();

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createParticles();
    }, 250);
  });

  // Pause animation when hero is not visible
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!animationId) animate();
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    { threshold: 0 }
  );
  heroObserver.observe(canvas.parentElement);
}

// =============================================
// SMOOTH SCROLL — Anchor links
// =============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// =============================================
// CATALOG LINKS — Open WhatsApp for queries
// =============================================
function initCatalogLinks() {
  document.querySelectorAll('.catalog-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.querySelector('h3')?.textContent || 'libros';
      const message = `Hola! Quiero consultar por libros de ${category}. ¿Qué tienen disponible?`;
      const url = `https://wa.me/5491171866471?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  });
}
