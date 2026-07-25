const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const conexion = require("../database/conexion");
const generToken = require("../config/jwt");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res
        .status(400)
        .json({ error: "Ingrese las credenciales correctas" });
    }
    const consulta = `
      SELECT u.id, u.nombre, u.correo, u.password, r.nombre as rol 
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id 
      WHERE u.correo = $1 AND u.activo = TRUE
    `;
    const resultado = await conexion.query(consulta, [correo]);
    if (resultado.rows.length === 0) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }
    const usuario = resultado.rows[0];
    const esCorrecto = await bcrypt.compare(password, usuario.password);
    if (!esCorrecto) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }
    const token = generToken(usuario);
    delete usuario.password;
    return res.json({
      mensaje: "Inicio de sesión exitoso",
      token: token,
      usuario,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
      return res
        .status(400)
        .json({ error: "Ingrese las credenciales completas" });
    }
    const consulta = `SELECT id FROM usuarios WHERE correo = $1`;
    const resultado = await conexion.query(consulta, [correo]);
    if (resultado.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    const passwordEncriptada = await bcrypt.hash(password, 10);
    await conexion.query(
      `INSERT INTO usuarios (nombre, correo, password, id_rol) 
       VALUES ($1, $2, $3, 2)`,
      [nombre, correo, passwordEncriptada],
    );
    return res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
