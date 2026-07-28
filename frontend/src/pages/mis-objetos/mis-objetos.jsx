import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form, Spinner } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import {
    getMisObjetos,
    crearObjeto,
    actualizarObjeto,
    eliminarObjeto,
} from "../../services/objetos_services";
import { getCategorias } from "../../services/categorias_services";
import { subirImagen } from "../../services/upload_services";
import { LostCard, FoundCard } from "../../components";
import styles from "./mis-objetos.module.css";

const objetoVacio = {
    titulo: "",
    descripcion: "",
    estado: "perdido",
    ubicacion: "",
    imagen: "",
    id_categoria: "",
};

export const MisObjetosPage = () => {
    const [objetos, setObjetos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [objetoEditando, setObjetoEditando] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [nuevoObjeto, setNuevoObjeto] = useState(objetoVacio);

    async function cargarDatos() {
        const [objData, catData] = await Promise.allSettled([getMisObjetos(), getCategorias()]);
        if (objData.status === "fulfilled") setObjetos(objData.value);
        if (catData.status === "fulfilled") setCategorias(catData.value);
    }

    useEffect(() => {
        setLoading(true);
        Promise.allSettled([getMisObjetos(), getCategorias()]).then(([objResult, catResult]) => {
            if (objResult.status === "fulfilled") setObjetos(objResult.value);
            if (catResult.status === "fulfilled") setCategorias(catResult.value);
        }).finally(() => setLoading(false));
    }, []);

    const handleFileChange = async (e, esEdicion = false) => {
        const file = e.target.files[0];
        if (!file) return;
        setSubiendo(true);
        try {
            const data = await subirImagen(file);
            if (esEdicion) {
                setObjetoEditando((prev) => ({ ...prev, imagen: data.url }));
            } else {
                setNuevoObjeto((prev) => ({ ...prev, imagen: data.url }));
            }
        } catch (error) {
            console.error("Error al subir imagen:", error);
        } finally {
            setSubiendo(false);
        }
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        setGuardando(true);
        try {
            await crearObjeto(nuevoObjeto);
            setShowModal(false);
            setNuevoObjeto(objetoVacio);
            await cargarDatos();
        } finally {
            setGuardando(false);
        }
    };

    const abrirEdicion = (objeto) => {
        setObjetoEditando({
            id: objeto.id,
            titulo: objeto.titulo || "",
            descripcion: objeto.descripcion || "",
            estado: objeto.estado || "perdido",
            ubicacion: objeto.ubicacion || "",
            imagen: objeto.imagen || "",
            id_categoria: objeto.id_categoria || "",
        });
    };

    const handleActualizar = async (e) => {
        e.preventDefault();
        setGuardando(true);
        try {
            const { id, ...datos } = objetoEditando;
            await actualizarObjeto(id, datos);
            setObjetoEditando(null);
            await cargarDatos();
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async () => {
        await eliminarObjeto(showDeleteConfirm);
        setShowDeleteConfirm(null);
        cargarDatos();
    };

    return (
        <Container>
            <h1 className={styles.title}>Mis Objetos</h1>
            <p className={styles.subtitle}>Gestiona todos los objetos que has publicado.</p>
            <Button variant="success" className={styles.addButton} onClick={() => setShowModal(true)}>
                + Nuevo Objeto
            </Button>

            {loading ? (
                <div className={styles.spinner}>
                    <Spinner animation="border" />
                </div>
            ) : objetos.length === 0 ? (
                <div className={styles.empty}>
                    <h3>Aun no tienes objetos publicados</h3>
                    <p>Comienza publicando un objeto perdido o encontrado para que la comunidad te ayude.</p>
                </div>
            ) : (
                <Row>
                    {objetos.map((obj) => (
                        <Col key={obj.id} md={4} sm={6} xs={12} className="mb-4">
                            {obj.estado === "perdido" ? (
                                <LostCard objeto={obj} onEncontrado={cargarDatos} />
                            ) : (
                                <FoundCard objeto={obj} />
                            )}
                            <div className={styles.actions}>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className={styles.editButton}
                                    onClick={() => abrirEdicion(obj)}
                                >
                                    <EditIcon fontSize="small" />
                                    Editar
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => setShowDeleteConfirm(obj.id)}>
                                    Eliminar
                                </Button>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

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
                                rows={3}
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
                            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                            {nuevoObjeto.imagen && (
                                <img src={nuevoObjeto.imagen} alt="Vista previa" className={styles.preview} />
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
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={subiendo || guardando}>
                            {subiendo ? "Subiendo imagen..." : guardando ? "Creando..." : "Crear Objeto"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={!!objetoEditando} onHide={() => setObjetoEditando(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar objeto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {objetoEditando && (
                        <Form onSubmit={handleActualizar}>
                            <Form.Group className="mb-3">
                                <Form.Label>Título</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={objetoEditando.titulo}
                                    onChange={(e) => setObjetoEditando({ ...objetoEditando, titulo: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={objetoEditando.descripcion}
                                    onChange={(e) => setObjetoEditando({ ...objetoEditando, descripcion: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ubicación</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={objetoEditando.ubicacion}
                                    onChange={(e) => setObjetoEditando({ ...objetoEditando, ubicacion: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    value={objetoEditando.estado}
                                    onChange={(e) => setObjetoEditando({ ...objetoEditando, estado: e.target.value })}
                                >
                                    <option value="perdido">Perdido</option>
                                    <option value="encontrado">Encontrado</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Select
                                    value={objetoEditando.id_categoria}
                                    onChange={(e) => setObjetoEditando({ ...objetoEditando, id_categoria: e.target.value })}
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Cambiar imagen</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, true)}
                                />
                                {objetoEditando.imagen && (
                                    <img src={objetoEditando.imagen} alt="Vista previa" className={styles.preview} />
                                )}
                            </Form.Group>
                            <div className={styles.modalActions}>
                                <Button variant="secondary" onClick={() => setObjetoEditando(null)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={subiendo || guardando}>
                                    {subiendo ? "Subiendo imagen..." : guardando ? "Guardando..." : "Guardar cambios"}
                                </Button>
                            </div>
                        </Form>
                    )}
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
