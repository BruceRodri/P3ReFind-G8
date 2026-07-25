const express = require("express");
const router = express.Router();
const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");
const autorizacion = require("../middlewares/autorizacion");

// OBTENER TODOS, SOLO ADMIN
router.get("/", autenticacion, autorizacion("ADMIN"), async (req, res) => {
  try {
    const resultado = await conexion.query(
      "SELECT u.id, u.nombre, u.correo, r.nombre as rol FROM usuarios u INNER JOIN roles r ON u.id_rol = r.id WHERE u.activo = TRUE",
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// OBTENER UNO ESPECÍFICO
router.get("/:id", autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await conexion.query(
      "SELECT u.id, u.nombre, u.correo, r.nombre as rol FROM usuarios u INNER JOIN roles r ON u.id_rol = r.id WHERE u.id = $1 AND u.activo = TRUE",
      [id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// ACTUALIZAR USUARIO
router.put("/:id", autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;
    const resultado = await conexion.query(
      "UPDATE usuarios SET nombre = $1, correo = $2 WHERE id = $3 AND activo = TRUE RETURNING id, nombre, correo",
      [nombre, correo, id],
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// ELIMINAR USUARIO
router.delete(
  "/:id",
  autenticacion,
  autorizacion("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await conexion.query(
        "UPDATE usuarios SET activo = FALSE WHERE id = $1 RETURNING id",
        [id],
      );
      if (resultado.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  },
);

module.exports = router;
