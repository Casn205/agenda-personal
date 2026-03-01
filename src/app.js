const express = require('express');

const app = express();

// Middlewares
app.use(express.json());
const appointmentRoutes = require('./routes/appointments.routes');

app.use('/appointments', appointmentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Agenda Personal API funcionando' });
});

module.exports = app;