const express = require("express");
const router = express.Router();
const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");

//OBTENER TODOS LOS COMENTARIOS DE UN OBJETO
router.get("/:id_objeto", autenticacion, async (req, res) => {
  try {
    const { id_objeto } = req.params;
    const resultado = await conexion.query(
      `
      SELECT c.*, u.nombre as usuario 
      FROM comentarios c
      INNER JOIN usuarios u ON c.id_usuario = u.id
      WHERE c.id_objeto = $1
      ORDER BY c.fecha DESC
    `,
      [id_objeto],
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

// CREAR UN NUEVO COMENTARIO
router.post("/", autenticacion, async (req, res) => {
  try {
    const { texto, id_objeto } = req.body;
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      `
      INSERT INTO comentarios (texto, id_objeto, id_usuario) 
      VALUES ($1, $2, $3) RETURNING *
    `,
      [texto, id_objeto, id_usuario],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: "Error al crear comentario" });
  }
});

//ELIMINAR UN COMENTARIO
router.delete("/:id", autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await conexion.query(
      "DELETE FROM comentarios WHERE id = $1 RETURNING id",
      [id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.status(200).json({ mensaje: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
});

module.exports = router;
