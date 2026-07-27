import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Badge, Button, Modal, Form, Alert } from "react-bootstrap";
import styles from "./lost-card.module.css";
import { marcarEncontrado } from "../../services/objetos_services";
import { enviarMensaje } from "../../services/mensajes_services";

export const LostCard = ({ objeto, onVerDetalle, onEncontrado }) => {
    const [showDetalle, setShowDetalle] = useState(false);
    const [showEncontrado, setShowEncontrado] = useState(false);
    const [mensajeEncontrado, setMensajeEncontrado] = useState("");
    const [mensajeContacto, setMensajeContacto] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [contactando, setContactando] = useState(false);

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const token = localStorage.getItem("token");
    const esPropio = usuario.id === objeto.id_usuario;
    const estaLogueado = !!token;

    const handleMarcarEncontrado = async (e) => {
        e.preventDefault();
        if (!mensajeEncontrado.trim()) return;
        await marcarEncontrado(objeto.id, mensajeEncontrado);
        setShowEncontrado(false);
        setMensajeEncontrado("");
        if (onEncontrado) onEncontrado(objeto.id);
    };

    const handleContactar = async () => {
        if (!mensajeContacto.trim()) return;
        setContactando(true);
        try {
            await enviarMensaje(objeto.id_usuario, objeto.id, mensajeContacto);
            setEnviado(true);
            setMensajeContacto("");
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        } finally {
            setContactando(false);
        }
    };

    return (
        <>
            <Card className={styles.card}>
                {objeto.imagen && (
                    <Card.Img variant="top" src={objeto.imagen} className={styles.cardImg} />
                )}
                <Card.Body>
                    <Card.Title>{objeto.titulo}</Card.Title>
                    <Card.Text>{objeto.descripcion}</Card.Text>
                    <Badge bg="danger" className={styles.badge}>Perdido</Badge>
                    <Card.Text><small>Ubicación: {objeto.ubicacion}</small></Card.Text>
                    <Card.Text><small>Tipo: {objeto.categoria}</small></Card.Text>
                    <div className="d-flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => setShowDetalle(true)}>
                            Ver Detalle
                        </Button>
                        {estaLogueado ? (
                            <Button variant="success" size="sm" onClick={() => setShowEncontrado(true)}>
                                Encontrado
                            </Button>
                        ) : (
                            <Button variant="outline-secondary" size="sm" onClick={() => setShowDetalle(true)}>
                                Inicia sesión
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showDetalle} onHide={() => { setShowDetalle(false); setEnviado(false); setContactando(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{objeto.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Descripción:</strong> {objeto.descripcion}</p>
                    <p><strong>Ubicación:</strong> {objeto.ubicacion}</p>
                    <p><strong>Categoría:</strong> {objeto.categoria}</p>
                    <p><strong>Publicado por:</strong> <Link to={`/perfil/${objeto.id_usuario}`} className="text-decoration-none">{objeto.usuario}</Link></p>
                    <p><strong>Fecha:</strong> {new Date(objeto.fecha).toLocaleDateString()}</p>
                    {objeto.imagen && (
                        <img src={objeto.imagen} alt={objeto.titulo} className="w-100 rounded mb-3" />
                    )}
                    {estaLogueado && !esPropio && (<>
                        <hr />
                        <h6>Contactar al dueño</h6>
                        {enviado ? (
                            <Alert variant="success">Mensaje enviado correctamente</Alert>
                        ) : (
                            <Form onSubmit={(e) => { e.preventDefault(); handleContactar(); }}>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={mensajeContacto}
                                        onChange={(e) => setMensajeContacto(e.target.value)}
                                        placeholder="Escribe un mensaje para el dueño..."
                                    />
                                </Form.Group>
                                <Button variant="primary" size="sm" type="submit" disabled={contactando}>
                                    {contactando ? "Enviando..." : "Enviar mensaje"}
                                </Button>
                            </Form>
                        )}
                    </>)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowDetalle(false); setEnviado(false); setContactando(false); }}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEncontrado} onHide={() => setShowEncontrado(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Marcar como encontrado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleMarcarEncontrado}>
                        <Form.Group className="mb-3">
                            <Form.Label>Envía un mensaje al dueño para coordinar la entrega:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={mensajeEncontrado}
                                onChange={(e) => setMensajeEncontrado(e.target.value)}
                                placeholder="Ej: Encontré tu objeto, puedo dejarlo en la oficina de perdidos y encontrados..."
                                required
                            />
                        </Form.Group>
                        <p className="text-muted small">Al enviar, el objeto se marcará como encontrado y el dueño recibirá tu mensaje.</p>
                        <Button variant="success" type="submit">
                            Enviar y marcar como encontrado
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};
