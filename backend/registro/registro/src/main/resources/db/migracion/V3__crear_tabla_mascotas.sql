CREATE TABLE IF NOT EXISTS mascota (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255) NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS solicitud_adopcion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_solicitud VARCHAR(30) NOT NULL UNIQUE,
    usuario_correo VARCHAR(150) NOT NULL,
    total_gestion INT NOT NULL DEFAULT 0,
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solicitud_adopcion_mascota (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id BIGINT NOT NULL,
    mascota_id BIGINT,
    nombre_mascota VARCHAR(100) NOT NULL,
    especie_descripcion VARCHAR(255) NOT NULL,
    precio_gestion INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_solicitud_mascota_solicitud
        FOREIGN KEY (solicitud_id) REFERENCES solicitud_adopcion(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_solicitud_mascota_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascota(id)
        ON DELETE SET NULL
);

INSERT INTO mascota (titulo, descripcion, precio, imagen, disponible) VALUES
    ('golden', 'perro amigable', 20000, '/img/golde.jpg', TRUE),
    ('aleman', 'perro guardian', 24000, '/img/aleman.jpg', TRUE),
    ('American Shorthair', 'gato pequeño', 19000, '/img/American Shorthair.jpg', TRUE),
    ('pug', 'perro lindo', 18000, '/img/pug.jpg', TRUE),
    ('ragdoll', 'gato peludo', 24000, '/img/ragdoll.jpg', TRUE);