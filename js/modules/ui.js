/**
 * MÓDULO UI — RESCATANDO CHOPOS
 * Navegación, scrollspy, efectos de encabezado, animaciones reveal, contadores,
 * acordeón FAQ, portapapeles y notificaciones toast.
 */

const toast = document.getElementById('toast-notice');
const toastText = document.getElementById('toast-text');

export function showToast(message) {
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

export function initUI() {
  // 1. Efecto Scroll en Navbar y Scroll directo con parámetro
  const navbar = document.getElementById('navbar');
  const checkScroll = () => {
    if (!navbar) return;
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

  // 2. Menú de navegación móvil
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('.nav-item-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. Animaciones Fade-In-Up (IntersectionObserver)
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

  // 4. Contadores numéricos animados
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

  // 5. Acordeón de preguntas frecuentes (FAQ)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!wasActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 6. Resaltar enlace de navegación según scroll (Scrollspy)
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

  // 7. Acciones de copiado al portapapeles
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

  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = 'Autopista Querétaro-México 34, Arcos del Alba, Cuautitlán Izcalli, México';
      navigator.clipboard.writeText(address).then(() => {
        showToast('Dirección copiada al portapapeles: ' + address);
      });
    });
  }

  const copyEmailContactBtn = document.getElementById('copy-email-contact-btn');
  if (copyEmailContactBtn) {
    copyEmailContactBtn.addEventListener('click', () => {
      const email = 'rescatandochopos@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Correo copiado al portapapeles: ' + email);
      }).catch(() => {
        window.location.href = 'mailto:' + email;
      });
    });
  }
}
