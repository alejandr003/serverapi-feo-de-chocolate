-- Crear tabla luces si no existe
CREATE TABLE IF NOT EXISTS luces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ubicacion VARCHAR(100) NOT NULL,
  estatus TINYINT NOT NULL DEFAULT 0
);

-- Crear tabla puertas si no existe
CREATE TABLE IF NOT EXISTS puertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ubicacion VARCHAR(100) NOT NULL,
  estatus TINYINT NOT NULL DEFAULT 0
);

-- Mostrar estructura de las tablas
DESCRIBE luces;
DESCRIBE puertas;
