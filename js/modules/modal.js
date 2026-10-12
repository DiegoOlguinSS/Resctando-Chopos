/**
 * MÓDULO MODAL & FORMULARIOS — RESCATANDO CHOPOS
 * Ventana modal de voluntariado, registro ciudadano, buzón vecinal y persistencia en LocalStorage.
 */

import { showToast } from './ui.js';

export function initModal() {
  const modal = document.getElementById('volunteer-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const volunteerForm = document.getElementById('volunteer-form');

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

  // Manejo de formulario de registro de voluntarios
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
      showToast(`¡Gracias ${name}! Registro confirmado para la brigada del Parque Central.`);
    });
  }

  // Manejo de buzón ciudadano y reporte vecinal
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
}
