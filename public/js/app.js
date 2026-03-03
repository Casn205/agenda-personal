// ─────────────────────────────────────────
// app.js — Punto de entrada: estado global y coordinación
// ─────────────────────────────────────────

// ─── Estado global de la aplicación ───
let appointments = [];   // Todas las citas cargadas desde la API
let activeId     = null; // ID de la cita actualmente seleccionada

// ─── Arranque ───
updateClock();
setInterval(updateClock, 60_000);
loadAppointments();

// Mover modales directamente al <body> para que escapen
// cualquier overflow:hidden o stacking context del layout
document.body.appendChild(document.getElementById('editModal'));
document.body.appendChild(document.getElementById('deleteModal'));

// ─── Eventos globales ───
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

document.getElementById('newAppointmentForm')
  .addEventListener('submit', handleSubmit);

document.getElementById('editForm')
  .addEventListener('submit', handleEditSubmit);

document.getElementById('searchInput')
  .addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const filtered = appointments.filter(a =>
      a.title.toLowerCase().includes(query) ||
      (a.description && a.description.toLowerCase().includes(query))
    );
    renderList(filtered, appointments, activeId);
  });

// ─── Carga inicial ───
async function loadAppointments() {
  try {
    appointments = await getAllAppointments();
    renderList(appointments, appointments, activeId);
  } catch {
    renderConnectionError();
  }
}

// ─── Seleccionar y mostrar detalle de una cita ───
async function selectAppointment(id) {
  activeId = id;

  // Reutiliza el filtro de búsqueda activo si lo hay
  const query = document.getElementById('searchInput').value.toLowerCase();
  const visible = query
    ? appointments.filter(a => a.title.toLowerCase().includes(query))
    : appointments;

  renderList(visible, appointments, activeId);
  switchTab('detail');

  try {
    const apt = await getAppointmentById(id);
    showDetail(apt);
  } catch {
    toast('Error al cargar el detalle', 'error');
  }
}

// ─── Cambiar pestaña activa ───
function switchTab(name) {
  document.querySelectorAll('.tab')
    .forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-pane')
    .forEach(p => p.classList.toggle('active', p.id === `tab-${name}`));
}