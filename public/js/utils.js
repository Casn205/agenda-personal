// ─────────────────────────────────────────
// utils.js — Funciones de apoyo reutilizables
// ─────────────────────────────────────────

/**
 * Escapa caracteres HTML para prevenir XSS.
 * @param {string} s
 * @returns {string}
 */
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Formatea una fecha mostrando solo la hora (HH:MM).
 * @param {Date} d
 * @returns {string}
 */
function formatTime(d) {
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formatea una fecha completa: día, mes, año y hora.
 * @param {Date} d
 * @returns {string}
 */
function formatDateTime(d) {
  return d.toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Calcula la duración entre dos fechas y la devuelve en texto legible.
 * @param {Date} start
 * @param {Date} end
 * @returns {string} Ej: "1h 30m" o "45m"
 */
function formatDuration(start, end) {
  const diffMin = Math.round((end - start) / 60000);
  if (diffMin >= 60) {
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return `${diffMin}m`;
}

/**
 * Actualiza el reloj del header con el día y fecha actuales.
 */
function updateClock() {
  const now    = new Date();
  const days   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  document.getElementById('currentDay').textContent  = days[now.getDay()];
  document.getElementById('currentDate').textContent =
    `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}