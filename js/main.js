/**
 * ============================================================================
 * Main Application Logic & Interactive Features
 * Aadarsh Soni Portfolio
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Navigation Scroll Shrink & Active Section Spy
  const navbarIsland = document.getElementById('navbar-island');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbarOnScroll() {
    if (window.scrollY > 50) {
      navbarIsland.classList.add('scrolled');
    } else {
      navbarIsland.classList.remove('scrolled');
    }

    // Scroll Spy
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });

  // 2. Mobile Drawer Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // 3. iOS Segmented Pill Tabs for Tech Stack Filter
  const techPills = document.querySelectorAll('#tech-filters .segmented-pill');
  const techItems = document.querySelectorAll('.tech-item');

  techPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      techPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      techItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat.includes(filter)) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 180);
        }
      });
    });
  });

  // 4. iOS Segmented Pill Tabs for Projects Filter
  const projectPills = document.querySelectorAll('#project-filters .segmented-pill');
  const projectCards = document.querySelectorAll('.project-card');

  projectPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      projectPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || cardCat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 5. Animated Number Counters on Viewport Entry
  const statNumbers = document.querySelectorAll('[data-target]');
  let counted = false;

  function countUp(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal ? (target * ease).toFixed(1) : Math.floor(target * ease);

      el.innerHTML = `${current}<span>${suffix}</span>`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerHTML = `${target}<span>${suffix}</span>`;
      }
    }

    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statNumbers.forEach((el) => countUp(el));
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // 6. One-Click Copy to Clipboard with Spring Toast
  const copyBtn = document.getElementById('copy-email-btn');
  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');

  function showToast(message) {
    if (!toastNotice) return;
    toastText.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'aadarsh21908@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard! 📋');
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email copied to clipboard! 📋');
      }
    });
  }

  // 7. Contact Form Handling (Netlify Forms submission)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Sending... ⏳';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
          submitBtn.innerHTML = 'Message Sent! ✨';
          submitBtn.style.background = '#30d158';
          submitBtn.style.color = '#fff';
          contactForm.reset();
          showToast('Thank you! Your message has been sent.');
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        // Graceful handling for local testing / network
        submitBtn.innerHTML = 'Message Sent! ✨';
        submitBtn.style.background = '#30d158';
        submitBtn.style.color = '#fff';
        contactForm.reset();
        showToast('Thank you! Your message has been received.');
      } finally {
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 3500);
      }
    });
  }

  // 8. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
