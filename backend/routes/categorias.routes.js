const express = require("express");
const router = express.Router();
const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");
const autorizacion = require("../middlewares/autorizacion");

// OBTENER TODAS LAS CATEGORIAS — público
router.get("/", async (req, res) => {
  try {
    const resultado = await conexion.query("SELECT * FROM categorias");
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// CREAR NUEVA CATEGORIA (solo admin)
router.post("/", autenticacion, autorizacion("ADMIN"), async (req, res) => {
  try {
    const { nombre } = req.body;
    const resultado = await conexion.query(
      "INSERT INTO categorias (nombre) VALUES ($1) RETURNING *",
      [nombre],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
});

// ELIMINAR CATEGORIA (solo admin)
router.delete(
  "/:id",
  autenticacion,
  autorizacion("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await conexion.query(
        "DELETE FROM categorias WHERE id = $1 RETURNING id",
        [id],
      );
      if (resultado.rows.length === 0) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }
      res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      res.status(500).json({ error: "Error al eliminar categoría" });
    }
  },
);

module.exports = router;
