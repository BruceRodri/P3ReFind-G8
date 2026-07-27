import api from "../api/axios";

export const getConversaciones = async () => {
  const response = await api.get("/mensajes/conversaciones");
  return response.data;
};

export const getMensajesNoLeidos = async () => {
  const response = await api.get("/mensajes/no-leidos");
  return response.data;
};

export const getConversacion = async (contacto_id, objeto_id) => {
  const response = await api.get(`/mensajes/conversacion/${contacto_id}/${objeto_id}`);
  return response.data;
};

export const enviarMensaje = async (id_destinatario, id_objeto, mensaje) => {
  const response = await api.post("/mensajes", { id_destinatario, id_objeto, mensaje });
  return response.data;
};
