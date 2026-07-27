const express = require("express");
const router = express.Router();
const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");

router.get("/", autenticacion, async (req, res) => {
  try {
    const resultado = await conexion.query(
      `SELECT n.*, rem.nombre as remitente_nombre, o.titulo as objeto_titulo
       FROM notificaciones n
       LEFT JOIN usuarios rem ON n.id_remitente = rem.id
       LEFT JOIN objetos o ON n.id_objeto = o.id
       WHERE n.id_usuario = $1
       ORDER BY n.fecha DESC
       LIMIT 50`,
      [req.usuario.id],
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
});

router.get("/no-leidas", autenticacion, async (req, res) => {
  try {
    const resultado = await conexion.query(
      "SELECT COUNT(*) FROM notificaciones WHERE id_usuario = $1 AND leido = FALSE",
      [req.usuario.id],
    );
    res.json({ count: parseInt(resultado.rows[0].count) });
  } catch (error) {
    console.error("Error al contar notificaciones:", error);
    res.status(500).json({ error: "Error al contar notificaciones" });
  }
});

router.put("/leer-todas", autenticacion, async (req, res) => {
  try {
    await conexion.query(
      "UPDATE notificaciones SET leido = TRUE WHERE id_usuario = $1 AND leido = FALSE",
      [req.usuario.id],
    );
    res.json({ mensaje: "Notificaciones marcadas como leídas" });
  } catch (error) {
    console.error("Error al marcar notificaciones:", error);
    res.status(500).json({ error: "Error al marcar notificaciones" });
  }
});

router.put("/:id/leer", autenticacion, async (req, res) => {
  try {
    await conexion.query(
      "UPDATE notificaciones SET leido = TRUE WHERE id = $1 AND id_usuario = $2",
      [req.params.id, req.usuario.id],
    );
    res.json({ mensaje: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error al marcar notificación:", error);
    res.status(500).json({ error: "Error al marcar notificación" });
  }
});

module.exports = router;
