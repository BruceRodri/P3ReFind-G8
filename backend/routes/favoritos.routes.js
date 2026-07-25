const express = require("express");
const router = express.Router();
const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");

// OBTENER FAVORITOS
router.get("/", autenticacion, async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      `
      SELECT o.*, c.nombre as categoria 
      FROM favoritos f
      INNER JOIN objetos o ON f.id_objeto = o.id
      INNER JOIN categorias c ON o.id_categoria = c.id
      WHERE f.id_usuario = $1 AND o.activo = TRUE
    `,
      [id_usuario],
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// AGREGAR FAVORITO
router.post("/", autenticacion, async (req, res) => {
  try {
    const { id_objeto } = req.body;
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      `
      INSERT INTO favoritos (id_usuario, id_objeto) 
      VALUES ($1, $2) RETURNING *
    `,
      [id_usuario, id_objeto],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ error: "Error al agregar favorito" });
  }
});

// ELIMINAR FAVORITO
router.delete("/:id_objeto", autenticacion, async (req, res) => {
  try {
    const { id_objeto } = req.params;
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      "DELETE FROM favoritos WHERE id_usuario = $1 AND id_objeto = $2 RETURNING id",
      [id_usuario, id_objeto],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Favorito no encontrado" });
    }
    res.status(200).json({ mensaje: "Favorito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

module.exports = router;
