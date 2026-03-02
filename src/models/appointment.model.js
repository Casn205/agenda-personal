const db = require('./db');
const { v4: uuidv4 } = require('uuid');

function hasOverlap(start, end, excludeId, callback) {
  const query = `
    SELECT COUNT(*) as count
    FROM appointments
    WHERE
      start_time < ?
      AND end_time > ?
      AND id != ?
  `;

  db.get(query, [end, start, excludeId], (err, row) => {
    if (err) callback(err);
    else callback(null, row.count > 0);
  });
}

function createAppointment(data, callback) {
  const { title, start_time, end_time, description } = data;
  const id = uuidv4();

  hasOverlap(start_time, end_time, '', (err, overlap) => {
    if (err) return callback(err);
    if (overlap) return callback(new Error('OVERLAP'));

    const query = `
      INSERT INTO appointments (id, title, start_time, end_time, description)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [id, title, start_time, end_time, description], err => {
      if (err) callback(err);
      else callback(null, { id, title, start_time, end_time, description });
    });
  });
}

function updateAppointment(id, data, callback) {
  const { title, start_time, end_time, description } = data;

  getAppointmentById(id, (err, existing) => {
    if (err) return callback(err);
    if (!existing) return callback(new Error('NOT_FOUND'));

    hasOverlap(start_time, end_time, id, (err, overlap) => {
      if (err) return callback(err);
      if (overlap) return callback(new Error('OVERLAP'));

      const query = `
        UPDATE appointments
        SET title = ?, start_time = ?, end_time = ?, description = ?
        WHERE id = ?
      `;

      db.run(
        query,
        [title, start_time, end_time, description, id],
        function (err) {
          if (err) callback(err);
          else callback(null, { id, title, start_time, end_time, description });
        }
      );
    });
  });
}

function deleteAppointment(id, callback) {
  db.run(
    `DELETE FROM appointments WHERE id = ?`,
    [id],
    function (err) {
      if (err) return callback(err);
      if (this.changes === 0) {
        return callback(new Error('NOT_FOUND'));
      }
      callback(null, true);
    }
  );
}

function getAllAppointments(callback) {
  db.all(`SELECT * FROM appointments ORDER BY start_time ASC`, [], callback);
}

function getAppointmentById(id, callback) {
  db.get(`SELECT * FROM appointments WHERE id = ?`, [id], callback);
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};