// ─────────────────────────────────────────
// detail.js — Vista de detalle, edición y eliminación de citas
// ─────────────────────────────────────────

/**
 * Muestra los datos completos de una cita con botones de editar y eliminar.
 * @param {Object} apt - Objeto cita desde la API
 */
function showDetail(apt) {
  document.getElementById('detailPlaceholder').style.display = 'none';

  const card  = document.getElementById('detailCard');
  const start = new Date(apt.start_time);
  const end   = new Date(apt.end_time);
  const dur   = formatDuration(start, end);

  card.style.display = 'block';
  card.innerHTML = `
    <div class="dc-label">Cita seleccionada</div>
    <div class="dc-title">${escHtml(apt.title)}</div>
    <div class="dc-id">ID: ${apt.id}</div>

    <div class="duration-tag">⏱ Duración: ${dur}</div>

    <div class="info-row">
      <div class="info-block">
        <div class="ib-label">Inicio</div>
        <div class="ib-value accent">${formatDateTime(start)}</div>
      </div>
      <div class="info-block">
        <div class="ib-label">Fin</div>
        <div class="ib-value accent">${formatDateTime(end)}</div>
      </div>
    </div>

    ${apt.description ? `
      <div class="desc-block">
        <div class="ib-label">Descripción</div>
        <p>${escHtml(apt.description)}</p>
      </div>` : ''}

    <div class="detail-actions">
      <button class="btn-edit" onclick="openEditModal('${apt.id}')">✏️ Editar</button>
      <button class="btn-delete" onclick="confirmDelete('${apt.id}', '${escHtml(apt.title)}')">🗑 Eliminar</button>
    </div>
  `;
}

/**
 * Vuelve al estado placeholder (sin cita seleccionada).
 */
function clearDetail() {
  document.getElementById('detailPlaceholder').style.display = 'flex';
  document.getElementById('detailCard').style.display = 'none';
}

// ─── MODAL DE EDICIÓN ────────────────────────────────────────

/**
 * Abre el modal de edición precargando los datos actuales de la cita.
 * @param {string} id
 */
async function openEditModal(id) {
  try {
    const apt = await getAppointmentById(id);

    // Formatear fechas al formato requerido por datetime-local (YYYY-MM-DDTHH:MM)
    const toLocal = iso => {
      const d = new Date(iso);
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    document.getElementById('edit_id').value          = apt.id;
    document.getElementById('edit_title').value       = apt.title;
    document.getElementById('edit_start').value       = toLocal(apt.start_time);
    document.getElementById('edit_end').value         = toLocal(apt.end_time);
    document.getElementById('edit_description').value = apt.description || '';

    document.getElementById('editModal').classList.add('open');
  } catch {
    toast('No se pudo cargar la cita para editar', 'error');
  }
}

/** Cierra el modal de edición. */
function closeEditModal() {
  document.getElementById('editModal').classList.remove('open');
}

/**
 * Guarda los cambios del formulario de edición.
 * @param {Event} e
 */
async function handleEditSubmit(e) {
  e.preventDefault();

  const id          = document.getElementById('edit_id').value;
  const title       = document.getElementById('edit_title').value.trim();
  const start_time  = document.getElementById('edit_start').value;
  const end_time    = document.getElementById('edit_end').value;
  const description = document.getElementById('edit_description').value.trim();

  if (!title || !start_time || !end_time) {
    toast('Completa todos los campos obligatorios', 'error'); return;
  }
  if (new Date(start_time) >= new Date(end_time)) {
    toast('La hora de inicio debe ser anterior al fin', 'error'); return;
  }

  const btn   = document.getElementById('editSubmitBtn');
  const label = document.getElementById('editSubmitText');
  btn.disabled    = true;
  label.innerHTML = '<span class="spinner"></span> Guardando...';

  try {
    const updated = await updateAppointment(id, {
      title,
      start_time:  new Date(start_time).toISOString(),
      end_time:    new Date(end_time).toISOString(),
      description: description || undefined,
    });

    // Actualizar en memoria
    const idx = appointments.findIndex(a => a.id === id);
    if (idx !== -1) appointments[idx] = updated;

    renderList(appointments, appointments, activeId);
    closeEditModal();
    showDetail(updated);
    toast('Cita actualizada correctamente', 'success');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    btn.disabled      = false;
    label.textContent = 'Guardar cambios';
  }
}

// ─── MODAL DE CONFIRMACIÓN DE BORRADO ────────────────────────

/**
 * Abre el modal de confirmación antes de eliminar.
 * @param {string} id
 * @param {string} title
 */
function confirmDelete(id, title) {
  document.getElementById('deleteModalTitle').textContent = title;
  document.getElementById('confirmDeleteBtn').onclick = () => executeDelete(id);
  document.getElementById('deleteModal').classList.add('open');
}

/** Cierra el modal de confirmación. */
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('open');
}

/**
 * Ejecuta el DELETE en la API y actualiza la UI.
 * @param {string} id
 */
async function executeDelete(id) {
  const btn = document.getElementById('confirmDeleteBtn');
  btn.disabled    = true;
  btn.textContent = 'Eliminando...';

  try {
    await deleteAppointment(id);

    appointments = appointments.filter(a => a.id !== id);
    activeId     = null;

    renderList(appointments, appointments, activeId);
    clearDetail();
    closeDeleteModal();
    toast('Cita eliminada correctamente', 'success');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Sí, eliminar';
  }
}