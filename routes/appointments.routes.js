const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointments.controller');

// Crear cita
router.post('/', controller.create);

// Consultar todas las citas
router.get('/', controller.getAll);

// Consultar cita por ID
router.get('/:id', controller.getById);

// Actualizar cita
router.put('/:id', controller.update);

// Eliminar cita
router.delete('/:id', controller.remove);

module.exports = router;