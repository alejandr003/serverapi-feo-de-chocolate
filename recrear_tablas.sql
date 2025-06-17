-- Verificación y corrección de tablas

-- Eliminar tablas si existen (solo si es necesario recrearlas)
DROP TABLE IF EXISTS luces;
DROP TABLE IF EXISTS puertas;

-- Crear tabla luces con la estructura correcta
CREATE TABLE luces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ubicacion VARCHAR(100) NOT NULL,
  estatus TINYINT NOT NULL DEFAULT 0
);

-- Crear tabla puertas con la estructura correcta
CREATE TABLE puertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ubicacion VARCHAR(100) NOT NULL,
  estatus TINYINT NOT NULL DEFAULT 0
);

-- Mostrar las tablas creadas
SHOW TABLES;

-- Mostrar la estructura de las tablas
DESCRIBE luces;
DESCRIBE puertas;
