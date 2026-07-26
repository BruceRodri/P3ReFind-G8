import api from "../api/axios";

//OBTENER OBJETOS
export const getObjetos = async () => {
  try {
    const response = await api.get("/objetos");
    return response.data;
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
