const Appointment = require('../models/appointment.model');

function create(req, res) {
  const { title, start_time, end_time, description } = req.body;

  if (!title || !start_time || !end_time) {
    return res.status(400).json({
      error: 'title, start_time y end_time son obligatorios'
    });
  }

  const start = new Date(start_time);
  const end = new Date(end_time);

  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({
      error: 'Formato de fecha inválido (ISO 8601)'
    });
  }

  if (start >= end) {
    return res.status(400).json({
      error: 'La hora de inicio debe ser menor que la de fin'
    });
  }

  Appointment.createAppointment(
    { title, start_time, end_time, description },
    (err, appointment) => {
      if (err) {
        if (err.message === 'OVERLAP') {
          return res.status(409).json({
            error: 'La cita se cruza con otra existente'
          });
        }

        return res.status(500).json({ error: 'Error al crear la cita' });
      }

      res.status(201).json(appointment);
    }
  );
}

function getAll(req, res) {
  Appointment.getAllAppointments((err, appointments) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar las citas' });
    }

    res.json(appointments);
  });
}

function getById(req, res) {
  const { id } = req.params;

  Appointment.getAppointmentById(id, (err, appointment) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la cita' });
    }

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.json(appointment);
  });
}

module.exports = {
  create,
  getAll,
  getById
};