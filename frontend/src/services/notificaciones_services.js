import api from "../api/axios";

export const getNotificaciones = async () => {
  const response = await api.get("/notificaciones");
  return response.data;
};

export const getNoLeidas = async () => {
  const response = await api.get("/notificaciones/no-leidas");
  return response.data;
};

export const leerTodas = async () => {
  const response = await api.put("/notificaciones/leer-todas");
  return response.data;
};

export const leerNotificacion = async (id) => {
  const response = await api.put(`/notificaciones/${id}/leer`);
  return response.data;
};
