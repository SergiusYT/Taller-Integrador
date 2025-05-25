const request = require('supertest');
const app = require('../backend/index'); // Asegúrate que la ruta sea correcta

describe('POST /clientes', () => {
  it('debería rechazar cliente duplicado', async () => {
    const nuevoCliente = {
      n_identificacion: '12345678',
      nombre: 'Carlos',
      apellido: 'Pérez',
      correo: 'carlos@example.com'
    };

    // Inserta el cliente por primera vez
    await request(app).post('/clientes').send(nuevoCliente);

    // Intenta insertar de nuevo (debe fallar)
    const res = await request(app).post('/clientes').send(nuevoCliente);
    expect(res.statusCode).toBe(400);
    expect(res.body.mensaje).toMatch(/ya registrado/i);
  });
});
