const express = require("express");
const router = express.Router();
const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");
const autorizacion = require("../middlewares/autorizacion");

// OBTENER TODOS LOS OBJETOS (con paginación) — público
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const resultado = await conexion.query(
      `
      SELECT o.*, c.nombre as categoria, u.nombre as usuario 
      FROM objetos o
      INNER JOIN categorias c ON o.id_categoria = c.id
      INNER JOIN usuarios u ON o.id_usuario = u.id
      WHERE o.activo = TRUE
      ORDER BY o.fecha DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset],
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener objetos:", error);
    res.status(500).json({ error: "Error al obtener objetos" });
  }
});

// TOTAL DE OBJETOS (para paginación) — público
router.get("/total", async (req, res) => {
  try {
    const resultado = await conexion.query(
      "SELECT COUNT(*) FROM objetos WHERE activo = TRUE",
    );
    res.json({ total: parseInt(resultado.rows[0].count) });
  } catch (error) {
    console.error("Error al contar objetos:", error);
    res.status(500).json({ error: "Error al contar objetos" });
  }
});

// OBTENER MIS OBJETOS (solo del usuario autenticado)
router.get("/mis-objetos", autenticacion, async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      `
      SELECT o.*, c.nombre as categoria, u.nombre as usuario 
      FROM objetos o
      INNER JOIN categorias c ON o.id_categoria = c.id
      INNER JOIN usuarios u ON o.id_usuario = u.id
      WHERE o.activo = TRUE AND o.id_usuario = $1
      ORDER BY o.fecha DESC
    `,
      [id_usuario],
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener mis objetos:", error);
    res.status(500).json({ error: "Error al obtener mis objetos" });
  }
});

// ESTADÍSTICAS — público
router.get("/estadisticas", async (req, res) => {
  try {
    const totalObjetos = await conexion.query("SELECT COUNT(*) FROM objetos WHERE activo = TRUE");
    const encontrados = await conexion.query("SELECT COUNT(*) FROM objetos WHERE activo = TRUE AND estado = 'encontrado'");
    const perdidos = await conexion.query("SELECT COUNT(*) FROM objetos WHERE activo = TRUE AND estado = 'perdido'");
    const usuariosActivos = await conexion.query("SELECT COUNT(*) FROM usuarios WHERE activo = TRUE");
    res.json({
      total: parseInt(totalObjetos.rows[0].count),
      encontrados: parseInt(encontrados.rows[0].count),
      perdidos: parseInt(perdidos.rows[0].count),
      usuariosActivos: parseInt(usuariosActivos.rows[0].count),
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// OBTENER UN OBJETO ESPECÍFICO — público
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await conexion.query(
      `
      SELECT o.*, c.nombre as categoria, u.nombre as usuario 
      FROM objetos o
      INNER JOIN categorias c ON o.id_categoria = c.id
      INNER JOIN usuarios u ON o.id_usuario = u.id
      WHERE o.id = $1 AND o.activo = TRUE
    `,
      [id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Objeto no encontrado" });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener objeto:", error);
    res.status(500).json({ error: "Error al obtener objeto" });
  }
});

// BUSCAR OBJETOS POR TÉRMINO — público
router.get("/buscar/:termino", async (req, res) => {
  try {
    const { termino } = req.params;
    const resultado = await conexion.query(
      `
      SELECT o.*, c.nombre as categoria, u.nombre as usuario 
      FROM objetos o
      INNER JOIN categorias c ON o.id_categoria = c.id
      INNER JOIN usuarios u ON o.id_usuario = u.id
      WHERE o.activo = TRUE 
      AND (o.titulo ILIKE $1 OR o.descripcion ILIKE $1 OR o.ubicacion ILIKE $1)
      ORDER BY o.fecha DESC
    `,
      [`%${termino}%`],
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

// CREAR NUEVO OBJETO
router.post("/", autenticacion, async (req, res) => {
  try {
    const { titulo, descripcion, estado, ubicacion, imagen, id_categoria } =
      req.body;
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      `
      INSERT INTO objetos (titulo, descripcion, estado, ubicacion, imagen, id_categoria, id_usuario) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `,
      [
        titulo,
        descripcion,
        estado,
        ubicacion,
        imagen,
        id_categoria,
        id_usuario,
      ],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear objeto:", error);
    res.status(500).json({ error: "Error al crear objeto" });
  }
});

// MARCAR OBJETO COMO ENCONTRADO Y ENVIAR MENSAJE AL DUEÑO
router.put("/:id/encontrado", autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const { mensaje } = req.body;
    const encontrado = await conexion.query(
      `UPDATE objetos SET estado = 'encontrado' WHERE id = $1 AND activo = TRUE RETURNING *`,
      [id],
    );
    if (encontrado.rows.length === 0) {
      return res.status(404).json({ error: "Objeto no encontrado" });
    }
    const objeto = encontrado.rows[0];
    if (objeto.id_usuario !== req.usuario.id) {
      await conexion.query(
        `INSERT INTO mensajes (id_remitente, id_destinatario, id_objeto, mensaje)
         VALUES ($1, $2, $3, $4)`,
        [req.usuario.id, objeto.id_usuario, id, mensaje],
      );
      await conexion.query(
        `INSERT INTO notificaciones (id_usuario, tipo, mensaje, id_objeto, id_remitente)
         VALUES ($1, 'encontrado', $2, $3, $4)`,
        [objeto.id_usuario, `${req.usuario.nombre} marcó tu objeto "${objeto.titulo}" como encontrado y te dejó un mensaje`, id, req.usuario.id],
      );
    }
    res.status(200).json(objeto);
  } catch (error) {
    console.error("Error al marcar como encontrado:", error);
    res.status(500).json({ error: "Error al marcar como encontrado" });
  }
});

// ACTUALIZAR OBJETO
router.put("/:id", autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, ubicacion, imagen, id_categoria } =
      req.body;
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      `
      UPDATE objetos 
      SET titulo = $1, descripcion = $2, estado = $3, ubicacion = $4, imagen = $5, id_categoria = $6
      WHERE id = $7 AND id_usuario = $8 AND activo = TRUE RETURNING *
    `,
      [titulo, descripcion, estado, ubicacion, imagen, id_categoria, id, id_usuario],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Objeto no encontrado" });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al actualizar objeto:", error);
    res.status(500).json({ error: "Error al actualizar objeto" });
  }
});

// ELIMINAR OBJETO
router.delete("/:id", autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await conexion.query(
      "UPDATE objetos SET activo = FALSE WHERE id = $1 RETURNING id",
      [id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Objeto no encontrado" });
    }
    res.status(200).json({ mensaje: "Objeto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar objeto:", error);
    res.status(500).json({ error: "Error al eliminar objeto" });
  }
});

module.exports = router;
