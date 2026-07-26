import api from "../api/axios";

//OBTENER COMENTARIOS
export const getComentarios = async (idObjeto) => {
  try {
    const response = await api.get(`/comentarios/${idObjeto}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//CREAR COMENTARIO
export const crearComentario = async (texto, idObjeto) => {
  try {
    const response = await api.post("/comentarios", {
      texto,
      id_objeto: idObjeto,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//ELIMINAR COMENTARIO
export const eliminarComentario = async (id) => {
  try {
    const response = await api.delete(`/comentarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
