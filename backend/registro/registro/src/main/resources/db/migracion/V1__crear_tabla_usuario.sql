-- Crea la tabla de usuarios para el registro y autenticación
CREATE TABLE usuario (
    id BIGINT NOT NULL AUTO_INCREMENT,               -- Identificador único generado por MySQL
    nombre_completo VARCHAR(150) NOT NULL,           -- Nombre completo del usuario
    correo VARCHAR(150) NOT NULL UNIQUE,             -- Correo electrónico único
    contrasena VARCHAR(255) NOT NULL,                -- Contraseña (idealmente hash)
    fecha_creacion DATETIME(6) NOT NULL,             -- Fecha y hora de registro
    PRIMARY KEY (id)                                 -- Clave primaria
);