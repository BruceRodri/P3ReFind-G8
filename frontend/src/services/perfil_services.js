import api from "../api/axios";

export const getPerfil = async (id) => {
  const response = await api.get(`/usuarios/perfil/${id}`);
  return response.data;
};
