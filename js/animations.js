/**
 * ============================================================================
 * Apple-Grade Micro-Interactions, 3D Tilt & Specular Spotlight Engine
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Specular Mouse Spotlight on Cards
  const cards = document.querySelectorAll('.specular-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 2. VisionOS 3D Perspective Card Tilt with Spring Physics
  const tiltElements = document.querySelectorAll('.tilt-card');

  tiltElements.forEach((el) => {
    let bounds;
    let isHovering = false;

    function onMouseEnter() {
      bounds = el.getBoundingClientRect();
      isHovering = true;
    }

    function onMouseMove(e) {
      if (!isHovering) return;
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width) - 0.5;
      const yPct = (mouseY / bounds.height) - 0.5;

      // Max tilt angle (degrees)
      const maxTilt = 8;
      const rotateX = -yPct * maxTilt;
      const rotateY = xPct * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    }

    function onMouseLeave() {
      isHovering = false;
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
  });

  // 3. Apple-Grade Scroll Reveal Observer (Blur-to-Focus Fade In)
  const revealElements = document.querySelectorAll('.reveal-init');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // 4. Timeline Laser Node Scroll Lighting
  const timelineNodes = document.querySelectorAll('.timeline-node');

  const nodeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.borderColor = '#00f5a0';
        entry.target.style.boxShadow = '0 0 20px #00f5a0, 0 0 40px rgba(0, 245, 160, 0.4)';
        entry.target.style.transform = entry.target.style.transform.replace('scale(1)', 'scale(1.2)');
      }
    });
  }, { threshold: 0.8 });

  timelineNodes.forEach((node) => nodeObserver.observe(node));
})();
