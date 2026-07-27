//Codigo para generar el token de autenticación
const jwt = require("jsonwebtoken");

const generToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
};

module.exports = generToken;
