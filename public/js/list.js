// ─────────────────────────────────────────
// list.js — Renderizado del panel de citas
// ─────────────────────────────────────────

/**
 * Renderiza la lista de citas en el panel izquierdo.
 * Actualiza el contador y ordena por fecha de inicio.
 *
 * @param {Array}  list      - Citas a mostrar (puede ser un subconjunto filtrado)
 * @param {Array}  allItems  - Todas las citas (para el contador total)
 * @param {string} activeId  - ID de la cita actualmente seleccionada
 */
function renderList(list, allItems, activeId) {
  const container = document.getElementById('appointmentsList');
  document.getElementById('countBadge').textContent = allItems.length;

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <p>No hay citas para mostrar.<br/>Crea una nueva desde la pestaña.</p>
      </div>`;
    return;
  }

  const sorted = [...list].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  container.innerHTML = sorted.map((apt, i) => {
    const start  = new Date(apt.start_time);
    const end    = new Date(apt.end_time);
    const now    = new Date();
    const isNow  = now >= start && now <= end;
    const isPast = now > end;

    const statusBadge = isNow
      ? `<span class="apt-status"><span class="dot"></span>En curso</span>`
      : isPast
        ? `<span class="apt-status past"><span class="dot"></span>Pasada</span>`
        : '';

    return `
      <div class="apt-item ${apt.id === activeId ? 'active' : ''}"
           data-id="${apt.id}"
           style="animation-delay:${i * 40}ms"
           onclick="selectAppointment('${apt.id}')">
        <div class="apt-title">${escHtml(apt.title)}</div>
        <div class="apt-time">
          <span>${formatTime(start)}</span>
          <span class="apt-time-sep">→</span>
          <span>${formatTime(end)}</span>
        </div>
        ${apt.description ? `<div class="apt-desc">${escHtml(apt.description)}</div>` : ''}
        ${statusBadge}
      </div>`;
  }).join('');
}

/**
 * Muestra un mensaje de error de conexión en el panel de lista.
 */
function renderConnectionError() {
  document.getElementById('appointmentsList').innerHTML = `
    <div class="empty-state">
      <div class="icon">⚠️</div>
      <p>No se pudo conectar al servidor.<br/>
         Asegúrate de que el backend esté corriendo<br/>
         en <strong>localhost:3000</strong></p>
    </div>`;
}