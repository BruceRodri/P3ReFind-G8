import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { getObjetos, crearObjeto, eliminarObjeto } from "../../services/objetos_services";
import { getCategorias } from "../../services/categorias_services";
import { LostCard, FoundCard } from "../../components";
import styles from "./mis-objetos.module.css";

export const MisObjetosPage = () => {
    const [objetos, setObjetos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevoObjeto, setNuevoObjeto] = useState({
        titulo: "",
        descripcion: "",
        estado: "perdido",
        ubicacion: "",
        imagen: "",
        id_categoria: "",
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        const [objData, catData] = await Promise.all([getObjetos(), getCategorias()]);
        setObjetos(objData);
        setCategorias(catData);
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        await crearObjeto(nuevoObjeto);
        setShowModal(false);
        setNuevoObjeto({
            titulo: "",
            descripcion: "",
            estado: "perdido",
            ubicacion: "",
            imagen: "",
            id_categoria: "",
        });
        cargarDatos();
    };

    const handleEliminar = async (id) => {
        await eliminarObjeto(id);
        cargarDatos();
    };

    return (
        <Container>
            <h1 className={styles.title}>Mis Objetos</h1>
            <Button variant="success" className={styles.addButton} onClick={() => setShowModal(true)}>
                + Nuevo Objeto
            </Button>

            <Row>
                {objetos.map((obj) => (
                    <Col key={obj.id} md={4} sm={6} xs={12}>
                        {obj.estado === "perdido" ? (
                            <LostCard objeto={obj} onVerDetalle={() => { }} />
                        ) : (
                            <FoundCard objeto={obj} onVerDetalle={() => { }} />
                        )}
                        <Button variant="danger" size="sm" onClick={() => handleEliminar(obj.id)}>
                            Eliminar
                        </Button>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Objeto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCrear}>
                        <Form.Group className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevoObjeto.titulo}
                                onChange={(e) => setNuevoObjeto({ ...nuevoObjeto, titulo: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={nuevoObjeto.descripcion}
                                onChange={(e) => setNuevoObjeto({ ...nuevoObjeto, descripcion: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                                value={nuevoObjeto.estado}
                                onChange={(e) => setNuevoObjeto({ ...nuevoObjeto, estado: e.target.value })}
                            >
                                <option value="perdido">Perdido</option>
                                <option value="encontrado">Encontrado</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevoObjeto.ubicacion}
                                onChange={(e) => setNuevoObjeto({ ...nuevoObjeto, ubicacion: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL de Imagen</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevoObjeto.imagen}
                                onChange={(e) => setNuevoObjeto({ ...nuevoObjeto, imagen: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                                value={nuevoObjeto.id_categoria}
                                onChange={(e) => setNuevoObjeto({ ...nuevoObjeto, id_categoria: e.target.value })}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Crear Objeto
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};