import api from "../api/axios";

export const login = async (correo, password) => {
  try {
    const response = await api.post("/auth/login", { correo, password });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const register = async (nombre, correo, password) => {
  try {
    const response = await api.post("/auth/register", {
      nombre,
      correo,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
