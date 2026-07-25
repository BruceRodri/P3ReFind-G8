const jwt = require("jsonwebtoken");

const autenticacion = (req, res, next) => {
  const encabezado = req.headers.authorization;
  if (!encabezado) {
    return res
      .status(401)
      .json({ error: "Debe enviar el token de autenticación" });
  }
  const token = encabezado.split(" ")[1];
  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token de autenticación inválido" });
  }
};

module.exports = autenticacion;
