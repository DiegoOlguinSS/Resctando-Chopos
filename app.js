/**
 * RESCATANDO CHOPOS — INTERACTIVE ENGINE
 * Animaciones, contadores, modal de voluntariado y utilidades
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER SCROLL EFFECT & DIRECT ANCHOR SCROLL
  const navbar = document.getElementById('navbar');
  const checkScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  const urlParams = new URLSearchParams(window.location.search);
  const scrollTarget = urlParams.get('scrollTo');
  if (scrollTarget) {
    const targetEl = document.getElementById(scrollTarget) || document.querySelector(scrollTarget);
    if (targetEl) {
      let top = 0;
      let curr = targetEl;
      while (curr && curr !== document.body) {
        top += curr.offsetTop || 0;
        curr = curr.offsetParent;
      }
      window.scrollTo(0, top);
    }
  }

  // 2. MOBILE NAVIGATION DRAWER
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll('.nav-item-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  const revealElements = document.querySelectorAll('.fade-in-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 4. ANIMATED NUMBER COUNTERS
  const counterElements = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.hasAttribute('data-decimal');
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeOut;

        if (isDecimal) {
          counter.textContent = currentVal.toFixed(1);
        } else {
          counter.textContent = Math.floor(currentVal).toLocaleString('es-MX');
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('es-MX');
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const metricsSection = document.querySelector('.metrics-container');
  if (metricsSection && 'IntersectionObserver' in window) {
    const metricsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
      }
    }, { threshold: 0.25 });
    metricsObserver.observe(metricsSection);
  } else {
    animateCounters();
  }

  // 5. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      // Cerrar otros acordeones si se prefiere una experiencia ordenada
      faqItems.forEach(i => i.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // 6. VOLUNTEER MODAL LOGIC
  const modal = document.getElementById('volunteer-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const volunteerForm = document.getElementById('volunteer-form');
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');

  const showToast = (message) => {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  const openModal = (brigadeTopic) => {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Si viene de una brigada específica, enfocar notas o ajustar mensaje
    const notesInput = document.getElementById('v-notes');
    if (brigadeTopic && brigadeTopic !== 'General' && notesInput) {
      notesInput.placeholder = `Me anoto para: ${brigadeTopic}`;
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const brigade = btn.getAttribute('data-brigade') || 'General';
      openModal(brigade);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Manejo de formulario de registro
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('v-name').value.trim();
      const contact = document.getElementById('v-contact').value.trim();
      const email = document.getElementById('v-email').value.trim();
      const notes = document.getElementById('v-notes').value.trim();
      
      const selectedInterests = Array.from(document.querySelectorAll('input[name="interest"]:checked'))
        .map(el => el.value);

      const record = {
        name,
        contact,
        email,
        interests: selectedInterests,
        notes,
        date: new Date().toISOString()
      };

      // Guardar en localStorage para persistencia ciudadana
      try {
        const stored = JSON.parse(localStorage.getItem('rescatando_chopos_voluntarios') || '[]');
        stored.push(record);
        localStorage.setItem('rescatando_chopos_voluntarios', JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      closeModal();
      volunteerForm.reset();
      showToast(`¡Gracias ${name}! Registro confirmado para la brigada del Parque Central 🌿`);
    });
  }

  // 7. COPIAR CORREO AL PORTAPAPELES
  const quickEmailBtn = document.getElementById('quick-email-btn');
  if (quickEmailBtn) {
    quickEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'rescatandochopos@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Correo copiado al portapapeles: ' + email);
      }).catch(() => {
        window.location.href = 'mailto:' + email;
      });
    });
  }

  // 8. COPIAR DIRECCIÓN AL PORTAPAPELES
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = 'Autopista Querétaro-México 34, Arcos del Alba, Cuautitlán Izcalli, México';
      navigator.clipboard.writeText(address).then(() => {
        showToast('📍 Dirección copiada: ' + address);
      });
    });
  }

  // 9. ACTIVE NAV LINK ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // 10. LIGHTBOX PARA FOTOGRAFÍAS Y MANIFIESTO
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close');

  const openLightbox = (imgSrc, captionText) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = captionText || '';
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      // Evitar conflicto si es un botón dentro
      if (e.target.closest('button.btn') && !e.target.closest('.manifesto-zoom-hint')) return;
      const imgSrc = trigger.getAttribute('data-lightbox');
      const caption = trigger.getAttribute('data-caption');
      openLightbox(imgSrc, caption);
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-container')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });

  // 11. COUNTDOWN TIMER PARA LA PRÓXIMA BRIGADA
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  if (cdDays && cdHours && cdMins && cdSecs) {
    // Calculamos una fecha objetivo atractiva (el próximo sábado a las 8:30 AM)
    const now = new Date();
    let targetDate = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    targetDate.setDate(now.getDate() + daysUntilSaturday);
    targetDate.setHours(8, 30, 0, 0);

    const updateCountdown = () => {
      const current = new Date().getTime();
      const diff = targetDate.getTime() - current;

      if (diff <= 0) {
        cdDays.textContent = '00';
        cdHours.textContent = '00';
        cdMins.textContent = '00';
        cdSecs.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      cdDays.textContent = String(days).padStart(2, '0');
      cdHours.textContent = String(hours).padStart(2, '0');
      cdMins.textContent = String(mins).padStart(2, '0');
      cdSecs.textContent = String(secs).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 12. FILTROS INTERACTIVOS DE BIODIVERSIDAD
  const bioFilterBtns = document.querySelectorAll('.bio-filter-btn');
  const bioCards = document.querySelectorAll('.bio-card');

  if (bioFilterBtns.length > 0 && bioCards.length > 0) {
    bioFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        bioFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-bio-filter');

        bioCards.forEach(card => {
          const category = card.getAttribute('data-bio-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
              card.style.transition = 'all 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 30);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }



  // 15. BUZÓN CIUDADANO Y REPORTE VECINAL EN CONTACTO
  const contactQuickForm = document.getElementById('contact-quick-form');
  if (contactQuickForm) {
    contactQuickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('c-name').value.trim();
      const contact = document.getElementById('c-contact').value.trim();
      const topic = document.getElementById('c-topic').value;
      const message = document.getElementById('c-message').value.trim();

      const reportRecord = {
        name,
        contact,
        topic,
        message,
        date: new Date().toISOString()
      };

      try {
        const storedReports = JSON.parse(localStorage.getItem('rescatando_chopos_reportes') || '[]');
        storedReports.push(reportRecord);
        localStorage.setItem('rescatando_chopos_reportes', JSON.stringify(storedReports));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      contactQuickForm.reset();
      showToast(`¡Gracias ${name}! Tu mensaje sobre "${topic}" ha sido recibido con éxito.`);
    });
  }

  // 16. BOTÓN COPIAR CORREO EN SECCIÓN CONTACTO
  const copyEmailContactBtn = document.getElementById('copy-email-contact-btn');
  if (copyEmailContactBtn) {
    copyEmailContactBtn.addEventListener('click', () => {
      const email = 'rescatandochopos@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✉️ Correo copiado: ' + email);
      }).catch(() => {
        window.location.href = 'mailto:' + email;
      });
    });
  }

  // ===================================================================
  // 17. SISTEMA PROCEDURAL DEL ÁRBOL VIVO (TRONCO SINUOSO, RAMAS Y VIDA BOTÁNICA)
  // ===================================================================
  const livingTreeState = {
    branchTips: [],
    allLeafNodes: [],
    isGenerated: false,
    leafCycleInterval: null
  };

  // Función para obtener la posición vertical absoluta exacta en el documento
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

  function initLivingTreeSystem() {
    const svgEl = document.getElementById('living-tree-svg');
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
    rootsGroup.innerHTML = '';
    trunkGroup.innerHTML = '';
    branchesGroup.innerHTML = '';
    foliageGroup.innerHTML = '';
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

    // 2. Hero: Detrás de la tarjeta de cuenta regresiva (extiende ramas visibles a izquierda e interior)
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

    // 6. Brigadas: Pasa por detrás de la Tarjeta 1 (extiende ramas a la izquierda y centro)
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

    // 7. Brigadas: Ondulación continua cruzando por detrás de la Tarjeta 3 (ramas a derecha e interior)
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

    // 10. Biodiversidad: Curva ondulante cruzando las tarjetas de fauna y flora
    const speciesCards = document.querySelectorAll('.species-card');
    if (speciesCards.length >= 1) {
      const r1 = getElementDocRect(speciesCards[0]);
      rawMilestones.push({
        id: 'm_biodiv_1',
        x: r1.centerX,
        y: r1.centerY,
        branchDirs: ['inward'],
        leavesCount: 16
      });
    }
    if (speciesCards.length >= 3) {
      const rLast = getElementDocRect(speciesCards[speciesCards.length - 1]);
      rawMilestones.push({
        id: 'm_biodiv_last',
        x: rLast.centerX,
        y: rLast.centerY,
        branchDirs: ['outward'],
        leavesCount: 16
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

    // 15. FAQ: En vez de un trazo recto central, ondea de izquierda a derecha detrás del acordeón
    const faqEl = document.getElementById('faq');
    if (faqEl) {
      const rFaq = getElementDocRect(faqEl);
      rawMilestones.push({
        id: 'm_faq_wave_left',
        x: Math.max(docWidth * 0.28, rFaq.left + rFaq.width * 0.28),
        y: rFaq.top + rFaq.height * 0.30,
        branchDirs: ['inward'],
        leavesCount: 15
      });
      rawMilestones.push({
        id: 'm_faq_wave_right',
        x: Math.min(docWidth * 0.72, rFaq.left + rFaq.width * 0.72),
        y: rFaq.top + rFaq.height * 0.72,
        branchDirs: ['outward'],
        leavesCount: 15
      });
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
      rawMilestones.push({ id: 'm_cta_fb', x: docWidth * 0.36, y: docHeight - 320, branchDirs: ['inward'], leavesCount: 12 });
    }

    // 17. Transición suave al Footer hacia el centro del lecho de raíces (sin ramas en la base del tronco)
    rawMilestones.push({
      id: 'm_footer_entry',
      x: docWidth * 0.50,
      y: docHeight - 110,
      branchDirs: [],
      leavesCount: 0
    });

    // Ordenar de arriba hacia abajo (Y ascendente)
    rawMilestones.sort((a, b) => a.y - b.y);

    // Punto de origen: Raíces en el fondo de la página (Footer / Tierra)
    const earthBaseY = docHeight - 20;
    const earthBaseX = centerMargin;

    // Lista de puntos del tronco desde la base (tierra) hacia la copa (hero)
    const trunkPoints = [];
    trunkPoints.push({
      x: earthBaseX,
      y: earthBaseY,
      width: isMobile ? 54 : 76,
      t: 1.0
    });

    // Invertir hitos para construir la curva desde la tierra hasta la copa
    for (let i = rawMilestones.length - 1; i >= 0; i--) {
      const ms = rawMilestones[i];
      const progress = Math.max(0, Math.min(1, ms.y / docHeight));
      const trunkWidth = isMobile
        ? Math.max(10, 48 * (progress ** 0.75))
        : Math.max(12, 68 * (progress ** 0.75));

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
    mossPath.setAttribute('stroke-width', isMobile ? '8' : '14');
    mossPath.setAttribute('fill', 'none');
    trunkGroup.appendChild(mossPath);

    // 4. Canal vital luminoso de savia ascendente
    const sapPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sapPath.setAttribute('d', centerlineD);
    sapPath.setAttribute('class', 'trunk-sap-line');
    sapPath.setAttribute('stroke-width', isMobile ? '3.5' : '5');
    sapPath.setAttribute('fill', 'none');
    trunkGroup.appendChild(sapPath);

    // 5. Raíces escultóricas botánicas en el suelo del footer
    renderRoots(rootsGroup, earthBaseX, earthBaseY, docWidth);

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

  // Generador de base radicular escultórica orgánica de chopo centenario
  function renderRoots(container, baseX, baseY, docWidth) {
    const isMobile = docWidth < 900;
    const spreadW = Math.min(docWidth * 0.32, isMobile ? 220 : 340);

    // 1. Lecho de humus orgánico suave y profundo
    const moundAmbient = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    moundAmbient.setAttribute('cx', baseX.toFixed(1));
    moundAmbient.setAttribute('cy', (baseY + 12).toFixed(1));
    moundAmbient.setAttribute('rx', (spreadW * 1.1).toFixed(1));
    moundAmbient.setAttribute('ry', '34');
    moundAmbient.setAttribute('class', 'root-mound-ambient');
    container.appendChild(moundAmbient);

    const moundDeep = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    moundDeep.setAttribute('cx', baseX.toFixed(1));
    moundDeep.setAttribute('cy', (baseY + 6).toFixed(1));
    moundDeep.setAttribute('rx', (spreadW * 0.65).toFixed(1));
    moundDeep.setAttribute('ry', '22');
    moundDeep.setAttribute('class', 'root-mound-deep');
    container.appendChild(moundDeep);

    // 2. Pie contrafuerte acampanado y esculpido (Collar botánico del chopo)
    const flareLeftX = baseX - (isMobile ? 70 : 105);
    const flareRightX = baseX + (isMobile ? 70 : 105);
    const topW = isMobile ? 26 : 38;
    const buttressD = `
      M ${(baseX - topW).toFixed(1)} ${(baseY - 85).toFixed(1)}
      C ${(baseX - topW - 8).toFixed(1)} ${(baseY - 45).toFixed(1)}, ${(flareLeftX + 25).toFixed(1)} ${(baseY - 15).toFixed(1)}, ${flareLeftX.toFixed(1)} ${(baseY + 8).toFixed(1)}
      Q ${baseX.toFixed(1)} ${(baseY + 22).toFixed(1)} ${flareRightX.toFixed(1)} ${(baseY + 8).toFixed(1)}
      C ${(flareRightX - 25).toFixed(1)} ${(baseY - 15).toFixed(1)}, ${(baseX + topW + 8).toFixed(1)} ${(baseY - 45).toFixed(1)}, ${(baseX + topW).toFixed(1)} ${(baseY - 85).toFixed(1)}
      Z
    `;
    const buttress = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    buttress.setAttribute('d', buttressD);
    buttress.setAttribute('class', 'root-buttress-main');
    container.appendChild(buttress);

    // 3. Estrías longitudinales de madera (flutes) que dan volumen 3D a la corteza
    const flutes = [
      `M ${(baseX - topW * 0.6).toFixed(1)} ${(baseY - 80).toFixed(1)} C ${(baseX - topW - 4).toFixed(1)} ${(baseY - 40).toFixed(1)}, ${(flareLeftX + 32).toFixed(1)} ${(baseY - 12).toFixed(1)}, ${(flareLeftX + 14).toFixed(1)} ${(baseY + 8).toFixed(1)}`,
      `M ${(baseX - topW * 0.15).toFixed(1)} ${(baseY - 82).toFixed(1)} C ${(baseX - 12).toFixed(1)} ${(baseY - 38).toFixed(1)}, ${(baseX - 24).toFixed(1)} ${(baseY - 6).toFixed(1)}, ${(baseX - 28).toFixed(1)} ${(baseY + 12).toFixed(1)}`,
      `M ${(baseX + topW * 0.20).toFixed(1)} ${(baseY - 82).toFixed(1)} C ${(baseX + 14).toFixed(1)} ${(baseY - 38).toFixed(1)}, ${(baseX + 26).toFixed(1)} ${(baseY - 6).toFixed(1)}, ${(baseX + 30).toFixed(1)} ${(baseY + 12).toFixed(1)}`,
      `M ${(baseX + topW * 0.65).toFixed(1)} ${(baseY - 80).toFixed(1)} C ${(baseX + topW + 4).toFixed(1)} ${(baseY - 40).toFixed(1)}, ${(flareRightX - 32).toFixed(1)} ${(baseY - 12).toFixed(1)}, ${(flareRightX - 14).toFixed(1)} ${(baseY + 8).toFixed(1)}`
    ];

    flutes.forEach(fPath => {
      const flute = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      flute.setAttribute('d', fPath);
      flute.setAttribute('class', 'root-flute-ridge');
      flute.setAttribute('stroke-width', isMobile ? '2' : '3');
      container.appendChild(flute);
    });

    // 4. Raíces vivas que se hunden y adelgazan orgánicamente hacia la tierra (sin trazos de carretera)
    const naturalRoots = [
      // Raíz lateral izquierda principal (se hunde hacia abajo a la izquierda)
      {
        path: `M ${(baseX - 42).toFixed(1)} ${(baseY - 22).toFixed(1)} C ${(baseX - 70).toFixed(1)} ${(baseY - 4).toFixed(1)}, ${(baseX - 110).toFixed(1)} ${(baseY + 8).toFixed(1)}, ${(baseX - 145).toFixed(1)} ${(baseY + 18).toFixed(1)}`,
        wStart: 15,
        wEnd: 3
      },
      // Ramilla radicular secundaria izquierda
      {
        path: `M ${(baseX - 82).toFixed(1)} ${(baseY + 2).toFixed(1)} Q ${(baseX - 125).toFixed(1)} ${(baseY + 14).toFixed(1)}, ${(baseX - 168).toFixed(1)} ${(baseY + 24).toFixed(1)}`,
        wStart: 7,
        wEnd: 2
      },
      // Raíz profunda de anclaje centro-izquierda
      {
        path: `M ${(baseX - 18).toFixed(1)} ${(baseY - 2).toFixed(1)} Q ${(baseX - 26).toFixed(1)} ${(baseY + 16).toFixed(1)}, ${(baseX - 22).toFixed(1)} ${(baseY + 30).toFixed(1)}`,
        wStart: 10,
        wEnd: 2
      },
      // Raíz profunda de anclaje centro-derecha
      {
        path: `M ${(baseX + 18).toFixed(1)} ${(baseY - 2).toFixed(1)} Q ${(baseX + 26).toFixed(1)} ${(baseY + 16).toFixed(1)}, ${(baseX + 22).toFixed(1)} ${(baseY + 30).toFixed(1)}`,
        wStart: 10,
        wEnd: 2
      },
      // Raíz lateral derecha principal (se hunde hacia abajo a la derecha)
      {
        path: `M ${(baseX + 42).toFixed(1)} ${(baseY - 22).toFixed(1)} C ${(baseX + 70).toFixed(1)} ${(baseY - 4).toFixed(1)}, ${(baseX + 112).toFixed(1)} ${(baseY + 8).toFixed(1)}, ${(baseX + 150).toFixed(1)} ${(baseY + 18).toFixed(1)}`,
        wStart: 15,
        wEnd: 3
      },
      // Ramilla radicular secundaria derecha
      {
        path: `M ${(baseX + 85).toFixed(1)} ${(baseY + 2).toFixed(1)} Q ${(baseX + 128).toFixed(1)} ${(baseY + 14).toFixed(1)}, ${(baseX + 172).toFixed(1)} ${(baseY + 24).toFixed(1)}`,
        wStart: 7,
        wEnd: 2
      }
    ];

    naturalRoots.forEach(nr => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', nr.path);
      p.setAttribute('class', 'root-finger-stem');
      p.setAttribute('stroke-width', ((nr.wStart + nr.wEnd) / 2).toString());
      container.appendChild(p);
    });

    // 5. Manchas orgánicas de musgo vivo en los recovecos del collar
    const mossSpots = [
      { cx: baseX - 34, cy: baseY - 16, r: 8 },
      { cx: baseX - 55, cy: baseY + 2, r: 7 },
      { cx: baseX + 32, cy: baseY - 14, r: 8 },
      { cx: baseX + 58, cy: baseY + 3, r: 7 },
      { cx: baseX - 8, cy: baseY + 6, r: 6 },
      { cx: baseX + 10, cy: baseY + 7, r: 6 }
    ];

    mossSpots.forEach(ms => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', ms.cx.toFixed(1));
      c.setAttribute('cy', ms.cy.toFixed(1));
      c.setAttribute('r', ms.r.toString());
      c.setAttribute('class', 'root-moss-detail');
      container.appendChild(c);
    });

    // 6. Tiernos brotes verdes que nacen al pie del árbol (esperanza y reforestación)
    const sprouts = [
      { x: baseX - 48, y: baseY + 4, angle: -24, scale: 0.65 },
      { x: baseX + 45, y: baseY + 5, angle: 22, scale: 0.70 },
      { x: baseX + 5, y: baseY + 12, angle: 6, scale: 0.55 }
    ];

    sprouts.forEach(sp => {
      const gSprout = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gSprout.setAttribute('class', 'root-sprout-leaf');
      gSprout.setAttribute('transform', `translate(${sp.x.toFixed(1)}, ${sp.y.toFixed(1)}) rotate(${sp.angle}) scale(${sp.scale})`);

      const blade = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      blade.setAttribute('d', 'M 0 0 C -6 -8, -8 -18, 0 -26 C 8 -18, 6 -8, 0 0 Z');
      blade.setAttribute('fill', '#a3e635');
      blade.setAttribute('stroke', '#4d7c0f');
      blade.setAttribute('stroke-width', '0.8');
      gSprout.appendChild(blade);

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
      // Ramas interiores: arquear hacia el centro / pasillos abiertos entre tarjetas
      const inReach = isMobile ? Math.min(docWidth * 0.32, 190) : Math.min(docWidth * 0.25, 330);
      spanX = isLeftSide ? inReach : -inReach;
    } else {
      // Ramas exteriores: extender ampliamente para sobrepasar las tarjetas y lucir con plenitud en los márgenes
      const outMin = isMobile ? 180 : 310;
      const outMax = isMobile ? 240 : 420;
      const outReach = Math.max(outMin, Math.min(docWidth * 0.28, outMax));
      spanX = isLeftSide ? -outReach : outReach;
    }

    let endX = startX + spanX;
    endX = Math.max(30, Math.min(docWidth - 30, endX));

    if (archetype === 0) {
      // Arquetipo 0: Arco S ascendente elegante
      endY = startY - (56 + (seed % 3) * 22);
      cp1X = startX + spanX * 0.35;
      cp1Y = startY + (isLeftSide ? 25 : -25);
      cp2X = startX + spanX * 0.72;
      cp2Y = endY + 16;
    } else if (archetype === 1) {
      // Arquetipo 1: Rama empinada buscando luz solar
      endY = startY - (74 + (seed % 4) * 24);
      cp1X = startX + spanX * 0.28;
      cp1Y = startY - 36;
      cp2X = startX + spanX * 0.68;
      cp2Y = endY - 26;
    } else if (archetype === 2) {
      // Arquetipo 2: Copa lateral ancha extendida
      spanX *= 1.25;
      endX = Math.max(30, Math.min(docWidth - 30, startX + spanX));
      endY = startY - (42 + (seed % 3) * 16);
      cp1X = startX + spanX * 0.45;
      cp1Y = startY - 14;
      cp2X = startX + spanX * 0.82;
      cp2Y = endY + 20;
    } else if (archetype === 3) {
      // Arquetipo 3: Rama pendular con remonte gracioso
      endY = startY + (direction === 'inward' ? -42 : 24) - ((seed % 2) * 16);
      cp1X = startX + spanX * 0.38;
      cp1Y = startY + 42;
      cp2X = startX + spanX * 0.76;
      cp2Y = endY + 28;
    } else if (archetype === 4) {
      // Arquetipo 4: Brote joven de copa alta
      endY = startY - (65 + (seed % 3) * 18);
      cp1X = startX + spanX * 0.30;
      cp1Y = startY - 22;
      cp2X = startX + spanX * 0.65;
      cp2Y = endY - 12;
    } else {
      // Arquetipo 5: Horqueta doble de copa alta
      endY = startY - (62 + (seed % 4) * 20);
      cp1X = startX + spanX * 0.32;
      cp1Y = startY + (isLeftSide ? 20 : -20);
      cp2X = startX + spanX * 0.75;
      cp2Y = endY + 12;
    }

    const isGrowingLeft = spanX < 0;

    // Grupo de rama con animación de balanceo asimétrico desfasado
    const branchGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    branchGroup.setAttribute('class', `tree-branch-group ${chosenSway}`);
    branchGroup.style.transformOrigin = `${startX}px ${startY}px`;
    branchGroup.style.animationDelay = `-${((seed * 1.7) % 7).toFixed(1)}s`;
    branchGroup.style.animationDuration = `${5.5 + (seed % 5) * 1.6}s`;

    // Tallo principal con grosor orgánico
    const limb = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const limbD = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;
    limb.setAttribute('d', limbD);
    limb.setAttribute('class', 'branch-limb-stem');
    limb.setAttribute('stroke-width', isMobile ? '6' : '9');
    branchGroup.appendChild(limb);

    // Ramillas secundarias con variación dinámica
    const twigSign = isGrowingLeft ? -1 : 1;
    const twigCount = 3 + (seed % 2); // 3 a 4 ramillas bien nutridas
    const twigs = [];
    twigs.push({ t: 0.40, lenX: twigSign * (55 + (seed % 3) * 14), lenY: -38, stroke: 4.8 });
    twigs.push({ t: 0.70, lenX: twigSign * (48 + (seed % 2) * 12), lenY: 32, stroke: 3.6 });
    twigs.push({ t: 0.55, lenX: twigSign * 42, lenY: -54, stroke: 3.2 });
    if (twigCount >= 4) {
      twigs.push({ t: 0.84, lenX: twigSign * 34, lenY: 22, stroke: 2.8 });
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

    // Almacenar coordenada de la punta para emisión de hojas flotantes
    livingTreeState.branchTips.push({ x: endX, y: endY });

    // Paleta botánica Populus deltoides
    const chopoLeafColors = [
      '#64822c', // Verde chopo oficial
      '#44591d', // Verde olivo profundo
      '#7ea432', // Verde hoja nueva soleada
      '#a3e635', // Verde lima fresco de brote
      '#e59a22'  // Ámbar cálido otoñal
    ];

    // Racimo de follaje: se acopla directamente al branchGroup para oscilar en armonía física con la rama
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

        const dist = 14 + l * 8.5;
        const rad = (leafAngle * Math.PI) / 180;
        const lx = ep.x + Math.cos(rad) * dist;
        const ly = ep.y + Math.sin(rad) * dist;

        const leafScale = 0.78 + ((seed + l) % 5) * 0.12;
        const leafColor = chopoLeafColors[(seed + l + epIdx) % chopoLeafColors.length];

        leafGroup.setAttribute('transform', `translate(${lx.toFixed(1)}, ${ly.toFixed(1)}) rotate(${leafAngle + 90}) scale(${leafScale})`);

        // Silueta deltoide de hoja de chopo
        const leafBlade = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const bladeD = 'M 0 0 C -10 -12, -15 -26, 0 -42 C 15 -26, 10 -12, 0 0 Z';
        leafBlade.setAttribute('d', bladeD);
        leafBlade.setAttribute('class', 'chopo-leaf-blade');
        leafBlade.setAttribute('fill', leafColor);
        leafGroup.appendChild(leafBlade);

        // Nervadura central
        const leafVein = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        leafVein.setAttribute('d', 'M 0 0 L 0 -38');
        leafVein.setAttribute('class', 'chopo-leaf-vein');
        leafGroup.appendChild(leafVein);

        // Peciolo (tallo característico)
        const petiole = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        petiole.setAttribute('d', 'M 0 0 L 0 5');
        petiole.setAttribute('stroke', '#3d2a17');
        petiole.setAttribute('stroke-width', '1.2');
        petiole.setAttribute('stroke-linecap', 'round');
        leafGroup.appendChild(petiole);

        foliageCluster.appendChild(leafGroup);

        // Registrar hoja en el registro de vida botánica
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

  // ===================================================================
  // CICLO BOTÁNICO: CAÍDA DINÁMICA Y REBROTE PERIÓDICO DE HOJAS
  // ===================================================================
  function initLeafLifeCycle() {
    if (livingTreeState.leafCycleInterval) {
      clearInterval(livingTreeState.leafCycleInterval);
    }

    livingTreeState.leafCycleInterval = setInterval(() => {
      if (!livingTreeState.allLeafNodes || livingTreeState.allLeafNodes.length === 0) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Filtrar hojas actualmente en el campo de visión del usuario
      const visibleLeaves = livingTreeState.allLeafNodes.filter(l => {
        const screenY = l.y - scrollY;
        return screenY >= 60 && screenY <= vh - 80 && !l.isDropping;
      });

      if (visibleLeaves.length === 0) return;

      // Escoger una hoja al azar dentro del viewport
      const targetLeaf = visibleLeaves[Math.floor(Math.random() * visibleLeaves.length)];
      targetLeaf.isDropping = true;

      // 1. Animación de desprendimiento en el SVG
      targetLeaf.blade.classList.add('leaf-detaching');

      // 2. Spawnear simultáneamente en el motor Canvas para que caiga bailando con física 3D
      if (typeof window.spawnFloatingLeafAt === 'function') {
        const screenX = targetLeaf.x;
        const screenY = targetLeaf.y - scrollY;
        window.spawnFloatingLeafAt(screenX, screenY, targetLeaf.color);
      }

      // 3. Después de desprenderse, rebrotar una hoja tierna fresca en su lugar
      setTimeout(() => {
        targetLeaf.blade.classList.remove('leaf-detaching');
        // Brote nuevo en verde lima tierno
        targetLeaf.blade.setAttribute('fill', '#bef264');
        targetLeaf.blade.classList.add('leaf-budding');

        // Al madurar el brote, restablecer su color natural
        setTimeout(() => {
          targetLeaf.blade.classList.remove('leaf-budding');
          targetLeaf.blade.setAttribute('fill', targetLeaf.color);
          targetLeaf.isDropping = false;
        }, 1800);
      }, 1600);
    }, 2800);
  }

  // Inicializar Árbol Vivo al cargar DOM y cuando las imágenes estén listas
  initLivingTreeSystem();
  window.addEventListener('load', () => {
    initLivingTreeSystem();
  });

  // Reconstruir con debounce suave ante redimensionamientos de ventana
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initLivingTreeSystem();
    }, 280);
  }, { passive: true });

  // ===================================================================
  // 18. MOTOR DE HOJAS FLOTANTES 3D Y ESPORAS BOTÁNICAS (CANVAS INTERACTIVO)
  // ===================================================================
  function initFloatingLeavesEngine() {
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

    // Impulso de ráfaga de viento al hacer clic (desprendimiento dinámico)
    window.addEventListener('click', (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      // Generar una ráfaga de 6 a 8 hojas que danzan desde el clic
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

    // Clase para hojas de chopo flotantes en 3D
    class FloatingLeaf {
      constructor(spawnX, spawnY, isBurst = false, customColor = null) {
        const p = leafPalette[Math.floor(Math.random() * leafPalette.length)];
        this.color = customColor || p.main;
        this.undersideColor = p.under;

        this.x = spawnX !== undefined ? spawnX + (Math.random() - 0.5) * 30 : Math.random() * width;
        this.y = spawnY !== undefined ? spawnY + (Math.random() - 0.5) * 30 : -30 - Math.random() * 80;

        this.size = 11 + Math.random() * 12; // Tamaño armónico
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

        // Rotación 3D de volteo (flip)
        this.flipAngle = Math.random() * Math.PI * 2;
        this.flipSpeed = 0.02 + Math.random() * 0.035;

        // Oscilación sinusoidal de deriva (bamboleo)
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

        // Reacción aerodinámica al cursor del mouse
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

        // Fricción suave del aire
        this.vx *= 0.985;
        if (this.vy > 2.8) this.vy *= 0.98;

        // Si sale de la pantalla, reiniciar desde arriba
        if (this.y > height + 40 || this.x < -60 || this.x > width + 60) {
          this.isAlive = false;
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);

        // Efecto 3D: Math.cos(flipAngle) simula el giro tridimensional de la hoja
        const flipScale = Math.cos(this.flipAngle);
        context.scale(flipScale * this.scale, this.scale);

        const isUnderside = flipScale < 0;
        context.fillStyle = isUnderside ? this.undersideColor : this.color;
        context.globalAlpha = this.opacity;

        // Silueta vectorial de hoja de chopo
        const sz = this.size;
        context.beginPath();
        context.moveTo(0, sz * 0.7); // Peciolo inferior
        context.bezierCurveTo(-sz * 0.7, sz * 0.35, -sz * 0.85, -sz * 0.3, 0, -sz * 0.95); // Lóbulo izquierdo a punta
        context.bezierCurveTo(sz * 0.85, -sz * 0.3, sz * 0.7, sz * 0.35, 0, sz * 0.7); // Lóbulo derecho a peciolo
        context.closePath();
        context.fill();

        // Nervadura central luminosa
        context.strokeStyle = isUnderside ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)';
        context.lineWidth = 0.9;
        context.beginPath();
        context.moveTo(0, sz * 0.7);
        context.lineTo(0, -sz * 0.85);
        context.stroke();

        context.restore();
      }
    }

    // Exponer función para que el ciclo biológico spawnee hojas cayendo
    window.spawnFloatingLeafAt = (x, y, color) => {
      leaves.push(new FloatingLeaf(x, y, true, color));
    };

    // Clase para esporas botánicas / luciérnagas nocturnas del Parque Central
    class ForestSpore {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // Distribuir en toda la altura al inicio
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10 + Math.random() * 30;
        this.radius = 1.6 + Math.random() * 2.2;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = -(0.4 + Math.random() * 0.7); // Flotan suavemente hacia arriba
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

    // Colección de partículas
    const leaves = [];
    const spores = [];

    // Población inicial de hojas (32 hojas flotantes)
    for (let i = 0; i < 32; i++) {
      const leaf = new FloatingLeaf();
      leaf.y = Math.random() * height; // Distribuir por la pantalla al cargar
      leaves.push(leaf);
    }

    // Población de 24 esporas botánicas / luciérnagas
    for (let i = 0; i < 24; i++) {
      spores.push(new ForestSpore());
    }

    // Desprendimiento periódico de mini-hojas desde las ramas visibles del árbol
    setInterval(() => {
      if (!livingTreeState.branchTips || livingTreeState.branchTips.length === 0) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Buscar ramas que estén actualmente dentro del viewport o justo arriba
      const visibleTips = livingTreeState.branchTips.filter(tip => {
        const screenY = tip.y - scrollY;
        return screenY >= -80 && screenY <= vh * 0.85;
      });

      if (visibleTips.length > 0 && leaves.length < 55) {
        const chosenTip = visibleTips[Math.floor(Math.random() * visibleTips.length)];
        const screenX = chosenTip.x;
        const screenY = chosenTip.y - scrollY;
        leaves.push(new FloatingLeaf(screenX, screenY, true));
      }
    }, 2200);

    // Reacción aerodinámica del viento ante el scroll del usuario
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

    // Bucle de animación a 60 FPS
    let isRunning = true;
    document.addEventListener('visibilitychange', () => {
      isRunning = !document.hidden;
    });

    function renderLoop() {
      if (isRunning) {
        ctx.clearRect(0, 0, width, height);

        // 1. Actualizar y dibujar esporas botánicas
        for (let i = 0; i < spores.length; i++) {
          spores[i].update();
          spores[i].draw(ctx);
        }

        // 2. Actualizar y dibujar hojas flotantes
        for (let i = leaves.length - 1; i >= 0; i--) {
          const leaf = leaves[i];
          leaf.update();
          leaf.draw(ctx);

          if (!leaf.isAlive) {
            leaves.splice(i, 1);
            // Mantener densidad mínima
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

  // Inicializar Motor de Hojas Flotantes Canvas
  initFloatingLeavesEngine();

  // ===================================================================
  // 19. SANTUARIO DE MARIPOSAS (VUELO NATURAL ORGÁNICO Y EVITACIÓN DE RECUADROS)
  // ===================================================================
  function initButterflySanctuary() {
    const sanctuaryContainer = document.getElementById('butterfly-sanctuary');
    if (!sanctuaryContainer) return;
    sanctuaryContainer.innerHTML = '';

    const butterfliesData = [
      {
        id: 'butterfly-monarch',
        species: 'Monarca',
        baseSpeed: 1.8,
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
        baseSpeed: 1.6,
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
        baseSpeed: 1.9,
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

    // Helper para obtener rectángulos protegidos (tarjetas y textos que las mariposas NUNCA deben tapar)
    function getAvoidanceZones() {
      const selectors = [
        '.command-card',
        '.brigade-card',
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
      const pad = 42; // Margen de seguridad amplio alrededor de cada cuadro

      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          const rect = el.getBoundingClientRect();
          // Solo considerar elementos que intersecten el viewport
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

    // Helper para generar waypoints aleatorios que caigan estrictamente en zonas abiertas
    function getOpenFlightWaypoint(avoidZones) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const zones = avoidZones || getAvoidanceZones();

      for (let attempt = 0; attempt < 30; attempt++) {
        // Preferir márgenes laterales, cielo superior y fondos abiertos
        let candX, candY;
        const sideBias = Math.random();
        if (sideBias < 0.35) {
          // Margen izquierdo abierto
          candX = 40 + Math.random() * Math.min(vw * 0.22, 280);
        } else if (sideBias < 0.70) {
          // Margen derecho abierto
          candX = vw - (40 + Math.random() * Math.min(vw * 0.22, 280));
        } else {
          // Centro o cielo abierto
          candX = 60 + Math.random() * (vw - 120);
        }
        candY = 70 + Math.random() * (vh - 140);

        // Verificar que no caiga dentro de ninguna zona protegida
        const hit = zones.some(z =>
          candX >= z.left && candX <= z.right && candY >= z.top && candY <= z.bottom
        );

        if (!hit) {
          return { x: candX, y: candY };
        }
      }

      // Si el viewport está muy congestionado, colocar en los extremos de los márgenes
      return {
        x: Math.random() < 0.5 ? 50 : vw - 60,
        y: 80 + Math.random() * (vh - 160)
      };
    }

    // Instanciar mariposas con física de vuelo orgánico: Flutter-and-Glide
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
      const winH = window.innerHeight;
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
        mode: 'FLUTTER', // 'FLUTTER' (aleteo con impulso) o 'GLIDE' (planeo suave)
        modeTimer: 60 + Math.floor(Math.random() * 50),
        flutterPhase: Math.random() * Math.PI * 2,
        breezePhase: Math.random() * Math.PI * 2,
        tilt: 0
      };
    });

    // Bucle de animación a 60 FPS con física natural de aleteo y planeo
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

        butterflies.forEach(b => {
          b.flutterPhase += 0.18;
          b.breezePhase += 0.025;
          b.modeTimer--;

          // Alternar entre impulsos de aleteo (flutter) y planeo suave (glide)
          if (b.modeTimer <= 0) {
            if (b.mode === 'FLUTTER') {
              b.mode = 'GLIDE';
              b.modeTimer = 40 + Math.floor(Math.random() * 45); // ~0.7 a 1.4s de planeo
              b.el.classList.add('gliding');
            } else {
              b.mode = 'FLUTTER';
              b.modeTimer = 50 + Math.floor(Math.random() * 60); // ~0.8 a 1.8s de aleteo
              b.el.classList.remove('gliding');
            }
          }

          // Vector de dirección al objetivo libre
          let toTargetX = b.targetX - b.x;
          let toTargetY = b.targetY - b.y;
          let dist = Math.hypot(toTargetX, toTargetY) || 1;

          // Si llegó cerca del waypoint o lleva mucho tiempo, elegir nuevo waypoint libre
          if (dist < 50 || Math.random() < 0.003) {
            const nextPoint = getOpenFlightWaypoint(cachedZones);
            b.targetX = nextPoint.x;
            b.targetY = nextPoint.y;
            toTargetX = b.targetX - b.x;
            toTargetY = b.targetY - b.y;
            dist = Math.hypot(toTargetX, toTargetY) || 1;
          }

          // Fuerza suave de navegación hacia el objetivo
          let steerX = (toTargetX / dist) * 0.12;
          let steerY = (toTargetY / dist) * 0.12;

          // FUERZA REPULSIVA: Desviar de inmediato si se acerca a cualquier cuadro de información
          cachedZones.forEach(z => {
            const nearLeft = b.x >= z.left - 40 && b.x <= z.right + 40;
            const nearTop = b.y >= z.top - 40 && b.y <= z.bottom + 40;
            if (nearLeft && nearTop) {
              const diffX = b.x - z.cx;
              const diffY = b.y - z.cy;
              const dBox = Math.hypot(diffX, diffY) || 1;
              const push = Math.max(0.4, 2.5 - dBox * 0.015);
              steerX += (diffX / dBox) * push;
              steerY += (diffY / dBox) * push;
            }
          });

          // Física de vuelo según modo
          if (b.mode === 'FLUTTER') {
            // Impulso de alas: zig-zag lateral y pequeña sustentación hacia arriba
            const liftImpulse = -Math.sin(b.flutterPhase) * 0.35;
            const sideSway = Math.cos(b.flutterPhase * 1.4) * 0.40;
            b.vx += steerX + sideSway * 0.25;
            b.vy += steerY + liftImpulse;
          } else {
            // Modo Planeo: desaceleración suave, deriva con la brisa y leve caída parabólica
            const breeze = Math.sin(b.breezePhase) * 0.18;
            b.vx = b.vx * 0.965 + steerX * 0.6 + breeze;
            b.vy = b.vy * 0.965 + steerY * 0.6 + 0.12; // Leve gravedad de planeo
          }

          // Limitar velocidad máxima para vuelo sereno y natural
          const maxSpd = b.mode === 'FLUTTER' ? b.baseSpeed * 1.3 : b.baseSpeed * 0.9;
          const currentSpd = Math.hypot(b.vx, b.vy);
          if (currentSpd > maxSpd) {
            b.vx = (b.vx / currentSpd) * maxSpd;
            b.vy = (b.vy / currentSpd) * maxSpd;
          }

          // Actualizar posición
          b.x += b.vx;
          b.y += b.vy;

          // Mantener dentro de los bordes visibles del viewport con rebote suave
          if (b.x < 25) { b.x = 25; b.vx = Math.abs(b.vx) * 0.8; }
          if (b.x > vw - 50) { b.x = vw - 50; b.vx = -Math.abs(b.vx) * 0.8; }
          if (b.y < 45) { b.y = 45; b.vy = Math.abs(b.vy) * 0.8; }
          if (b.y > vh - 60) { b.y = vh - 60; b.vy = -Math.abs(b.vy) * 0.8; }

          // Orientación realista del cuerpo (sigue el vector de movimiento)
          const motionHeading = Math.atan2(b.vy, b.vx) * (180 / Math.PI) + 90;
          let angleDiff = motionHeading - b.currentAngle;
          while (angleDiff < -180) angleDiff += 360;
          while (angleDiff > 180) angleDiff -= 360;
          b.currentAngle += angleDiff * 0.10;

          // Inclinación 3D (banking) en curvas
          b.tilt = Math.max(-25, Math.min(25, angleDiff * 0.8));

          // Escala con micro-profundidad
          const depthScale = 0.92 + Math.sin(b.flutterPhase * 0.5) * 0.08;

          b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${b.currentAngle.toFixed(1)}deg) rotateY(${b.tilt.toFixed(1)}deg) scale(${depthScale.toFixed(2)})`;
        });
      }

      requestAnimationFrame(butterflyLoop);
    }

    requestAnimationFrame(butterflyLoop);

    // Al hacer scroll, recalcular zonas protegidas y reajustar metas
    window.addEventListener('scroll', () => {
      cachedZones = getAvoidanceZones();
      butterflies.forEach(b => {
        // Si el scroll pone a la mariposa sobre una tarjeta, empujarla suavemente hacia fuera
        cachedZones.forEach(z => {
          if (b.x >= z.left && b.x <= z.right && b.y >= z.top && b.y <= z.bottom) {
            b.targetX = b.x < z.cx ? z.left - 50 : z.right + 50;
            b.targetY = b.y < z.cy ? z.top - 50 : z.bottom + 50;
          }
        });
      });
    }, { passive: true });
  }

  // Inicializar Santuario de Mariposas
  initButterflySanctuary();

});

