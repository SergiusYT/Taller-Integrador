const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Chechito007yt%',
  database: 'taller_finanzas'
});

function detectarFranquicia(numero) {
  if (/^5[1-5]/.test(numero) && numero.length === 16) return 'MASTERCARD';
  if (/^4/.test(numero) && numero.length === 16) return 'VISA';
  if (/^3[47]/.test(numero) && numero.length === 15) return 'AMEX';
  return 'DESCONOCIDA';
}

app.post('/tarjetas', (req, res) => {
  const { n_identificacion, numero_tarjeta, fecha_vencimiento, cupo_total, cupo_disponible } = req.body;

  // Validaciones básicas
  if (!/^\d{15,16}$/.test(numero_tarjeta)) {
    return res.status(400).json({ mensaje: '❌ El número de tarjeta debe tener 15 o 16 dígitos.' });
  }

  if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(fecha_vencimiento)) {
    return res.status(400).json({ mensaje: '❌ Formato de fecha inválido. Debe ser MM/YYYY.' });
  }

  const franquicia = detectarFranquicia(numero_tarjeta);
  if (franquicia === 'DESCONOCIDA') {
    return res.status(400).json({ mensaje: '❌ La franquicia no es válida según el número ingresado.' });
  }

  const cupo_utilizado = parseFloat((cupo_total - cupo_disponible).toFixed(2));
  if (cupo_utilizado < 0 || cupo_total < 0 || cupo_disponible < 0) {
    return res.status(400).json({ mensaje: '❌ Valores de cupo inconsistentes o negativos.' });
  }

  // Buscar ID del cliente a partir del número de identificación
  conn.query(
    'SELECT id_cliente FROM clientes WHERE n_identificacion = ?',
    [n_identificacion],
    (err, results) => {
      if (err) return res.status(500).json({ mensaje: '❌ Error al buscar el cliente.' });
      if (results.length === 0) {
        return res.status(400).json({ mensaje: '❌ No se encontró un cliente con ese número de identificación.' });
      }

      const id_cliente = results[0].id_cliente;

      // Validar unicidad de número de tarjeta
      conn.query(
        'SELECT * FROM tarjetas WHERE numero_tarjeta = ?',
        [numero_tarjeta],
        (err2, results2) => {
          if (err2) return res.status(500).json({ mensaje: '❌ Error al verificar número de tarjeta.' });
          if (results2.length > 0) {
            return res.status(400).json({ mensaje: '❌ Este número de tarjeta ya existe.' });
          }

          // Insertar tarjeta
          conn.query(
            'INSERT INTO tarjetas (id_cliente, numero_tarjeta, fecha_vencimiento, franquicia, estado, cupo_total, cupo_disponible, cupo_utilizado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id_cliente, numero_tarjeta, fecha_vencimiento, franquicia, 'ACTIVO', cupo_total, cupo_disponible, cupo_utilizado],
            (err3) => {
              if (err3) return res.status(500).json({ mensaje: '❌ Error al registrar la tarjeta.' });
              res.status(201).json({ mensaje: '✅ Tarjeta registrada exitosamente.' });
            }
          );
        }
      );
    }
  );
});

app.listen(3000, () => {
  console.log('✅ Servidor en http://localhost:3000');
});
