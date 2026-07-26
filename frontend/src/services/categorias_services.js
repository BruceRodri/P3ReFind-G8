import api from "../api/axios";

//OBTENER CATEGORIAS
export const getCategorias = async () => {
  try {
    const response = await api.get("/categorias");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
