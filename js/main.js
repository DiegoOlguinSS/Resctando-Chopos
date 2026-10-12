/**
 * PUNTO DE ENTRADA PRINCIPAL (ORQUESTADOR) — RESCATANDO CHOPOS
 * Arquitectura modular con ES Modules estándar.
 * Conecta e inicializa de manera coordinada todos los subsistemas de la aplicación.
 */

import { initUI } from './modules/ui.js';
import { initModal } from './modules/modal.js';
import { initCountdown } from './modules/countdown.js';
import { initLightbox } from './modules/lightbox.js';
import { initFilters } from './modules/filters.js';
import { initLivingTreeSystem } from './modules/tree.js';
import { initFloatingLeavesEngine } from './modules/particles.js';
import { initButterflySanctuary } from './modules/butterflies.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interfaz de usuario, navegación, contadores y notificaciones
  initUI();

  // 2. Modales y formularios de registro ciudadano en LocalStorage
  initModal();

  // 3. Temporizador de cuenta regresiva para la próxima brigada
  initCountdown();

  // 4. Visor fotográfico en alta resolución (Lightbox)
  initLightbox();

  // 5. Filtros interactivos de fichas de biodiversidad
  initFilters();

  // 6. Sistema botánico procedural del Árbol Vivo
  initLivingTreeSystem();

  // 7. Motor Canvas interactivo de hojas 3D y esporas botánicas
  initFloatingLeavesEngine();

  // 8. Santuario interactivo de mariposas
  initButterflySanctuary();
});

// Reconstruir árbol procedural al cargar imágenes por completo
window.addEventListener('load', () => {
  initLivingTreeSystem();
});

// Reconstruir con debounce suave ante cambios de resolución
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initLivingTreeSystem();
  }, 280);
}, { passive: true });
