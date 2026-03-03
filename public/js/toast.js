// ─────────────────────────────────────────
// toast.js — Notificaciones temporales (éxito / error)
// ─────────────────────────────────────────

/**
 * Muestra una notificación flotante que desaparece automáticamente.
 * @param {string} msg   - Texto a mostrar
 * @param {'success'|'error'} type - Tipo de notificación
 * @param {number} duration - Milisegundos antes de desaparecer (default: 3500)
 */
function toast(msg, type = 'success', duration = 3500) {
  const container = document.getElementById('toastContainer');
  const el        = document.createElement('div');

  el.className  = `toast ${type}`;
  el.innerHTML  = `
    <span class="toast-icon">${type === 'success' ? '✓' : '✗'}</span>
    <span>${msg}</span>
  `;

  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}