/**
 * MÓDULO MOTOR DE PARTÍCULAS — RESCATANDO CHOPOS
 * Hojas flotantes tridimensionales en Canvas 2D, esporas botánicas lumínicas,
 * estela de viento interactiva del cursor y desprendimiento dinámico.
 */

import { livingTreeState } from './tree.js';

let spawnFloatingLeafCallback = null;

export function spawnFloatingLeafAt(x, y, color) {
  if (typeof spawnFloatingLeafCallback === 'function') {
    spawnFloatingLeafCallback(x, y, color);
  }
}

export function initFloatingLeavesEngine() {
  const canvas = document.getElementById('floating-leaves-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Dinámica aerodinámica del cursor (estela de viento interactiva)
  const mouse = {
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    vx: 0,
    vy: 0,
    active: false
  };

  window.addEventListener('mousemove', (e) => {
    if (mouse.prevX === -1000) {
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
    }
    mouse.vx = e.clientX - mouse.prevX;
    mouse.vy = e.clientY - mouse.prevY;
    mouse.prevX = e.clientX;
    mouse.prevY = e.clientY;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Impulso de ráfaga de viento al hacer clic
  window.addEventListener('click', (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    for (let i = 0; i < 7; i++) {
      leaves.push(new FloatingLeaf(clickX, clickY, true));
    }
  });

  // Paleta de colores de hojas de chopo (Populus deltoides)
  const leafPalette = [
    { main: '#64822c', under: '#b4cca0' }, // Verde Chopo oficial
    { main: '#7fa834', under: '#c2dca8' }, // Brote soleado
    { main: '#48641d', under: '#9eb885' }, // Olivo bosque
    { main: '#a3e635', under: '#d9f99d' }, // Verde lima fresco
    { main: '#e59a22', under: '#fcd34d' }  // Ámbar dorado de otoño
  ];

  class FloatingLeaf {
    constructor(spawnX, spawnY, isBurst = false, customColor = null) {
      const p = leafPalette[Math.floor(Math.random() * leafPalette.length)];
      this.color = customColor || p.main;
      this.undersideColor = p.under;

      this.x = spawnX !== undefined ? spawnX + (Math.random() - 0.5) * 30 : Math.random() * width;
      this.y = spawnY !== undefined ? spawnY + (Math.random() - 0.5) * 30 : -30 - Math.random() * 80;

      this.size = 11 + Math.random() * 12;
      this.scale = 0.8 + Math.random() * 0.4;

      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const force = 2 + Math.random() * 4.5;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force - 0.8;
      } else {
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = 0.9 + Math.random() * 1.5;
      }

      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = (Math.random() - 0.5) * 0.025;

      this.flipAngle = Math.random() * Math.PI * 2;
      this.flipSpeed = 0.02 + Math.random() * 0.035;

      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.03 + Math.random() * 0.025;
      this.wobbleAmp = 1.0 + Math.random() * 1.4;

      this.opacity = 0.88 + Math.random() * 0.12;
      this.isAlive = true;
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * this.wobbleAmp;
      this.y += this.vy;

      this.angle += this.spinSpeed;
      this.flipAngle += this.flipSpeed;

      // Reacción aerodinámica al cursor
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 130 && dist > 1) {
          const force = (1 - dist / 130) * 4.5;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force * 0.6;
          this.spinSpeed += (Math.random() - 0.5) * 0.05;
        }
      }

      this.vx *= 0.985;
      if (this.vy > 2.8) this.vy *= 0.98;

      if (this.y > height + 40 || this.x < -60 || this.x > width + 60) {
        this.isAlive = false;
      }
    }

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);

      const flipScale = Math.cos(this.flipAngle);
      context.scale(flipScale * this.scale, this.scale);

      const isUnderside = flipScale < 0;
      context.fillStyle = isUnderside ? this.undersideColor : this.color;
      context.globalAlpha = this.opacity;

      const sz = this.size;
      context.beginPath();
      context.moveTo(0, sz * 0.7);
      context.bezierCurveTo(-sz * 0.7, sz * 0.35, -sz * 0.85, -sz * 0.3, 0, -sz * 0.95);
      context.bezierCurveTo(sz * 0.85, -sz * 0.3, sz * 0.7, sz * 0.35, 0, sz * 0.7);
      context.closePath();
      context.fill();

      context.strokeStyle = isUnderside ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)';
      context.lineWidth = 0.9;
      context.beginPath();
      context.moveTo(0, sz * 0.7);
      context.lineTo(0, -sz * 0.85);
      context.stroke();

      context.restore();
    }
  }

  // Enlazar spawn global y módulo
  spawnFloatingLeafCallback = (x, y, color) => {
    leaves.push(new FloatingLeaf(x, y, true, color));
  };
  window.spawnFloatingLeafAt = spawnFloatingLeafCallback;

  // Clase para esporas botánicas lumínicas
  class ForestSpore {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10 + Math.random() * 30;
      this.radius = 1.6 + Math.random() * 2.2;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -(0.4 + Math.random() * 0.7);
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.03 + Math.random() * 0.03;
      this.color = Math.random() > 0.4 ? '#a3e635' : '#facc15';
    }

    update() {
      this.pulse += this.pulseSpeed;
      this.x += this.vx + Math.sin(this.pulse) * 0.6;
      this.y += this.vy;

      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw(context) {
      const glow = 0.35 + Math.sin(this.pulse) * 0.45;
      if (glow <= 0.05) return;

      context.save();
      context.globalAlpha = Math.min(Math.max(glow, 0), 1);

      const radGrad = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3.5);
      radGrad.addColorStop(0, this.color);
      radGrad.addColorStop(0.5, this.color);
      radGrad.addColorStop(1, 'transparent');

      context.fillStyle = radGrad;
      context.beginPath();
      context.arc(this.x, this.y, this.radius * 3.5, 0, Math.PI * 2);
      context.fill();

      context.restore();
    }
  }

  const leaves = [];
  const spores = [];

  // 18 hojas flotantes equilibradas
  for (let i = 0; i < 18; i++) {
    const leaf = new FloatingLeaf();
    leaf.y = Math.random() * height;
    leaves.push(leaf);
  }

  // 14 esporas botánicas
  for (let i = 0; i < 14; i++) {
    spores.push(new ForestSpore());
  }

  // Desprendimiento sereno de mini-hojas
  setInterval(() => {
    if (!livingTreeState.branchTips || livingTreeState.branchTips.length === 0) return;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    const visibleTips = livingTreeState.branchTips.filter(tip => {
      const screenY = tip.y - scrollY;
      return screenY >= -80 && screenY <= vh * 0.85;
    });

    if (visibleTips.length > 0 && leaves.length < 28) {
      const chosenTip = visibleTips[Math.floor(Math.random() * visibleTips.length)];
      const screenX = chosenTip.x;
      const screenY = chosenTip.y - scrollY;
      leaves.push(new FloatingLeaf(screenX, screenY, true));
    }
  }, 4600);

  // Viento al hacer scroll
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (Math.abs(scrollDelta) > 1.5) {
      const windImpulse = Math.min(Math.max(-scrollDelta * 0.04, -2.5), 2.5);
      for (let i = 0; i < leaves.length; i++) {
        leaves[i].vy += windImpulse;
        leaves[i].vx += (Math.random() - 0.5) * Math.abs(scrollDelta) * 0.04;
      }
    }
  }, { passive: true });

  let isRunning = true;
  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
  });

  function renderLoop() {
    if (isRunning) {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < spores.length; i++) {
        spores[i].update();
        spores[i].draw(ctx);
      }

      for (let i = leaves.length - 1; i >= 0; i--) {
        const leaf = leaves[i];
        leaf.update();
        leaf.draw(ctx);

        if (!leaf.isAlive) {
          leaves.splice(i, 1);
          if (leaves.length < 28) {
            leaves.push(new FloatingLeaf());
          }
        }
      }
    }
    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
}
