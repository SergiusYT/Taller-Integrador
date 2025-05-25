CREATE DATABASE IF NOT EXISTS taller_finanzas;
USE taller_finanzas;

CREATE TABLE clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  n_identificacion VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE tarjetas (
  id_tarjeta INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  numero_tarjeta VARCHAR(20) UNIQUE NOT NULL,
  fecha_vencimiento VARCHAR(7) NOT NULL,
  franquicia VARCHAR(20) NOT NULL,
  estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  cupo_total DECIMAL(10,2) NOT NULL,
  cupo_disponible DECIMAL(10,2) NOT NULL,
  cupo_utilizado DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);
