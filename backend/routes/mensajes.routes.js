const express = require("express");
const router = express.Router();
const conexion = require("../database/conexion");
const autenticacion = require("../middlewares/autenticacion");

router.get("/", autenticacion, async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      `SELECT m.*, 
        rem.nombre as remitente_nombre, des.nombre as destinatario_nombre,
        o.titulo as objeto_titulo
       FROM mensajes m
       INNER JOIN usuarios rem ON m.id_remitente = rem.id
       INNER JOIN usuarios des ON m.id_destinatario = des.id
       LEFT JOIN objetos o ON m.id_objeto = o.id
       WHERE m.id_remitente = $1 OR m.id_destinatario = $1
       ORDER BY m.fecha DESC`,
      [id_usuario],
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

router.get("/conversaciones", autenticacion, async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const resultado = await conexion.query(
      `SELECT DISTINCT ON (LEAST(m.id_remitente, m.id_destinatario), GREATEST(m.id_remitente, m.id_destinatario), m.id_objeto) 
        m.*, 
        CASE WHEN m.id_remitente = $1 THEN des.nombre ELSE rem.nombre END as contacto_nombre,
        CASE WHEN m.id_remitente = $1 THEN des.id ELSE rem.id END as contacto_id,
        o.titulo as objeto_titulo, o.id as objeto_id
       FROM mensajes m
       INNER JOIN usuarios rem ON m.id_remitente = rem.id
       INNER JOIN usuarios des ON m.id_destinatario = des.id
       LEFT JOIN objetos o ON m.id_objeto = o.id
       WHERE m.id_remitente = $1 OR m.id_destinatario = $1
       ORDER BY LEAST(m.id_remitente, m.id_destinatario), GREATEST(m.id_remitente, m.id_destinatario), m.id_objeto, m.fecha DESC`,
      [id_usuario],
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener conversaciones:", error);
    res.status(500).json({ error: "Error al obtener conversaciones" });
  }
});

router.post("/", autenticacion, async (req, res) => {
  try {
    const { id_destinatario, id_objeto, mensaje } = req.body;
    const id_remitente = req.usuario.id;
    const resultado = await conexion.query(
      `INSERT INTO mensajes (id_remitente, id_destinatario, id_objeto, mensaje)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_remitente, id_destinatario, id_objeto, mensaje],
    );
    await conexion.query(
      `INSERT INTO notificaciones (id_usuario, tipo, mensaje, id_objeto, id_remitente)
       VALUES ($1, 'mensaje', $2, $3, $4)`,
      [id_destinatario, `Te enviaron un mensaje sobre: ${mensaje.substring(0, 50)}...`, id_objeto, id_remitente],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});

// HISTORIAL DE UNA CONVERSACIÓN
router.get("/conversacion/:contacto_id/:objeto_id", autenticacion, async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const { contacto_id, objeto_id } = req.params;
    const resultado = await conexion.query(
      `SELECT m.*, rem.nombre as remitente_nombre, des.nombre as destinatario_nombre
       FROM mensajes m
       INNER JOIN usuarios rem ON m.id_remitente = rem.id
       INNER JOIN usuarios des ON m.id_destinatario = des.id
       WHERE ((m.id_remitente = $1 AND m.id_destinatario = $2) OR (m.id_remitente = $2 AND m.id_destinatario = $1))
       AND m.id_objeto = $3
       ORDER BY m.fecha ASC`,
      [id_usuario, contacto_id, objeto_id],
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener conversación:", error);
    res.status(500).json({ error: "Error al obtener conversación" });
  }
});

router.put("/:id/leer", autenticacion, async (req, res) => {
  try {
    await conexion.query("UPDATE mensajes SET leido = TRUE WHERE id = $1", [req.params.id]);
    res.json({ mensaje: "Mensaje marcado como leído" });
  } catch (error) {
    console.error("Error al marcar mensaje:", error);
    res.status(500).json({ error: "Error al marcar mensaje" });
  }
});

router.get("/no-leidos", autenticacion, async (req, res) => {
  try {
    const resultado = await conexion.query(
      "SELECT COUNT(*) FROM mensajes WHERE id_destinatario = $1 AND leido = FALSE",
      [req.usuario.id],
    );
    res.json({ count: parseInt(resultado.rows[0].count) });
  } catch (error) {
    console.error("Error al contar mensajes:", error);
    res.status(500).json({ error: "Error al contar mensajes" });
  }
});

module.exports = router;
