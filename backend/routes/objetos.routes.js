const express = require("express");
const router = express.Router();
const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");
const autorizacion = require("../middlewares/autorizacion");

// OBTENER TODOS LOS OBJETOS
router.get("/", autenticacion, async (req, res) => {
  try {
    const resultado = await conexion.query(`
      SELECT o.*, c.nombre as categoria, u.nombre as usuario 
      FROM objetos o
      INNER JOIN categorias c ON o.id_categoria = c.id
      INNER JOIN usuarios u ON o.id_usuario = u.id
      WHERE o.activo = TRUE
      ORDER BY o.fecha DESC
    `);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener objetos:", error);
    res.status(500).json({ error: "Error al obtener objetos" });
  }
});

// OBTENER UN OBJETO ESPECÍFICO
router.get("/:id", autenticacion, async (req, res) => {
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

// BUSCAR OBJETOS POR TÉRMINO
router.get("/buscar/:termino", autenticacion, async (req, res) => {
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

// ACTUALIZAR OBJETO
router.put("/:id", autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, ubicacion, imagen, id_categoria } =
      req.body;
    const resultado = await conexion.query(
      `
      UPDATE objetos 
      SET titulo = $1, descripcion = $2, estado = $3, ubicacion = $4, imagen = $5, id_categoria = $6
      WHERE id = $7 AND activo = TRUE RETURNING *
    `,
      [titulo, descripcion, estado, ubicacion, imagen, id_categoria, id],
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
