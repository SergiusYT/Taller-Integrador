const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Chechito007yt%', // Cambia según config
  database: 'taller_finanzas'
});

app.post('/clientes', (req, res) => {
  const { n_identificacion, nombre, apellido, correo } = req.body;

  conn.query(
    'SELECT * FROM clientes WHERE n_identificacion = ? OR correo = ?',
    [n_identificacion, correo],
    (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ mensaje: 'Identificación o correo ya registrado' });
      }

      conn.query(
        'INSERT INTO clientes (n_identificacion, nombre, apellido, correo) VALUES (?, ?, ?, ?)',
        [n_identificacion, nombre, apellido, correo],
        (err2) => {
          if (err2) return res.status(500).json({ mensaje: 'Error al registrar cliente' });
          res.status(201).json({ mensaje: 'Cliente registrado exitosamente' });
        }
      );
    }
  );
});

module.exports = app; // Exporta la app SIN arrancar el servidor

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});


module.exports = app;