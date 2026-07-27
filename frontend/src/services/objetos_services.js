import api from "../api/axios";

//OBTENER MIS OBJETOS
export const getMisObjetos = async () => {
  try {
    const response = await api.get("/objetos/mis-objetos");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//MARCAR COMO ENCONTRADO
export const marcarEncontrado = async (id, mensaje) => {
  try {
    const response = await api.put(`/objetos/${id}/encontrado`, { mensaje });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//OBTENER OBJETOS CON PAGINACIÓN
export const getObjetos = async (page = 1, limit = 12) => {
  try {
    const response = await api.get(`/objetos?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//TOTAL DE OBJETOS
export const getTotalObjetos = async () => {
  try {
    const response = await api.get("/objetos/total");
    return response.data.total;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//OBTENER OBJETO POR ID
export const getObjetoById = async (id) => {
  try {
    const response = await api.get(`/objetos/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//BUSCAR OBJETOS
export const buscarObjetos = async (termino) => {
  try {
    const response = await api.get(`/objetos/buscar/${termino}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//CREAR OBJETO
export const crearObjeto = async (objeto) => {
  try {
    const response = await api.post("/objetos", objeto);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//ACTUALIZAR OBJETO
export const actualizarObjeto = async (id, objeto) => {
  try {
    const response = await api.put(`/objetos/${id}`, objeto);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//ESTADÍSTICAS
export const getEstadisticas = async () => {
  try {
    const response = await api.get("/objetos/estadisticas");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//ELIMINAR OBJETO
export const eliminarObjeto = async (id) => {
  try {
    const response = await api.delete(`/objetos/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
