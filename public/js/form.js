// ─────────────────────────────────────────
// form.js — Formulario para crear nuevas citas
// ─────────────────────────────────────────

/**
 * Maneja el submit del formulario de nueva cita.
 * Valida los campos, llama a la API y actualiza la UI.
 *
 * @param {Event} e - Evento submit del formulario
 */
async function handleSubmit(e) {
  e.preventDefault();

  const btn   = document.getElementById('submitBtn');
  const label = document.getElementById('submitText');

  // Leer valores del formulario
  const title       = document.getElementById('f_title').value.trim();
  const start_time  = document.getElementById('f_start').value;
  const end_time    = document.getElementById('f_end').value;
  const description = document.getElementById('f_desc').value.trim();

  // ─── Validaciones del lado cliente ───
  if (!title || !start_time || !end_time) {
    toast('Por favor completa los campos obligatorios', 'error');
    return;
  }

  if (new Date(start_time) >= new Date(end_time)) {
    toast('La hora de inicio debe ser anterior al fin', 'error');
    return;
  }

  // ─── Estado de carga ───
  btn.disabled   = true;
  label.innerHTML = '<span class="spinner"></span> Guardando...';

  try {
    const apt = await createAppointment({
      title,
      start_time:  new Date(start_time).toISOString(),
      end_time:    new Date(end_time).toISOString(),
      description: description || undefined,
    });

    // Agregar a la lista en memoria y refrescar UI
    appointments.push(apt);
    renderList(appointments, appointments, activeId);
    e.target.reset();

    toast('Cita creada exitosamente', 'success');
    selectAppointment(apt.id);

  } catch (err) {
    toast(err.message, 'error');
  } finally {
    btn.disabled    = false;
    label.textContent = 'Guardar Cita';
  }
}