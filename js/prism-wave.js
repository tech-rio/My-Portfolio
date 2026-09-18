/**
 * ============================================================================
 * Chromatic Light Dispersion & Live 7-Color Spectral Wave Engine
 * Aadarsh Soni Portfolio — Hero Optical Physics
 * ============================================================================
 */

(function () {
  'use strict';

  const canvas = document.getElementById('prism-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrameId = null;
  let isRunning = false;
  let time = 0;

  // Mouse interaction state
  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false
  };

  // 7 Spectral Colors (VIBGYOR order fanned out)
  const spectralColors = [
    { name: 'Red',    rgb: '255, 59, 48',  wavelength: 700, angleOffset: -0.16, amp: 24, speed: 0.016 },
    { name: 'Orange', rgb: '255, 149, 0',  wavelength: 620, angleOffset: -0.11, amp: 26, speed: 0.018 },
    { name: 'Yellow', rgb: '255, 214, 10', wavelength: 580, angleOffset: -0.06, amp: 28, speed: 0.020 },
    { name: 'Green',  rgb: '48, 209, 88',  wavelength: 530, angleOffset: -0.00, amp: 30, speed: 0.022 },
    { name: 'Cyan',   rgb: '0, 199, 190',  wavelength: 490, angleOffset: 0.06,  amp: 32, speed: 0.024 },
    { name: 'Indigo', rgb: '94, 92, 230',  wavelength: 450, angleOffset: 0.11,  amp: 34, speed: 0.026 },
    { name: 'Violet', rgb: '191, 90, 242', wavelength: 400, angleOffset: 0.16,  amp: 36, speed: 0.028 }
  ];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    if (!mouse.active) {
      mouse.targetX = width * 0.28;
      mouse.targetY = height * 0.45;
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
    }
  }

  // Smooth mouse tracking
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.active = true;
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.targetX = width * 0.28;
    mouse.targetY = height * 0.45;
  });

  function drawPrismAndBeams() {
    ctx.clearRect(0, 0, width, height);

    // Smooth inertia for mouse position
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Prism Nexus coordinates (the focal optical dispersion point)
    const prismX = Math.max(120, Math.min(width * 0.35, mouse.x * 0.85));
    const prismY = Math.max(140, Math.min(height * 0.65, mouse.y * 0.85));

    // 1. Incident White Beam from top-left entering prism
    const sourceX = -40;
    const sourceY = prismY - 140;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Outer glow of incident ray
    const incidentGrad = ctx.createLinearGradient(sourceX, sourceY, prismX, prismY);
    incidentGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    incidentGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.25)');
    incidentGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.7)');
    incidentGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

    ctx.strokeStyle = incidentGrad;
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(prismX, prismY);
    ctx.stroke();

    // Intense inner core of incident ray
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(prismX, prismY);
    ctx.stroke();

    // 2. Optical Glass Prism Nexus (Hexagonal / Triangular Refractor)
    ctx.shadowColor = 'rgba(0, 245, 160, 0.6)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(prismX, prismY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pulsing halo around prism
    const pulseRadius = 14 + Math.sin(time * 0.05) * 4;
    const prismGlow = ctx.createRadialGradient(prismX, prismY, 0, prismX, prismY, pulseRadius);
    prismGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    prismGlow.addColorStop(0.4, 'rgba(0, 245, 160, 0.4)');
    prismGlow.addColorStop(1, 'rgba(0, 210, 255, 0)');
    ctx.fillStyle = prismGlow;
    ctx.beginPath();
    ctx.arc(prismX, prismY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3. 7 Live Undulating Spectral Waves fanning out across screen
    const segments = 60;
    const fanSpread = height * 0.42;

    spectralColors.forEach((color, idx) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Base target Y trajectory for this color
      const colorTargetY = prismY + (color.angleOffset * fanSpread) + (mouse.y - height / 2) * 0.15;
      const waveFreq = 0.005 + (idx * 0.0006);
      const phaseOffset = idx * 0.42;

      ctx.beginPath();
      ctx.moveTo(prismX, prismY);

      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const x = prismX + progress * (width - prismX + 50);

        // Multi-frequency harmonic wave equation
        const wave1 = Math.sin((x * waveFreq) - (time * color.speed) + phaseOffset) * color.amp;
        const wave2 = Math.cos((x * waveFreq * 0.5) - (time * color.speed * 0.7)) * (color.amp * 0.4);
        
        // Dispersion envelope: amplitude increases as light propagates outward
        const envelope = Math.pow(progress, 0.8);
        const y = prismY + (colorTargetY - prismY) * progress + (wave1 + wave2) * envelope;

        if (i === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Spectral ribbon gradient stroke
      const rayGrad = ctx.createLinearGradient(prismX, prismY, width, colorTargetY);
      rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      rayGrad.addColorStop(0.12, `rgba(${color.rgb}, 0.85)`);
      rayGrad.addColorStop(0.65, `rgba(${color.rgb}, 0.55)`);
      rayGrad.addColorStop(1, `rgba(${color.rgb}, 0.05)`);

      // Outer wave glow
      ctx.strokeStyle = rayGrad;
      ctx.lineWidth = 3.5 + Math.sin(time * 0.04 + idx) * 0.8;
      ctx.shadowColor = `rgba(${color.rgb}, 0.75)`;
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Sharp inner luminous core
      ctx.strokeStyle = `rgba(${color.rgb}, 0.9)`;
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 6;
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
    time += 1;
  }

  function loop() {
    if (!isRunning) return;
    drawPrismAndBeams();
    animationFrameId = requestAnimationFrame(loop);
  }

  function start() {
    if (!isRunning) {
      isRunning = true;
      loop();
    }
  }

  function pause() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Optimize: Pause rendering when scrolled past the hero section
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        start();
      } else {
        pause();
      }
    });
  }, { threshold: 0.05 });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }

  window.addEventListener('resize', resize);
  resize();
  start();
})();
