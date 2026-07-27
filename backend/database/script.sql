-- Crear tabla de roles
CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

INSERT INTO roles(nombre) VALUES ('ADMIN'), ('USUARIO');

CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    id_rol INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_rol FOREIGN KEY(id_rol) REFERENCES roles(id)
);

CREATE TABLE categorias(
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

INSERT INTO categorias(nombre) VALUES
('Documentos'), ('Ropa'), ('Accesorios'), ('Otros');

CREATE TABLE objetos(
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT NOT NULL DEFAULT 'perdido',
    ubicacion TEXT,
    imagen TEXT,
    id_categoria INTEGER,
    id_usuario INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lugar_entrega TEXT,
    CONSTRAINT fk_categoria FOREIGN KEY(id_categoria) REFERENCES categorias(id),
    CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE comentarios(
    id SERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    id_objeto INTEGER,
    id_usuario INTEGER,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_objeto FOREIGN KEY(id_objeto) REFERENCES objetos(id),
    CONSTRAINT fk_usuario_com FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE mensajes(
    id SERIAL PRIMARY KEY,
    id_remitente INTEGER NOT NULL,
    id_destinatario INTEGER NOT NULL,
    id_objeto INTEGER,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_remitente FOREIGN KEY(id_remitente) REFERENCES usuarios(id),
    CONSTRAINT fk_destinatario FOREIGN KEY(id_destinatario) REFERENCES usuarios(id),
    CONSTRAINT fk_objeto_mensaje FOREIGN KEY(id_objeto) REFERENCES objetos(id)
);

CREATE TABLE notificaciones(
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    id_objeto INTEGER,
    id_remitente INTEGER,
    leido BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_notif FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
);
