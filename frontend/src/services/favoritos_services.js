import api from "../api/axios";

//OBTENER FAVORITOS
export const getFavoritos = async () => {
  try {
    const response = await api.get("/favoritos");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//AGREGAR FAVORITO
export const agregarFavorito = async (idObjeto) => {
  try {
    const response = await api.post("/favoritos", { id_objeto: idObjeto });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//ELIMINAR FAVORITO
export const eliminarFavorito = async (idObjeto) => {
  try {
    const response = await api.delete(`/favoritos/${idObjeto}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
