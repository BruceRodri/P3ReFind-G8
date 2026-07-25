-- Crear tabla de roles
CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

-- Insertar roles base
INSERT INTO roles(nombre) VALUES ('ADMIN'), ('USUARIO');

-- Crear tabla de usuarios (eliminación lógica con columna 'activo')
CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    id_rol INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_rol FOREIGN KEY(id_rol) REFERENCES roles(id)
);

-- Crear tabla de categorías
CREATE TABLE categorias(
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

-- Insertar categorías base
INSERT INTO categorias(nombre) VALUES 
('Documentos'), ('Ropa'), ('Accesorios'), ('Otros');

-- Crear tabla de objetos (perdidos/encontrados)
CREATE TABLE objetos(
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    ubicacion TEXT,
    imagen TEXT,
    id_categoria INTEGER,
    id_usuario INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categoria FOREIGN KEY(id_categoria) REFERENCES categorias(id),
    CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
);

-- Crear tabla de comentarios
CREATE TABLE comentarios(
    id SERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    id_objeto INTEGER,
    id_usuario INTEGER,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_objeto FOREIGN KEY(id_objeto) REFERENCES objetos(id),
    CONSTRAINT fk_usuario_com FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
);

-- Crear tabla de favoritos
CREATE TABLE favoritos(
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER,
    id_objeto INTEGER,
    CONSTRAINT fk_usuario_fav FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_objeto_fav FOREIGN KEY(id_objeto) REFERENCES objetos(id),
    UNIQUE(id_usuario, id_objeto)
);