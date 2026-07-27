import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { getMisObjetos, crearObjeto, eliminarObjeto } from "../../services/objetos_services";
import { getCategorias } from "../../services/categorias_services";
import { subirImagen } from "../../services/upload_services";
import { LostCard, FoundCard } from "../../components";
import styles from "./mis-objetos.module.css";

export const MisObjetosPage = () => {
    const [objetos, setObjetos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
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
        const [objData, catData] = await Promise.all([getMisObjetos(), getCategorias()]);
        setObjetos(objData);
        setCategorias(catData);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSubiendo(true);
        try {
            const data = await subirImagen(file);
            setNuevoObjeto((prev) => ({ ...prev, imagen: data.url }));
        } catch (error) {
            console.error("Error al subir imagen:", error);
        } finally {
            setSubiendo(false);
        }
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

    const handleEliminar = async () => {
        await eliminarObjeto(showDeleteConfirm);
        setShowDeleteConfirm(null);
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
                            <LostCard objeto={obj} onVerDetalle={() => { }} onEncontrado={cargarDatos} />
                        ) : (
                            <FoundCard objeto={obj} onVerDetalle={() => { }} />
                        )}
                        <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(obj.id)}>
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
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevoObjeto.ubicacion}
                                onChange={(e) => setNuevoObjeto({ ...nuevoObjeto, ubicacion: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {nuevoObjeto.imagen && (
                                <div className="mt-2">
                                    <img src={nuevoObjeto.imagen} alt="Preview" style={{ maxHeight: 100 }} />
                                </div>
                            )}
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
                        <Button variant="primary" type="submit" disabled={subiendo}>
                            {subiendo ? "Subiendo imagen..." : "Crear Objeto"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={!!showDeleteConfirm} onHide={() => setShowDeleteConfirm(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Seguro que deseas eliminar este objeto? Esta acción no se puede deshacer.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleEliminar}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
