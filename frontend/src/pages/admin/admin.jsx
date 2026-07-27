import { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Modal, Badge } from "react-bootstrap";
import { getObjetos, eliminarObjeto } from "../../services/objetos_services";
import api from "../../api/axios";
import styles from "./admin.module.css";

export const AdminPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [objetos, setObjetos] = useState([]);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [showConfirmObj, setShowConfirmObj] = useState(null);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    if (usuario.rol !== "ADMIN") return;
    cargarUsuarios();
    cargarObjetos();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      setError("Error al cargar usuarios");
    }
  };

  const cargarObjetos = async () => {
    try {
      setObjetos(await getObjetos());
    } catch (error) {
      setError("Error al cargar objetos");
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      setShowConfirm(null);
      cargarUsuarios();
    } catch (error) {
      setError("Error al eliminar usuario");
    }
  };

  const handleEliminarObjeto = async (id) => {
    try {
      await eliminarObjeto(id);
      setShowConfirmObj(null);
      cargarObjetos();
    } catch (error) {
      setError("Error al eliminar objeto");
    }
  };

  if (usuario.rol !== "ADMIN") {
    return (
      <Container className={styles.container}>
        <h1>Acceso denegado</h1>
        <p>No tienes permisos de administrador.</p>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <h1 className={styles.title}>Panel de Administración</h1>
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

      <h2 className="mt-4">Usuarios ({usuarios.length})</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td><Badge bg={u.rol === "ADMIN" ? "warning" : "info"}>{u.rol}</Badge></td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={u.rol === "ADMIN"}
                  onClick={() => setShowConfirm(u.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-4">Objetos ({objetos.length})</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr><th>ID</th><th>Título</th><th>Usuario</th><th>Estado</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {objetos.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.titulo}</td>
              <td>{o.usuario}</td>
              <td><Badge bg={o.estado === "perdido" ? "danger" : "success"}>{o.estado}</Badge></td>
              <td>
                <Button variant="danger" size="sm" onClick={() => setShowConfirmObj(o.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={!!showConfirm} onHide={() => setShowConfirm(null)}>
        <Modal.Header closeButton><Modal.Title>Confirmar</Modal.Title></Modal.Header>
        <Modal.Body>¿Seguro que deseas eliminar este usuario?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(null)}>Cancelar</Button>
          <Button variant="danger" onClick={() => handleEliminarUsuario(showConfirm)}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!showConfirmObj} onHide={() => setShowConfirmObj(null)}>
        <Modal.Header closeButton><Modal.Title>Confirmar</Modal.Title></Modal.Header>
        <Modal.Body>¿Seguro que deseas eliminar este objeto?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmObj(null)}>Cancelar</Button>
          <Button variant="danger" onClick={() => handleEliminarObjeto(showConfirmObj)}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
