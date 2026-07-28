const express = require("express");
const cors = require("cors");
const path = require("path");
const autenticacion = require("../routes/auth.routes");
const usuarios = require("../routes/usuarios.routes");
const objetos = require("../routes/objetos.routes");
const categorias = require("../routes/categorias.routes");
const comentarios = require("../routes/comentarios.routes");
const mensajes = require("../routes/mensajes.routes");
const notificaciones = require("../routes/notificaciones.routes");
const upload = require("../routes/upload.routes");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/auth", autenticacion);
app.use("/usuarios", usuarios);
app.use("/objetos", objetos);
app.use("/categorias", categorias);
app.use("/comentarios", comentarios);
app.use("/mensajes", mensajes);
app.use("/notificaciones", notificaciones);
app.use("/upload", upload);

app.get("/", (req, res) => {
  res.json({ mensaje: "API ReFind funcionando" });
});

module.exports = app;
