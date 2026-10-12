/**
 * MÓDULO ÁRBOL VIVO PROCEDURAL — RESCATANDO CHOPOS
 * Generación botánica vectorial (SVG) de tronco sinuoso, corteza texturizada,
 * canal de savia ascendente, raíces de chopo centenario, ramas vivas y ciclo de caída de hojas.
 */

export const livingTreeState = {
  branchTips: [],
  allLeafNodes: [],
  isGenerated: false,
  leafCycleInterval: null
};

// Función para obtener la posición rectangular absoluta en el documento
function getElementDocRect(el) {
  if (!el) return null;
  let top = 0;
  let left = 0;
  let curr = el;
  while (curr && curr !== document.body) {
    top += curr.offsetTop || 0;
    left += curr.offsetLeft || 0;
    curr = curr.offsetParent;
  }
  const width = el.offsetWidth || 0;
  const height = el.offsetHeight || 0;
  return {
    top,
    left,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2
  };
}

export function initLivingTreeSystem() {
  const svgEl = document.getElementById('living-tree-svg');
  const rootsBgGroup = document.getElementById('tree-roots-bg-group');
  const rootsGroup = document.getElementById('tree-roots-group');
  const trunkGroup = document.getElementById('tree-trunk-group');
  const branchesGroup = document.getElementById('tree-branches-group');
  const foliageGroup = document.getElementById('tree-foliage-group');

  if (!svgEl || !trunkGroup) return;

  if (livingTreeState.leafCycleInterval) {
    clearInterval(livingTreeState.leafCycleInterval);
  }

  // Medir dimensiones reales del documento
  const docWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const footerEl = document.querySelector('footer');
  let docHeight;
  if (footerEl) {
    const footerRect = getElementDocRect(footerEl);
    docHeight = (footerRect ? footerRect.top + footerRect.height : 0) || Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  } else {
    docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }

  svgEl.setAttribute('viewBox', `0 0 ${docWidth} ${docHeight}`);
  svgEl.setAttribute('width', `${docWidth}`);
  svgEl.setAttribute('height', `${docHeight}`);
  svgEl.style.width = `${docWidth}px`;
  svgEl.style.height = `${docHeight}px`;

  // Limpiar grupos anteriores al redimensionar
  if (rootsBgGroup) rootsBgGroup.innerHTML = '';
  if (rootsGroup) rootsGroup.innerHTML = '';
  if (trunkGroup) trunkGroup.innerHTML = '';
  if (branchesGroup) branchesGroup.innerHTML = '';
  if (foliageGroup) foliageGroup.innerHTML = '';
  livingTreeState.branchTips = [];
  livingTreeState.allLeafNodes = [];

  const isMobile = docWidth < 900;
  const centerMargin = docWidth * 0.50;

  // Helper para medir posición y altura precisa de cada sección en el documento
  const getSecInfo = (id, fallbackTop, fallbackH) => {
    const el = document.getElementById(id);
    if (el) {
      const r = getElementDocRect(el);
      return { top: r ? r.top : fallbackTop, h: r ? r.height : fallbackH };
    }
    return { top: fallbackTop, h: fallbackH };
  };

  const sInicio = getSecInfo('inicio', 0, 800);
  const sMision = getSecInfo('mision', 850, 650);
  const sBrigadas = getSecInfo('brigadas', 1550, 750);
  const sComunidad = getSecInfo('comunidad', 2300, 700);
  const sBiodiversidad = getSecInfo('biodiversidad', 3050, 1050);
  const sAgenda = getSecInfo('agenda', 4150, 750);
  const sManifiesto = getSecInfo('manifiesto', 4950, 700);
  const sSumate = getSecInfo('sumate', 5700, 650);
  const sContacto = getSecInfo('contacto', 6400, 800);
  const sFaq = getSecInfo('faq', 7250, 650);

  // Hitos con trayectoria sinuosa continua que ondea dinámicamente y pasa por detrás de tarjetas y contenidos
  const rawMilestones = [];

  // 1. Copa Suprema en Hero (margen superior izquierdo sombreando el cielo del parque)
  rawMilestones.push({
    id: 'm_hero_canopy',
    x: docWidth * 0.12,
    y: 40,
    branchDirs: ['inward', 'outward'],
    leavesCount: 22
  });

  // 2. Hero: Detrás de la tarjeta de cuenta regresiva
  const cardCountdown = document.querySelector('.card-countdown');
  if (cardCountdown) {
    const r = getElementDocRect(cardCountdown);
    rawMilestones.push({
      id: 'm_hero_card_left',
      x: r.centerX - 10,
      y: r.centerY,
      branchDirs: ['outward', 'inward'],
      leavesCount: 18
    });
  } else {
    rawMilestones.push({ id: 'm_hero_cd_fb', x: docWidth * 0.25, y: sInicio.top + sInicio.h * 0.65, branchDirs: ['outward', 'inward'], leavesCount: 16 });
  }

  // 3. Hero: Curva sinuosa que cruza hacia la derecha pasando por detrás de la tarjeta de métricas
  const cardMetrics = document.querySelector('.card-metrics');
  if (cardMetrics) {
    const r = getElementDocRect(cardMetrics);
    rawMilestones.push({
      id: 'm_hero_card_right',
      x: r.centerX + 15,
      y: r.centerY + 10,
      branchDirs: ['inward', 'outward'],
      leavesCount: 18
    });
  } else {
    rawMilestones.push({ id: 'm_hero_met_fb', x: docWidth * 0.72, y: sInicio.top + sInicio.h * 0.85, branchDirs: ['inward', 'outward'], leavesCount: 16 });
  }

  // 4. Misión alta: Curva hacia el margen exterior izquierdo sin invadir el bloque de texto
  const misionText = document.querySelector('.about-content') || document.querySelector('.about-text');
  if (misionText) {
    const r = getElementDocRect(misionText);
    rawMilestones.push({
      id: 'm_mision_text',
      x: Math.max(docWidth * 0.14, r.left - 25),
      y: r.top + r.height * 0.35,
      branchDirs: ['outward', 'inward'],
      leavesCount: 16
    });
  } else {
    rawMilestones.push({ id: 'm_mision_txt_fb', x: docWidth * 0.22, y: sMision.top + sMision.h * 0.32, branchDirs: ['outward', 'inward'], leavesCount: 16 });
  }

  // 5. Misión baja: Gran curva diagonal pasando por detrás de la galería de fotos
  const misionGallery = document.querySelector('.about-gallery-grid') || document.querySelector('.about-gallery');
  if (misionGallery) {
    const r = getElementDocRect(misionGallery);
    rawMilestones.push({
      id: 'm_mision_gal',
      x: r.centerX + 20,
      y: r.centerY,
      branchDirs: ['outward', 'inward'],
      leavesCount: 18
    });
  } else {
    rawMilestones.push({ id: 'm_mision_gal_fb', x: docWidth * 0.75, y: sMision.top + sMision.h * 0.76, branchDirs: ['outward', 'inward'], leavesCount: 16 });
  }

  // 6. Brigadas: Pasa por detrás de la Tarjeta 1
  const brigadeCards = document.querySelectorAll('.brigade-card');
  if (brigadeCards.length >= 1) {
    const r1 = getElementDocRect(brigadeCards[0]);
    rawMilestones.push({
      id: 'm_brigadas_1',
      x: r1.centerX,
      y: r1.centerY + 10,
      branchDirs: ['outward', 'inward'],
      leavesCount: 18
    });
  }

  // 7. Brigadas: Ondulación continua cruzando por detrás de la Tarjeta 3
  if (brigadeCards.length >= 3) {
    const r3 = getElementDocRect(brigadeCards[2]);
    rawMilestones.push({
      id: 'm_brigadas_3',
      x: r3.centerX,
      y: r3.centerY + 20,
      branchDirs: ['outward', 'inward'],
      leavesCount: 18
    });
  }

  // 8. Comunidad: Pasa por detrás de la tarjeta central Spotlight
  const spotlightCard = document.querySelector('.spotlight-card');
  if (spotlightCard) {
    const r = getElementDocRect(spotlightCard);
    rawMilestones.push({
      id: 'm_comunidad_spotlight',
      x: r.centerX - 40,
      y: r.centerY,
      branchDirs: ['inward', 'outward'],
      leavesCount: 16
    });
  } else {
    rawMilestones.push({ id: 'm_comunidad_fb', x: docWidth * 0.42, y: sComunidad.top + sComunidad.h * 0.45, branchDirs: ['inward', 'outward'], leavesCount: 16 });
  }

  // 9. Comunidad salida: Ondula hacia la derecha
  rawMilestones.push({
    id: 'm_comunidad_exit',
    x: docWidth * 0.78,
    y: sComunidad.top + sComunidad.h * 0.82,
    branchDirs: ['outward'],
    leavesCount: 14
  });

  // 10. Biodiversidad: Curva ondulante cruzando por detrás de las tarjetas de fauna y flora
  const bioCards = document.querySelectorAll('.bio-card');
  if (bioCards.length >= 1) {
    const r1 = getElementDocRect(bioCards[0]);
    rawMilestones.push({
      id: 'm_biodiv_1',
      x: r1.centerX,
      y: r1.centerY,
      branchDirs: ['outward'],
      leavesCount: 14
    });
  }
  if (bioCards.length >= 3) {
    const rLast = getElementDocRect(bioCards[bioCards.length - 1]);
    rawMilestones.push({
      id: 'm_biodiv_last',
      x: rLast.centerX,
      y: rLast.centerY,
      branchDirs: ['outward'],
      leavesCount: 14
    });
  } else if (bioCards.length === 0) {
    rawMilestones.push({
      id: 'm_biodiv_fb',
      x: docWidth * 0.45,
      y: sBiodiversidad.top + sBiodiversidad.h * 0.5,
      branchDirs: ['outward'],
      leavesCount: 14
    });
  }

  // 11. Agenda: Pasa por detrás de las tarjetas de fechas de jornadas
  const eventCards = document.querySelectorAll('.event-card');
  if (eventCards.length >= 2) {
    const rE1 = getElementDocRect(eventCards[0]);
    rawMilestones.push({
      id: 'm_agenda_e1',
      x: rE1.left + rE1.width * 0.38,
      y: rE1.centerY,
      branchDirs: ['inward', 'outward'],
      leavesCount: 15
    });
    const rE2 = getElementDocRect(eventCards[eventCards.length - 1]);
    rawMilestones.push({
      id: 'm_agenda_e2',
      x: rE2.left + rE2.width * 0.65,
      y: rE2.centerY,
      branchDirs: ['inward'],
      leavesCount: 15
    });
  } else {
    rawMilestones.push({ id: 'm_agenda_a', x: docWidth * 0.58, y: sAgenda.top + sAgenda.h * 0.36, branchDirs: ['inward', 'outward'], leavesCount: 14 });
    rawMilestones.push({ id: 'm_agenda_b', x: docWidth * 0.34, y: sAgenda.top + sAgenda.h * 0.78, branchDirs: ['inward'], leavesCount: 14 });
  }

  // 12. Manifiesto: Curva elegante detrás de los pilares de conservación
  const manifestoCards = document.querySelectorAll('.manifesto-card');
  if (manifestoCards.length >= 2) {
    const rM = getElementDocRect(manifestoCards[1]);
    rawMilestones.push({
      id: 'm_manifiesto',
      x: rM.centerX + 15,
      y: rM.centerY,
      branchDirs: ['inward', 'outward'],
      leavesCount: 16
    });
  } else {
    rawMilestones.push({ id: 'm_manifiesto_fb', x: docWidth * 0.48, y: sManifiesto.top + sManifiesto.h * 0.48, branchDirs: ['inward', 'outward'], leavesCount: 16 });
  }

  // 13. Súmate: Pasa por detrás de los pasos de registro ciudadano
  const stepCards = document.querySelectorAll('.step-card');
  if (stepCards.length >= 3) {
    const rS1 = getElementDocRect(stepCards[0]);
    rawMilestones.push({
      id: 'm_sumate_step1',
      x: rS1.centerX,
      y: rS1.centerY,
      branchDirs: ['outward'],
      leavesCount: 14
    });
    const rS3 = getElementDocRect(stepCards[2]);
    rawMilestones.push({
      id: 'm_sumate_step3',
      x: rS3.centerX,
      y: rS3.centerY,
      branchDirs: ['inward'],
      leavesCount: 14
    });
  } else {
    rawMilestones.push({ id: 'm_sumate_fb', x: docWidth * 0.56, y: sSumate.top + sSumate.h * 0.46, branchDirs: ['inward', 'outward'], leavesCount: 14 });
  }

  // 14. Contacto: Curva sinuosa detrás de las tarjetas de información y mapa
  const contactHub = document.querySelector('.contact-info-panel') || document.querySelector('.contact-card');
  const contactMap = document.querySelector('.contact-map-frame') || document.querySelector('.contact-map-wrap');
  if (contactHub) {
    const r = getElementDocRect(contactHub);
    rawMilestones.push({
      id: 'm_contacto_hub',
      x: r.centerX,
      y: r.centerY,
      branchDirs: ['inward'],
      leavesCount: 14
    });
  }
  if (contactMap) {
    const r = getElementDocRect(contactMap);
    rawMilestones.push({
      id: 'm_contacto_map',
      x: r.centerX,
      y: r.centerY,
      branchDirs: ['outward'],
      leavesCount: 14
    });
  }

  // 15. FAQ: Ondulación suave en el margen superior e inferior sin rozar el título
  const faqEl = document.getElementById('faq');
  if (faqEl) {
    const rFaq = getElementDocRect(faqEl);
    rawMilestones.push({
      id: 'm_faq_wave_left',
      x: Math.max(docWidth * 0.16, rFaq.left + rFaq.width * 0.16),
      y: rFaq.top - 45, // Ubicado por encima del título de Preguntas Frecuentes
      branchDirs: ['outward'], // Crece hacia el margen exterior izquierdo
      leavesCount: 14
    });
    rawMilestones.push({
      id: 'm_faq_wave_right',
      x: Math.min(docWidth * 0.84, rFaq.left + rFaq.width * 0.84),
      y: rFaq.top + rFaq.height * 0.78, // Detrás de la zona baja del acordeón
      branchDirs: ['outward'],
      leavesCount: 14
    });
  }

  // Medir ubicación precisa del footer
  let footerTop = docHeight - 540;
  let footerHeight = 540;
  if (footerEl) {
    const rF = getElementDocRect(footerEl);
    if (rF && rF.height > 100) {
      footerTop = rF.top;
      footerHeight = rF.height;
    }
  }

  // 16. CTA Banner: Sinuosidad profunda pasando por detrás del recuadro verde
  const ctaCard = document.querySelector('.cta-banner-card');
  if (ctaCard) {
    const rCta = getElementDocRect(ctaCard);
    rawMilestones.push({
      id: 'm_cta_banner_deep',
      x: rCta.left + rCta.width * 0.35,
      y: rCta.centerY,
      branchDirs: ['inward'],
      leavesCount: 15
    });
  } else {
    rawMilestones.push({ id: 'm_cta_fb', x: docWidth * 0.36, y: footerTop - 80, branchDirs: ['inward'], leavesCount: 12 });
  }

  // 17. Transición orgánica al Footer: entra curvado diagonalmente con gracia
  rawMilestones.push({
    id: 'm_footer_entry',
    x: docWidth * 0.43,
    y: footerTop + 65,
    branchDirs: [],
    leavesCount: 0
  });

  // 18. Navegación media en el Footer: el tronco ondea suavemente hacia el centro
  rawMilestones.push({
    id: 'm_footer_mid',
    x: docWidth * 0.48,
    y: footerTop + footerHeight * 0.42,
    branchDirs: [],
    leavesCount: 0
  });

  // 19. Cuello/collar del chopo centenario: empieza a ensancharse hacia el pie
  rawMilestones.push({
    id: 'm_footer_collar',
    x: docWidth * 0.50,
    y: footerTop + footerHeight * 0.68,
    branchDirs: [],
    leavesCount: 0
  });

  // Ordenar de arriba hacia abajo (Y ascendente)
  rawMilestones.sort((a, b) => a.y - b.y);

  // Punto de origen: Raíces en el lecho terrenal del footer
  const earthBaseY = footerTop + footerHeight - 25;
  const earthBaseX = centerMargin;

  // Lista de puntos del tronco desde la base hacia la copa (reducido 40% en calibre)
  const trunkPoints = [];
  trunkPoints.push({
    x: earthBaseX,
    y: earthBaseY,
    width: isMobile ? 72 : 105, // Base ensanchada del tronco
    t: 1.0
  });

  // Invertir hitos para construir la curva desde la tierra hasta la copa
  for (let i = rawMilestones.length - 1; i >= 0; i--) {
    const ms = rawMilestones[i];
    const progress = Math.max(0, Math.min(1, ms.y / docHeight));
    let trunkWidth;
    if (ms.id === 'm_footer_collar') {
      trunkWidth = isMobile ? 51 : 72;
    } else if (ms.id === 'm_footer_mid') {
      trunkWidth = isMobile ? 39 : 54;
    } else if (ms.id === 'm_footer_entry') {
      trunkWidth = isMobile ? 31 : 45;
    } else {
      trunkWidth = isMobile
        ? Math.max(6, 29 * (progress ** 0.75))
        : Math.max(7, 41 * (progress ** 0.75));
    }

    trunkPoints.push({
      x: ms.x,
      y: ms.y,
      width: trunkWidth,
      t: progress,
      branchDirs: ms.branchDirs,
      leavesCount: ms.leavesCount
    });
  }

  const pts = trunkPoints;

  // Generar curva central suave con Spline Cúbico de Catmull-Rom
  const splinePoints = [];
  const stepsPerSegment = 26;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i > 0 ? pts[i - 1] : pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

    for (let s = 0; s < stepsPerSegment; s++) {
      const t = s / stepsPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;

      const qx = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      const qy = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );

      const qw = p1.width * (1 - t) + p2.width * t;
      splinePoints.push({ x: qx, y: qy, width: qw });
    }
  }
  splinePoints.push(pts[pts.length - 1]);

  // Construir contornos izquierdo y derecho para la cinta de corteza
  const leftContour = [];
  const rightContour = [];
  let centerlineD = `M ${splinePoints[0].x.toFixed(1)} ${splinePoints[0].y.toFixed(1)}`;

  for (let i = 0; i < splinePoints.length; i++) {
    const curr = splinePoints[i];
    const prev = i > 0 ? splinePoints[i - 1] : curr;
    const next = i < splinePoints.length - 1 ? splinePoints[i + 1] : curr;

    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const halfW = curr.width / 2;
    leftContour.push({
      x: curr.x + nx * halfW,
      y: curr.y + ny * halfW
    });
    rightContour.push({
      x: curr.x - nx * halfW,
      y: curr.y - ny * halfW
    });

    if (i > 0) {
      centerlineD += ` L ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }
  }

  // Polígono de corteza cerrado
  let trunkPolygonD = `M ${leftContour[0].x.toFixed(1)} ${leftContour[0].y.toFixed(1)}`;
  for (let i = 1; i < leftContour.length; i++) {
    trunkPolygonD += ` L ${leftContour[i].x.toFixed(1)} ${leftContour[i].y.toFixed(1)}`;
  }
  for (let i = rightContour.length - 1; i >= 0; i--) {
    trunkPolygonD += ` L ${rightContour[i].x.toFixed(1)} ${rightContour[i].y.toFixed(1)}`;
  }
  trunkPolygonD += ' Z';

  // 1. Sombra exterior del tronco
  const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  shadowPath.setAttribute('d', trunkPolygonD);
  shadowPath.setAttribute('class', 'trunk-outer-shadow');
  trunkGroup.appendChild(shadowPath);

  // 2. Corteza principal texturizada
  const trunkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  trunkPath.setAttribute('d', trunkPolygonD);
  trunkPath.setAttribute('class', 'trunk-bark-main');
  trunkGroup.appendChild(trunkPath);

  // 3. Veta de musgo botánico central
  const mossPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  mossPath.setAttribute('d', centerlineD);
  mossPath.setAttribute('class', 'trunk-moss-accent');
  mossPath.setAttribute('stroke-width', isMobile ? '5' : '8.5');
  mossPath.setAttribute('fill', 'none');
  trunkGroup.appendChild(mossPath);

  // 4. Canal vital luminoso de savia ascendente
  const sapPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  sapPath.setAttribute('d', centerlineD);
  sapPath.setAttribute('class', 'trunk-sap-line');
  sapPath.setAttribute('stroke-width', isMobile ? '2.2' : '3');
  sapPath.setAttribute('fill', 'none');
  trunkGroup.appendChild(sapPath);

  // 5. Raíces escultóricas botánicas en el suelo del footer
  renderRoots(rootsBgGroup, rootsGroup, earthBaseX, earthBaseY, docWidth);

  // 6. Ramas con hojas a lo largo del recorrido sinuoso
  pts.forEach((pt, pIdx) => {
    if (!pt.branchDirs || pt.branchDirs.length === 0) return;

    pt.branchDirs.forEach((dir, dIdx) => {
      renderBranchCluster(
        branchesGroup,
        foliageGroup,
        pt.x,
        pt.y,
        dir,
        pt.leavesCount || 14,
        pIdx * 3 + dIdx,
        isMobile,
        docWidth
      );
    });
  });

  livingTreeState.isGenerated = true;

  // 7. Iniciar ciclo de vida de caída y rebrote de hojas
  initLeafLifeCycle();
}

// Generador de base radicular escultórica orgánica de chopo centenario (reducido 40%)
function renderRoots(bgContainer, fgContainer, baseX, baseY, docWidth) {
  const isMobile = docWidth < 900;
  const spreadW = Math.min(docWidth * 0.28, isMobile ? 156 : 270);

  // 1. Lecho de humus orgánico suave y profundo (en capa de fondo)
  if (bgContainer) {
    const moundAmbient = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    moundAmbient.setAttribute('cx', baseX.toFixed(1));
    moundAmbient.setAttribute('cy', (baseY + 9).toFixed(1));
    moundAmbient.setAttribute('rx', (spreadW * 1.15).toFixed(1));
    moundAmbient.setAttribute('ry', isMobile ? '23' : '32');
    moundAmbient.setAttribute('class', 'root-mound-ambient');
    bgContainer.appendChild(moundAmbient);

    const moundDeep = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    moundDeep.setAttribute('cx', baseX.toFixed(1));
    moundDeep.setAttribute('cy', (baseY + 5).toFixed(1));
    moundDeep.setAttribute('rx', (spreadW * 0.75).toFixed(1));
    moundDeep.setAttribute('ry', isMobile ? '16' : '23');
    moundDeep.setAttribute('class', 'root-mound-deep');
    bgContainer.appendChild(moundDeep);
  }

  const container = fgContainer || bgContainer;
  if (!container) return;

  // 2. Pie contrafuerte acampanado y esculpido (Collar botánico del chopo reducido 40%)
  const flareLeftX = baseX - (isMobile ? 80 : 130);
  const flareRightX = baseX + (isMobile ? 80 : 130);
  const collarHeight = isMobile ? 90 : 130;
  const topW = isMobile ? 33 : 50;

  // Silueta esculpida de contrafuerte acampanado con raíces maestras salientes
  const buttressD = `
    M ${(baseX - topW).toFixed(1)} ${(baseY - collarHeight).toFixed(1)}
    C ${(baseX - topW - 8).toFixed(1)} ${(baseY - collarHeight * 0.55).toFixed(1)}, ${(flareLeftX + 33).toFixed(1)} ${(baseY - 15).toFixed(1)}, ${flareLeftX.toFixed(1)} ${(baseY + 7).toFixed(1)}
    Q ${(baseX - 27).toFixed(1)} ${(baseY + 17).toFixed(1)} ${baseX.toFixed(1)} ${(baseY + 12).toFixed(1)}
    Q ${(baseX + 27).toFixed(1)} ${(baseY + 17).toFixed(1)} ${flareRightX.toFixed(1)} ${(baseY + 7).toFixed(1)}
    C ${(flareRightX - 33).toFixed(1)} ${(baseY - 15).toFixed(1)}, ${(baseX + topW + 8).toFixed(1)} ${(baseY - collarHeight * 0.55).toFixed(1)}, ${(baseX + topW).toFixed(1)} ${(baseY - collarHeight).toFixed(1)}
    Z
  `;
  const buttress = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  buttress.setAttribute('d', buttressD);
  buttress.setAttribute('class', 'root-buttress-main');
  container.appendChild(buttress);

  // Perfil luminoso del contrafuerte para relieve y volumen
  const buttressRim = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  buttressRim.setAttribute('d', buttressD);
  buttressRim.setAttribute('class', 'root-buttress-rim');
  container.appendChild(buttressRim);

  // 3. Estrías y aristas longitudinales de madera (flutes) que dan volumen 3D a la corteza
  const flutes = [
    // Flautas del flanco izquierdo
    `M ${(baseX - topW * 0.85).toFixed(1)} ${(baseY - collarHeight + 5).toFixed(1)} C ${(baseX - topW - 5).toFixed(1)} ${(baseY - collarHeight * 0.5).toFixed(1)}, ${(flareLeftX + 45).toFixed(1)} ${(baseY - 11).toFixed(1)}, ${(flareLeftX + 13).toFixed(1)} ${(baseY + 6).toFixed(1)}`,
    `M ${(baseX - topW * 0.55).toFixed(1)} ${(baseY - collarHeight + 4).toFixed(1)} C ${(baseX - topW * 0.4 - 9).toFixed(1)} ${(baseY - collarHeight * 0.45).toFixed(1)}, ${(baseX - 42).toFixed(1)} ${(baseY - 6).toFixed(1)}, ${(baseX - 57).toFixed(1)} ${(baseY + 10).toFixed(1)}`,
    `M ${(baseX - topW * 0.22).toFixed(1)} ${(baseY - collarHeight + 3).toFixed(1)} C ${(baseX - 17).toFixed(1)} ${(baseY - collarHeight * 0.4).toFixed(1)}, ${(baseX - 25).toFixed(1)} ${(baseY - 2).toFixed(1)}, ${(baseX - 29).toFixed(1)} ${(baseY + 13).toFixed(1)}`,
    // Flauta central divisoria
    `M ${baseX.toFixed(1)} ${(baseY - collarHeight + 2).toFixed(1)} C ${(baseX - 4).toFixed(1)} ${(baseY - collarHeight * 0.45).toFixed(1)}, ${(baseX + 2).toFixed(1)} ${(baseY - 6).toFixed(1)}, ${baseX.toFixed(1)} ${(baseY + 12).toFixed(1)}`,
    // Flautas del flanco derecho
    `M ${(baseX + topW * 0.22).toFixed(1)} ${(baseY - collarHeight + 3).toFixed(1)} C ${(baseX + 17).toFixed(1)} ${(baseY - collarHeight * 0.4).toFixed(1)}, ${(baseX + 25).toFixed(1)} ${(baseY - 2).toFixed(1)}, ${(baseX + 29).toFixed(1)} ${(baseY + 13).toFixed(1)}`,
    `M ${(baseX + topW * 0.55).toFixed(1)} ${(baseY - collarHeight + 4).toFixed(1)} C ${(baseX + topW * 0.4 + 9).toFixed(1)} ${(baseY - collarHeight * 0.45).toFixed(1)}, ${(baseX + 42).toFixed(1)} ${(baseY - 6).toFixed(1)}, ${(baseX + 57).toFixed(1)} ${(baseY + 10).toFixed(1)}`,
    `M ${(baseX + topW * 0.85).toFixed(1)} ${(baseY - collarHeight + 5).toFixed(1)} C ${(baseX + topW + 5).toFixed(1)} ${(baseY - collarHeight * 0.5).toFixed(1)}, ${(flareRightX - 45).toFixed(1)} ${(baseY - 11).toFixed(1)}, ${(flareRightX - 13).toFixed(1)} ${(baseY + 6).toFixed(1)}`
  ];

  flutes.forEach((fPath, fIdx) => {
    const flute = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    flute.setAttribute('d', fPath);
    flute.setAttribute('class', 'root-flute-ridge');
    flute.setAttribute('stroke-width', (fIdx === 0 || fIdx === flutes.length - 1) ? (isMobile ? '1.5' : '2.3') : (isMobile ? '1.2' : '1.8'));
    container.appendChild(flute);
  });

  // 4. Raíces vivas principales que se hunden y adelgazan orgánicamente hacia la tierra (-40%)
  const naturalRoots = [
    // Raíz lateral izquierda mayor (se despliega ampliamente)
    {
      path: `M ${(baseX - topW * 0.9).toFixed(1)} ${(baseY - collarHeight * 0.35).toFixed(1)} C ${(flareLeftX + 18).toFixed(1)} ${(baseY - 6).toFixed(1)}, ${(flareLeftX - 27).toFixed(1)} ${(baseY + 9).toFixed(1)}, ${(flareLeftX - (isMobile ? 42 : 72)).toFixed(1)} ${(baseY + 15).toFixed(1)}`,
      wStart: isMobile ? 8.5 : 12,
      wEnd: 1.8
    },
    // Ramilla secundaria izquierda baja
    {
      path: `M ${(flareLeftX + 6).toFixed(1)} ${(baseY + 5).toFixed(1)} Q ${(flareLeftX - 21).toFixed(1)} ${(baseY + 13).toFixed(1)}, ${(flareLeftX - (isMobile ? 33 : 54)).toFixed(1)} ${(baseY + 18).toFixed(1)}`,
      wStart: isMobile ? 5 : 6.6,
      wEnd: 1.5
    },
    // Raíz de anclaje profundo centro-izquierda
    {
      path: `M ${(baseX - 21).toFixed(1)} ${(baseY).toFixed(1)} Q ${(baseX - 31).toFixed(1)} ${(baseY + 13).toFixed(1)}, ${(baseX - 27).toFixed(1)} ${(baseY + 24).toFixed(1)}`,
      wStart: isMobile ? 6.6 : 9,
      wEnd: 1.5
    },
    // Raíz de anclaje profundo centro-derecha
    {
      path: `M ${(baseX + 21).toFixed(1)} ${(baseY).toFixed(1)} Q ${(baseX + 31).toFixed(1)} ${(baseY + 13).toFixed(1)}, ${(baseX + 27).toFixed(1)} ${(baseY + 24).toFixed(1)}`,
      wStart: isMobile ? 6.6 : 9,
      wEnd: 1.5
    },
    // Ramilla secundaria derecha baja
    {
      path: `M ${(flareRightX - 6).toFixed(1)} ${(baseY + 5).toFixed(1)} Q ${(flareRightX + 21).toFixed(1)} ${(baseY + 13).toFixed(1)}, ${(flareRightX + (isMobile ? 33 : 54)).toFixed(1)} ${(baseY + 18).toFixed(1)}`,
      wStart: isMobile ? 5 : 6.6,
      wEnd: 1.5
    },
    // Raíz lateral derecha mayor
    {
      path: `M ${(baseX + topW * 0.9).toFixed(1)} ${(baseY - collarHeight * 0.35).toFixed(1)} C ${(flareRightX - 18).toFixed(1)} ${(baseY - 6).toFixed(1)}, ${(flareRightX + 27).toFixed(1)} ${(baseY + 9).toFixed(1)}, ${(flareRightX + (isMobile ? 42 : 72)).toFixed(1)} ${(baseY + 15).toFixed(1)}`,
      wStart: isMobile ? 8.5 : 12,
      wEnd: 1.8
    }
  ];

  naturalRoots.forEach(nr => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', nr.path);
    p.setAttribute('class', 'root-finger-stem');
    p.setAttribute('stroke-width', ((nr.wStart + nr.wEnd) / 2).toString());
    container.appendChild(p);

    const rim = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rim.setAttribute('d', nr.path);
    rim.setAttribute('class', 'root-finger-rim');
    rim.setAttribute('stroke-width', ((nr.wStart + nr.wEnd) / 5).toString());
    container.appendChild(rim);
  });

  // 5. Venas luminosas de savia vital que fluyen hacia las raíces profundas (-40%)
  const sapVeins = [
    `M ${(baseX - 4).toFixed(1)} ${(baseY - collarHeight + 9).toFixed(1)} C ${(baseX - 15).toFixed(1)} ${(baseY - collarHeight * 0.4).toFixed(1)}, ${(baseX - 36).toFixed(1)} ${(baseY).toFixed(1)}, ${(flareLeftX + 15).toFixed(1)} ${(baseY + 10).toFixed(1)}`,
    `M ${baseX.toFixed(1)} ${(baseY - collarHeight + 6).toFixed(1)} C ${(baseX - 2).toFixed(1)} ${(baseY - collarHeight * 0.4).toFixed(1)}, ${(baseX + 1).toFixed(1)} ${(baseY).toFixed(1)}, ${baseX.toFixed(1)} ${(baseY + 14).toFixed(1)}`,
    `M ${(baseX + 4).toFixed(1)} ${(baseY - collarHeight + 9).toFixed(1)} C ${(baseX + 15).toFixed(1)} ${(baseY - collarHeight * 0.4).toFixed(1)}, ${(baseX + 36).toFixed(1)} ${(baseY).toFixed(1)}, ${(flareRightX - 15).toFixed(1)} ${(baseY + 10).toFixed(1)}`
  ];

  sapVeins.forEach(svD => {
    const sPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sPath.setAttribute('d', svD);
    sPath.setAttribute('class', 'root-sap-vein');
    sPath.setAttribute('stroke-width', isMobile ? '1.5' : '2.3');
    container.appendChild(sPath);
  });

  // 6. Manchas de musgo vivo y nódulos biológicos en los recovecos del collar (-40%)
  const mossSpots = [
    { cx: baseX - 27, cy: baseY - collarHeight * 0.25, r: 5.5 },
    { cx: baseX - 49, cy: baseY - 4, r: 4.8 },
    { cx: flareLeftX + 21, cy: baseY + 4, r: 6 },
    { cx: baseX + 27, cy: baseY - collarHeight * 0.25, r: 5.5 },
    { cx: baseX + 49, cy: baseY - 4, r: 4.8 },
    { cx: flareRightX - 21, cy: baseY + 4, r: 6 },
    { cx: baseX - 10, cy: baseY + 8, r: 4.2 },
    { cx: baseX + 11, cy: baseY + 8, r: 4.2 },
    { cx: baseX - 72, cy: baseY + 11, r: 3.6 },
    { cx: baseX + 72, cy: baseY + 11, r: 3.6 }
  ];

  mossSpots.forEach(ms => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', ms.cx.toFixed(1));
    c.setAttribute('cy', ms.cy.toFixed(1));
    c.setAttribute('r', ms.r.toString());
    c.setAttribute('class', 'root-moss-detail');
    container.appendChild(c);
  });

  // 7. Tiernos brotes verdes que nacen al pie del árbol (-40%)
  const sprouts = [
    { x: baseX - (isMobile ? 39 : 63), y: baseY + 6, angle: -24, scale: 0.45 },
    { x: baseX - (isMobile ? 18 : 27), y: baseY + 11, angle: -10, scale: 0.39 },
    { x: baseX + (isMobile ? 18 : 27), y: baseY + 11, angle: 12, scale: 0.39 },
    { x: baseX + (isMobile ? 39 : 63), y: baseY + 6, angle: 26, scale: 0.45 }
  ];

  sprouts.forEach(sp => {
    const gSprout = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gSprout.setAttribute('class', 'root-sprout-leaf');
    gSprout.setAttribute('transform', `translate(${sp.x.toFixed(1)}, ${sp.y.toFixed(1)}) rotate(${sp.angle}) scale(${sp.scale})`);

    const blade = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    blade.setAttribute('d', 'M 0 0 C -6 -9, -9 -20, 0 -30 C 9 -20, 6 -9, 0 0 Z');
    blade.setAttribute('fill', '#a3e635');
    blade.setAttribute('stroke', '#4d7c0f');
    blade.setAttribute('stroke-width', '1');
    gSprout.appendChild(blade);

    const vein = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vein.setAttribute('x1', '0');
    vein.setAttribute('y1', '0');
    vein.setAttribute('x2', '0');
    vein.setAttribute('y2', '-22');
    vein.setAttribute('stroke', '#d9f99d');
    vein.setAttribute('stroke-width', '0.8');
    gSprout.appendChild(vein);

    container.appendChild(gSprout);
  });
}

// Generador de ramas botánicas con 6 arquetipos vivos y hojas deltoides de chopo
function renderBranchCluster(branchCont, foliageCont, startX, startY, direction, count, seed, isMobile, docWidth) {
  const isLeftSide = startX < docWidth * 0.50;

  // 6 Arquetipos de rama con personalidad botánica variada
  const archetype = seed % 6;
  const swayClasses = [
    'branch-sway-arch',
    'branch-sway-breeze',
    'branch-sway-wave',
    'branch-sway-drape',
    'branch-sway-spring',
    'branch-sway-gust'
  ];
  const chosenSway = swayClasses[seed % swayClasses.length];

  let spanX = 0;
  let endY = 0;
  let cp1X = 0, cp1Y = 0, cp2X = 0, cp2Y = 0;

  if (direction === 'inward') {
    const inReach = isMobile ? Math.min(docWidth * 0.32, 190) : Math.min(docWidth * 0.25, 330);
    spanX = isLeftSide ? inReach : -inReach;
  } else {
    const outMin = isMobile ? 180 : 310;
    const outMax = isMobile ? 240 : 420;
    const outReach = Math.max(outMin, Math.min(docWidth * 0.28, outMax));
    spanX = isLeftSide ? -outReach : outReach;
  }

  let endX = startX + spanX;
  endX = Math.max(30, Math.min(docWidth - 30, endX));

  if (archetype === 0) {
    endY = startY - (56 + (seed % 3) * 22);
    cp1X = startX + spanX * 0.35;
    cp1Y = startY + (isLeftSide ? 25 : -25);
    cp2X = startX + spanX * 0.72;
    cp2Y = endY + 16;
  } else if (archetype === 1) {
    endY = startY - (74 + (seed % 4) * 24);
    cp1X = startX + spanX * 0.28;
    cp1Y = startY - 36;
    cp2X = startX + spanX * 0.68;
    cp2Y = endY - 26;
  } else if (archetype === 2) {
    spanX *= 1.25;
    endX = Math.max(30, Math.min(docWidth - 30, startX + spanX));
    endY = startY - (42 + (seed % 3) * 16);
    cp1X = startX + spanX * 0.45;
    cp1Y = startY - 14;
    cp2X = startX + spanX * 0.82;
    cp2Y = endY + 20;
  } else if (archetype === 3) {
    endY = startY + (direction === 'inward' ? -42 : 24) - ((seed % 2) * 16);
    cp1X = startX + spanX * 0.38;
    cp1Y = startY + 42;
    cp2X = startX + spanX * 0.76;
    cp2Y = endY + 28;
  } else if (archetype === 4) {
    endY = startY - (65 + (seed % 3) * 18);
    cp1X = startX + spanX * 0.30;
    cp1Y = startY - 22;
    cp2X = startX + spanX * 0.65;
    cp2Y = endY - 12;
  } else {
    endY = startY - (62 + (seed % 4) * 20);
    cp1X = startX + spanX * 0.32;
    cp1Y = startY + (isLeftSide ? 20 : -20);
    cp2X = startX + spanX * 0.75;
    cp2Y = endY + 12;
  }

  const isGrowingLeft = spanX < 0;

  // Grupo de rama con animación de balanceo
  const branchGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  branchGroup.setAttribute('class', `tree-branch-group ${chosenSway}`);
  branchGroup.style.transformOrigin = `${startX}px ${startY}px`;
  branchGroup.style.animationDelay = `-${((seed * 1.7) % 7).toFixed(1)}s`;
  branchGroup.style.animationDuration = `${5.5 + (seed % 5) * 1.6}s`;

  // Tallo principal (reducido 40%)
  const limb = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const limbD = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  limb.setAttribute('d', limbD);
  limb.setAttribute('class', 'branch-limb-stem');
  limb.setAttribute('stroke-width', isMobile ? '3.8' : '5.5');
  branchGroup.appendChild(limb);

  // Ramillas secundarias (-40%)
  const twigSign = isGrowingLeft ? -1 : 1;
  const twigCount = 3 + (seed % 2);
  const twigs = [];
  twigs.push({ t: 0.40, lenX: twigSign * (35 + (seed % 3) * 9), lenY: -25, stroke: 2.8 });
  twigs.push({ t: 0.70, lenX: twigSign * (31 + (seed % 2) * 8), lenY: 21, stroke: 2.2 });
  twigs.push({ t: 0.55, lenX: twigSign * 27, lenY: -35, stroke: 1.9 });
  if (twigCount >= 4) {
    twigs.push({ t: 0.84, lenX: twigSign * 22, lenY: 14, stroke: 1.7 });
  }

  const twigEndpoints = [{ x: endX, y: endY }];

  twigs.forEach(tw => {
    const t = tw.t;
    const mt = 1 - t;
    const bx = mt ** 3 * startX + 3 * mt ** 2 * t * cp1X + 3 * mt * t ** 2 * cp2X + t ** 3 * endX;
    const by = mt ** 3 * startY + 3 * mt ** 2 * t * cp1Y + 3 * mt * t ** 2 * cp2Y + t ** 3 * endY;

    let tx = bx + tw.lenX;
    tx = Math.max(25, Math.min(docWidth - 25, tx));
    const ty = by + tw.lenY;
    twigEndpoints.push({ x: tx, y: ty });

    const twigPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    twigPath.setAttribute('d', `M ${bx.toFixed(1)} ${by.toFixed(1)} Q ${(bx + tx) / 2} ${by - 10} ${tx.toFixed(1)} ${ty.toFixed(1)}`);
    twigPath.setAttribute('class', 'branch-twig-stem');
    twigPath.setAttribute('stroke-width', tw.stroke.toString());
    branchGroup.appendChild(twigPath);
  });

  livingTreeState.branchTips.push({ x: endX, y: endY });

  const chopoLeafColors = [
    '#64822c',
    '#44591d',
    '#7ea432',
    '#a3e635',
    '#e59a22'
  ];

  const foliageCluster = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  foliageCluster.setAttribute('class', 'tree-leaf-cluster');

  twigEndpoints.forEach((ep, epIdx) => {
    const leavesForTwig = Math.max(3, Math.floor(count / twigEndpoints.length));

    for (let l = 0; l < leavesForTwig; l++) {
      const leafGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      leafGroup.setAttribute('class', 'chopo-leaf-node');

      const baseAngle = isGrowingLeft ? 180 : 0;
      const angleOffset = (l - leavesForTwig / 2) * 28 + (seed * 17) % 22;
      const leafAngle = baseAngle + angleOffset;

      const dist = 9 + l * 5.5;
      const rad = (leafAngle * Math.PI) / 180;
      const lx = ep.x + Math.cos(rad) * dist;
      const ly = ep.y + Math.sin(rad) * dist;

      const leafScale = 0.52 + ((seed + l) % 5) * 0.08;
      const leafColor = chopoLeafColors[(seed + l + epIdx) % chopoLeafColors.length];

      leafGroup.setAttribute('transform', `translate(${lx.toFixed(1)}, ${ly.toFixed(1)}) rotate(${leafAngle + 90}) scale(${leafScale})`);

      const leafBlade = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const bladeD = 'M 0 0 C -6.5 -8, -10 -17, 0 -28 C 10 -17, 6.5 -8, 0 0 Z';
      leafBlade.setAttribute('d', bladeD);
      leafBlade.setAttribute('class', 'chopo-leaf-blade');
      leafBlade.setAttribute('fill', leafColor);
      leafGroup.appendChild(leafBlade);

      const leafVein = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      leafVein.setAttribute('d', 'M 0 0 L 0 -25');
      leafVein.setAttribute('class', 'chopo-leaf-vein');
      leafGroup.appendChild(leafVein);

      const petiole = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      petiole.setAttribute('d', 'M 0 0 L 0 3.5');
      petiole.setAttribute('stroke', '#3d2a17');
      petiole.setAttribute('stroke-width', '0.8');
      petiole.setAttribute('stroke-linecap', 'round');
      leafGroup.appendChild(petiole);

      foliageCluster.appendChild(leafGroup);

      livingTreeState.allLeafNodes.push({
        group: leafGroup,
        blade: leafBlade,
        petiole,
        color: leafColor,
        x: lx,
        y: ly,
        scale: leafScale,
        isDropping: false
      });
    }
  });

  branchGroup.appendChild(foliageCluster);
  branchCont.appendChild(branchGroup);
}

// Ciclo de caída y rebrote de hojas
export function initLeafLifeCycle() {
  if (livingTreeState.leafCycleInterval) {
    clearInterval(livingTreeState.leafCycleInterval);
  }

  livingTreeState.leafCycleInterval = setInterval(() => {
    if (!livingTreeState.allLeafNodes || livingTreeState.allLeafNodes.length === 0) return;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    const visibleLeaves = livingTreeState.allLeafNodes.filter(l => {
      const screenY = l.y - scrollY;
      return screenY >= 60 && screenY <= vh - 80 && !l.isDropping;
    });

    if (visibleLeaves.length === 0) return;

    const targetLeaf = visibleLeaves[Math.floor(Math.random() * visibleLeaves.length)];
    targetLeaf.isDropping = true;

    targetLeaf.blade.classList.add('leaf-detaching');

    if (typeof window.spawnFloatingLeafAt === 'function') {
      const screenX = targetLeaf.x;
      const screenY = targetLeaf.y - scrollY;
      window.spawnFloatingLeafAt(screenX, screenY, targetLeaf.color);
    }

    setTimeout(() => {
      targetLeaf.blade.classList.remove('leaf-detaching');
      targetLeaf.blade.setAttribute('fill', '#bef264');
      targetLeaf.blade.classList.add('leaf-budding');

      setTimeout(() => {
        targetLeaf.blade.classList.remove('leaf-budding');
        targetLeaf.blade.setAttribute('fill', targetLeaf.color);
        targetLeaf.isDropping = false;
      }, 1800);
    }, 1600);
  }, 4600);
}
