/**
 * MÓDULO COUNTDOWN — RESCATANDO CHOPOS
 * Temporizador de cuenta regresiva sincronizado para la próxima jornada del Parque Central.
 */

export function initCountdown() {
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
}
