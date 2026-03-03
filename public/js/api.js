// ─────────────────────────────────────────
// api.js — Comunicación con el backend Express
// ─────────────────────────────────────────

const API_BASE = 'http://localhost:3000/appointments';

/**
 * Obtiene todas las citas del servidor.
 * @returns {Promise<Array>} Lista de citas
 */
async function getAllAppointments() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Error al cargar las citas');
  return res.json();
}

/**
 * Obtiene una cita por su ID.
 * @param {string} id
 * @returns {Promise<Object>} Cita encontrada
 */
async function getAppointmentById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Cita no encontrada');
  return res.json();
}

/**
 * Crea una nueva cita en el servidor.
 * @param {{ title: string, start_time: string, end_time: string, description?: string }} data
 * @returns {Promise<Object>} Cita creada
 */
async function createAppointment(data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al crear la cita');
  return json;
}

/**
 * Actualiza una cita existente (PUT /:id).
 * @param {string} id
 * @param {{ title: string, start_time: string, end_time: string, description?: string }} data
 * @returns {Promise<Object>} Cita actualizada
 */
async function updateAppointment(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al actualizar la cita');
  return json;
}

/**
 * Elimina una cita por su ID (DELETE /:id).
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteAppointment(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al eliminar la cita');
}