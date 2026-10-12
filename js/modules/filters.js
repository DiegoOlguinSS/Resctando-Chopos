/**
 * MÓDULO FILTROS DE BIODIVERSIDAD — RESCATANDO CHOPOS
 * Filtrado dinámico de especies botánicas, fauna y suelo del Parque Central.
 */

export function initFilters() {
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
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 30);
            setTimeout(() => {
              card.style.opacity = '';
              card.style.transform = '';
              card.style.transition = '';
            }, 400);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}
