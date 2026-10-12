/**
 * MÓDULO SANTUARIO DE MARIPOSAS — RESCATANDO CHOPOS
 * Simulación biológica en tiempo real: vuelo 3D (Flutter & Glide),
 * orientación cinemática suave, inclinación de viraje y evasión estricta de tarjetas y textos.
 */

export function initButterflySanctuary() {
  const sanctuaryContainer = document.getElementById('butterfly-sanctuary');
  if (!sanctuaryContainer) return;
  sanctuaryContainer.innerHTML = '';

  const butterfliesData = [
    {
      id: 'butterfly-monarch',
      species: 'Monarca',
      baseSpeed: 0.82,
      wingSvgL: `
        <svg class="b-wing b-wing-left" viewBox="0 0 28 38">
          <defs>
            <linearGradient id="monarchGradL" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="50%" stop-color="#ea580c" />
              <stop offset="90%" stop-color="#b45309" />
            </linearGradient>
          </defs>
          <path d="M26 20 C24 5, 10 3, 3 10 C0 17, 5 26, 12 28 C5 30, 3 35, 10 37 C17 38, 24 32, 26 20 Z" fill="url(#monarchGradL)" stroke="#160e07" stroke-width="2" />
          <path d="M26 20 C19 14, 12 16, 6 12 M26 20 C18 22, 13 27, 10 34" fill="none" stroke="#160e07" stroke-width="1.3" />
          <circle cx="5" cy="11" r="1.2" fill="#ffffff" />
          <circle cx="7" cy="25" r="1.2" fill="#ffffff" />
          <circle cx="9" cy="35" r="1.2" fill="#ffffff" />
        </svg>
      `,
      wingSvgR: `
        <svg class="b-wing b-wing-right" viewBox="0 0 28 38">
          <defs>
            <linearGradient id="monarchGradR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="50%" stop-color="#ea580c" />
              <stop offset="90%" stop-color="#b45309" />
            </linearGradient>
          </defs>
          <path d="M2 20 C4 5, 18 3, 25 10 C28 17, 23 26, 16 28 C23 30, 25 35, 18 37 C11 38, 4 32, 2 20 Z" fill="url(#monarchGradR)" stroke="#160e07" stroke-width="2" />
          <path d="M2 20 C9 14, 16 16, 22 12 M2 20 C10 22, 15 27, 18 34" fill="none" stroke="#160e07" stroke-width="1.3" />
          <circle cx="23" cy="11" r="1.2" fill="#ffffff" />
          <circle cx="21" cy="25" r="1.2" fill="#ffffff" />
          <circle cx="19" cy="35" r="1.2" fill="#ffffff" />
        </svg>
      `
    },
    {
      id: 'butterfly-emerald',
      species: 'Malaquita',
      baseSpeed: 0.72,
      wingSvgL: `
        <svg class="b-wing b-wing-left" viewBox="0 0 28 38">
          <defs>
            <linearGradient id="emGradL" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#a3e635" />
              <stop offset="55%" stop-color="#65a30d" />
              <stop offset="95%" stop-color="#365314" />
            </linearGradient>
          </defs>
          <path d="M26 20 C24 5, 10 3, 3 10 C0 17, 5 26, 12 28 C5 30, 3 35, 10 37 C17 38, 24 32, 26 20 Z" fill="url(#emGradL)" stroke="#1a2e05" stroke-width="2" />
          <path d="M26 20 C19 14, 12 16, 6 12 M26 20 C18 22, 13 27, 10 34" fill="none" stroke="#1a2e05" stroke-width="1.3" />
          <circle cx="5" cy="11" r="1.1" fill="#fef08a" />
          <circle cx="7" cy="25" r="1.1" fill="#fef08a" />
        </svg>
      `,
      wingSvgR: `
        <svg class="b-wing b-wing-right" viewBox="0 0 28 38">
          <defs>
            <linearGradient id="emGradR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a3e635" />
              <stop offset="55%" stop-color="#65a30d" />
              <stop offset="95%" stop-color="#365314" />
            </linearGradient>
          </defs>
          <path d="M2 20 C4 5, 18 3, 25 10 C28 17, 23 26, 16 28 C23 30, 25 35, 18 37 C11 38, 4 32, 2 20 Z" fill="url(#emGradR)" stroke="#1a2e05" stroke-width="2" />
          <path d="M2 20 C9 14, 16 16, 22 12 M2 20 C10 22, 15 27, 18 34" fill="none" stroke="#1a2e05" stroke-width="1.3" />
          <circle cx="23" cy="11" r="1.1" fill="#fef08a" />
          <circle cx="21" cy="25" r="1.1" fill="#fef08a" />
        </svg>
      `
    },
    {
      id: 'butterfly-amber',
      species: 'Azufrada',
      baseSpeed: 0.86,
      wingSvgL: `
        <svg class="b-wing b-wing-left" viewBox="0 0 28 38">
          <defs>
            <linearGradient id="amberGradL" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#facc15" />
              <stop offset="95%" stop-color="#ca8a04" />
            </linearGradient>
          </defs>
          <path d="M26 20 C24 5, 10 3, 3 10 C0 17, 5 26, 12 28 C5 30, 3 35, 10 37 C17 38, 24 32, 26 20 Z" fill="url(#amberGradL)" stroke="#451a03" stroke-width="1.8" />
          <path d="M26 20 C19 14, 12 16, 6 12 M26 20 C18 22, 13 27, 10 34" fill="none" stroke="#78350f" stroke-width="1.2" />
          <circle cx="6" cy="12" r="1.1" fill="#ffffff" />
          <circle cx="8" cy="26" r="1.1" fill="#ffffff" />
        </svg>
      `,
      wingSvgR: `
        <svg class="b-wing b-wing-right" viewBox="0 0 28 38">
          <defs>
            <linearGradient id="amberGradR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#facc15" />
              <stop offset="95%" stop-color="#ca8a04" />
            </linearGradient>
          </defs>
          <path d="M2 20 C4 5, 18 3, 25 10 C28 17, 23 26, 16 28 C23 30, 25 35, 18 37 C11 38, 4 32, 2 20 Z" fill="url(#amberGradR)" stroke="#451a03" stroke-width="1.8" />
          <path d="M2 20 C9 14, 16 16, 22 12 M2 20 C10 22, 15 27, 18 34" fill="none" stroke="#78350f" stroke-width="1.2" />
          <circle cx="22" cy="12" r="1.1" fill="#ffffff" />
          <circle cx="20" cy="26" r="1.1" fill="#ffffff" />
        </svg>
      `
    }
  ];

  function getAvoidanceZones() {
    const selectors = [
      '.command-card',
      '.brigade-card',
      '.bio-card',
      '.bio-filter-group',
      '.species-card',
      '.event-card',
      '.agenda-card',
      '.manifesto-card',
      '.step-card',
      '.contact-card',
      '.contact-hub-card',
      '.spotlight-card',
      '.about-highlight-box',
      '.faq-item',
      '.section-header',
      '.hero-header-center',
      '.cta-banner-card'
    ];

    const zones = [];
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const pad = 42;

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom >= -50 && rect.top <= vh + 50 && rect.right >= -50 && rect.left <= vw + 50) {
          zones.push({
            left: rect.left - pad,
            top: rect.top - pad,
            right: rect.right + pad,
            bottom: rect.bottom + pad,
            cx: (rect.left + rect.right) / 2,
            cy: (rect.top + rect.bottom) / 2,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2
          });
        }
      });
    });
    return zones;
  }

  function getOpenFlightWaypoint(avoidZones) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const zones = avoidZones || getAvoidanceZones();

    for (let attempt = 0; attempt < 30; attempt++) {
      let candX, candY;
      const sideBias = Math.random();
      if (sideBias < 0.35) {
        candX = 40 + Math.random() * Math.min(vw * 0.22, 280);
      } else if (sideBias < 0.70) {
        candX = vw - (40 + Math.random() * Math.min(vw * 0.22, 280));
      } else {
        candX = 60 + Math.random() * (vw - 120);
      }
      candY = 70 + Math.random() * (vh - 140);

      const hit = zones.some(z =>
        candX >= z.left && candX <= z.right && candY >= z.top && candY <= z.bottom
      );

      if (!hit) {
        return { x: candX, y: candY };
      }
    }

    return {
      x: Math.random() < 0.5 ? 50 : vw - 60,
      y: 80 + Math.random() * (vh - 160)
    };
  }

  function getDistinctFlightWaypoint(butterflyIndex, allButterflies, avoidZones) {
    for (let attempt = 0; attempt < 30; attempt++) {
      const pt = getOpenFlightWaypoint(avoidZones);
      const conflict = allButterflies && allButterflies.some((other, oIdx) => {
        if (oIdx === butterflyIndex) return false;
        const distTarget = Math.hypot(pt.x - other.targetX, pt.y - other.targetY);
        const distPos = Math.hypot(pt.x - other.x, pt.y - other.y);
        return distTarget < 220 || distPos < 180;
      });
      if (!conflict) return pt;
    }
    return getOpenFlightWaypoint(avoidZones);
  }

  const butterflies = butterfliesData.map((data, idx) => {
    const el = document.createElement('div');
    el.className = 'park-butterfly';
    el.id = data.id;
    el.innerHTML = `
      <div class="b-wings-wrap">
        ${data.wingSvgL}
        <div class="b-body"></div>
        ${data.wingSvgR}
      </div>
    `;
    sanctuaryContainer.appendChild(el);

    const winW = window.innerWidth;
    const initialPoint = getOpenFlightWaypoint();

    return {
      el,
      x: idx === 0 ? 80 : (idx === 1 ? winW - 90 : winW * 0.5),
      y: 100 + idx * 140,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      targetX: initialPoint.x,
      targetY: initialPoint.y,
      currentAngle: 0,
      targetAngle: 0,
      baseSpeed: data.baseSpeed,
      mode: 'FLUTTER',
      modeTimer: 60 + Math.floor(Math.random() * 50),
      flutterPhase: Math.random() * Math.PI * 2,
      breezePhase: Math.random() * Math.PI * 2,
      tilt: 0
    };
  });

  let bLoopRunning = true;
  document.addEventListener('visibilitychange', () => {
    bLoopRunning = !document.hidden;
  });

  let frameCount = 0;
  let cachedZones = getAvoidanceZones();

  function butterflyLoop() {
    if (bLoopRunning) {
      frameCount++;
      if (frameCount % 45 === 0) {
        cachedZones = getAvoidanceZones();
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      butterflies.forEach((b, bIdx) => {
        b.flutterPhase += 0.12;
        b.breezePhase += 0.018;
        b.modeTimer--;

        if (b.modeTimer <= 0) {
          if (b.mode === 'FLUTTER') {
            b.mode = 'GLIDE';
            b.modeTimer = 85 + Math.floor(Math.random() * 85);
            b.el.classList.add('gliding');
          } else {
            b.mode = 'FLUTTER';
            b.modeTimer = 45 + Math.floor(Math.random() * 45);
            b.el.classList.remove('gliding');
          }
        }

        let toTargetX = b.targetX - b.x;
        let toTargetY = b.targetY - b.y;
        let dist = Math.hypot(toTargetX, toTargetY) || 1;

        if (dist < 35 || Math.random() < 0.0008) {
          const nextPoint = getDistinctFlightWaypoint(bIdx, butterflies, cachedZones);
          b.targetX = nextPoint.x;
          b.targetY = nextPoint.y;
          toTargetX = b.targetX - b.x;
          toTargetY = b.targetY - b.y;
          dist = Math.hypot(toTargetX, toTargetY) || 1;
        }

        let steerX = (toTargetX / dist) * 0.045;
        let steerY = (toTargetY / dist) * 0.045;

        // Evasión y separación mutua entre mariposas (anti-choque y anti-solapamiento estricto)
        const MIN_BUTTERFLY_DIST = 140; // Burbuja generosa de espacio personal
        butterflies.forEach((other, oIdx) => {
          if (bIdx === oIdx) return;
          const dx = b.x - other.x;
          const dy = b.y - other.y;
          const dOther = Math.hypot(dx, dy) || 1;

          if (dOther < MIN_BUTTERFLY_DIST) {
            const overlap = MIN_BUTTERFLY_DIST - dOther;
            const pushFactor = (overlap / MIN_BUTTERFLY_DIST) ** 1.6 * 0.92;
            const nx = dx / dOther;
            const ny = dy / dOther;
            steerX += nx * pushFactor;
            steerY += ny * pushFactor;

            // Separación física dura si se acercan demasiado (< 70px)
            if (dOther < 70) {
              const pushHard = (70 - dOther) * 0.52;
              b.x += nx * pushHard;
              b.y += ny * pushHard;
            }
          }
        });

        // Repulsión contra cajas de información
        cachedZones.forEach(z => {
          const nearLeft = b.x >= z.left - 45 && b.x <= z.right + 45;
          const nearTop = b.y >= z.top - 45 && b.y <= z.bottom + 45;
          if (nearLeft && nearTop) {
            const diffX = b.x - z.cx;
            const diffY = b.y - z.cy;
            const dBox = Math.hypot(diffX, diffY) || 1;
            const push = Math.max(0.3, 1.8 - dBox * 0.015);
            steerX += (diffX / dBox) * push;
            steerY += (diffY / dBox) * push;
          }
        });

        if (b.mode === 'FLUTTER') {
          const liftImpulse = -Math.sin(b.flutterPhase) * 0.18;
          const sideSway = Math.cos(b.flutterPhase * 1.2) * 0.22;
          b.vx += steerX + sideSway * 0.15;
          b.vy += steerY + liftImpulse;
        } else {
          const breeze = Math.sin(b.breezePhase) * 0.12;
          b.vx = b.vx * 0.975 + steerX * 0.4 + breeze;
          b.vy = b.vy * 0.975 + steerY * 0.4 + 0.06;
        }

        const maxSpd = b.mode === 'FLUTTER' ? b.baseSpeed * 1.15 : b.baseSpeed * 0.85;
        const currentSpd = Math.hypot(b.vx, b.vy);
        if (currentSpd > maxSpd) {
          b.vx = (b.vx / currentSpd) * maxSpd;
          b.vy = (b.vy / currentSpd) * maxSpd;
        }

        b.x += b.vx;
        b.y += b.vy;

        if (b.x < 30) { b.x = 30; b.vx = Math.abs(b.vx) * 0.6; }
        if (b.x > vw - 55) { b.x = vw - 55; b.vx = -Math.abs(b.vx) * 0.6; }
        if (b.y < 50) { b.y = 50; b.vy = Math.abs(b.vy) * 0.6; }
        if (b.y > vh - 65) { b.y = vh - 65; b.vy = -Math.abs(b.vy) * 0.6; }

        const motionHeading = Math.atan2(b.vy, b.vx) * (180 / Math.PI) + 90;
        let angleDiff = motionHeading - b.currentAngle;
        while (angleDiff < -180) angleDiff += 360;
        while (angleDiff > 180) angleDiff -= 360;
        b.currentAngle += angleDiff * 0.038;

        b.tilt = Math.max(-16, Math.min(16, angleDiff * 0.45));
        const depthScale = 0.94 + Math.sin(b.flutterPhase * 0.4) * 0.06;

        b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${b.currentAngle.toFixed(1)}deg) rotateY(${b.tilt.toFixed(1)}deg) scale(${depthScale.toFixed(2)})`;
      });
    }

    requestAnimationFrame(butterflyLoop);
  }

  requestAnimationFrame(butterflyLoop);

  window.addEventListener('scroll', () => {
    cachedZones = getAvoidanceZones();
    butterflies.forEach(b => {
      cachedZones.forEach(z => {
        if (b.x >= z.left && b.x <= z.right && b.y >= z.top && b.y <= z.bottom) {
          b.targetX = b.x < z.cx ? z.left - 50 : z.right + 50;
          b.targetY = b.y < z.cy ? z.top - 50 : z.bottom + 50;
        }
      });
    });
  }, { passive: true });
}
