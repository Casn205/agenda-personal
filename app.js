const express = require('express');
const path = require('path');


const app = express();

// Middlewares
app.use(express.json());
const appointmentRoutes = require('./routes/appointments.routes');
app.use('/appointments', appointmentRoutes);
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Agenda Personal API funcionando' });
});

module.exports = app;