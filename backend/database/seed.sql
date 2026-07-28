-- Seed data para ReFind
-- Ejecutar después de script.sql
-- Password para todos los usuarios: 123456

INSERT INTO usuarios (nombre, correo, password, id_rol) VALUES
('Admin', 'admin@refind.com', '$2b$10$wI4zg35sHR1YgHBA1.rMT.H/7jLrrVUvZiudiTEsaNgMdTUkcFPia', 1),
('Juan Perez', 'juan@refind.com', '$2b$10$wI4zg35sHR1YgHBA1.rMT.H/7jLrrVUvZiudiTEsaNgMdTUkcFPia', 2),
('Maria Garcia', 'maria@refind.com', '$2b$10$wI4zg35sHR1YgHBA1.rMT.H/7jLrrVUvZiudiTEsaNgMdTUkcFPia', 2),
('Carlos Lopez', 'carlos@refind.com', '$2b$10$wI4zg35sHR1YgHBA1.rMT.H/7jLrrVUvZiudiTEsaNgMdTUkcFPia', 2);

-- Objetos de prueba
INSERT INTO objetos (titulo, descripcion, estado, ubicacion, id_categoria, id_usuario) VALUES
('Carpeta azul con documentos', 'Carpeta azul que contiene documentos importantes de la universidad', 'perdido', 'Biblioteca Central, Piso 2', 1, 2),
('Audífonos Sony negros', 'Audífonos bluetooth Sony WH-1000XM4', 'perdido', 'Aula 301, Edificio A', 3, 2),
('Chaqueta negra Nike', 'Chaqueta deportiva negra talla M', 'encontrado', 'Cafetería Principal', 2, 3),
('Mochila gris The North Face', 'Mochila con libros y cuadernos', 'perdido', 'Salón 205, Edificio B', 2, 4),
('Telefono Samsung Galaxy S23', 'Teléfono con funda azul, tiene rayón en la pantalla', 'perdido', 'Patio Central', 3, 3),
('Libro de Cálculo Stewart', 'Libro de cálculo de una变量, 7ma edición', 'encontrado', 'Biblioteca Central, Piso 1', 1, 4),
('Llavero con llaves', 'Llavero con 3 llaves y un llavero de metal', 'perdido', 'Estacionamiento', 3, 2),
('Cuaderno de apuntes', 'Cuaderno negro con apuntes de Base de Datos', 'encontrado', 'Aula 102, Edificio C', 1, 3);

-- Comentarios de prueba
INSERT INTO comentarios (texto, id_objeto, id_usuario) VALUES
('Hola, creo que vi esa carpeta en la biblioteca ayer', 1, 3),
('¿Podrías confirmar si es azul obscuro?', 1, 2),
('Sí, era azul obscuro con el logo de la universidad', 1, 3),
('Yo perdí unos audífonos similares, ¿cuántos tenías?', 2, 4),
('Eran bluetooth negros con estuche', 2, 2);

-- Mensajes de prueba
INSERT INTO mensajes (id_remitente, id_destinatario, id_objeto, mensaje) VALUES
(3, 2, 1, 'Hola Juan, encontré una carpeta azul en la biblioteca, ¿es tuya?'),
(2, 3, 1, '¡Sí! Es mía, ¿dónde la dejaste?'),
(3, 2, 1, 'La dejé en la recepción de la biblioteca'),
(4, 2, 2, 'Hola, vi unos audífonos en el aula 301');

-- Notificaciones de prueba
INSERT INTO notificaciones (id_usuario, tipo, mensaje, id_objeto, id_remitente) VALUES
(2, 'comentario', 'Maria comentó en tu objeto: Carpeta azul con documentos', 1, 3),
(2, 'mensaje', 'Maria te envió un mensaje sobre: Carpeta azul', 1, 3),
(3, 'encontrado', 'Carlos marcó tu objeto "Chaqueta negra Nike" como encontrado', 3, 4);
