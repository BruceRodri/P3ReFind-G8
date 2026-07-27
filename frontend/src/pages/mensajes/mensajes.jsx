import { useState, useEffect, useRef } from "react";
import { Container, Card, ListGroup, Form, Button, Badge, Row, Col, Spinner } from "react-bootstrap";
import { getConversaciones, getConversacion, enviarMensaje } from "../../services/mensajes_services";
import styles from "./mensajes.module.css";

export const MensajesPage = () => {
  const [conversaciones, setConversaciones] = useState([]);
  const [contacto, setContacto] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const chatEndRef = useRef(null);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    getConversaciones().then(setConversaciones).catch(console.error);
  }, []);

  useEffect(() => {
    if (contacto) {
      setCargandoHistorial(true);
      getConversacion(contacto.contacto_id, contacto.objeto_id)
        .then(setHistorial)
        .catch(console.error)
        .finally(() => setCargandoHistorial(false));
    }
  }, [contacto]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historial]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!mensaje.trim() || !contacto) return;
    try {
      await enviarMensaje(contacto.contacto_id, contacto.objeto_id, mensaje);
      setMensaje("");
      const nuevoHistorial = await getConversacion(contacto.contacto_id, contacto.objeto_id);
      setHistorial(nuevoHistorial);
      getConversaciones().then(setConversaciones);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <Container className={styles.container}>
      <h1 className={styles.title}>Mensajes</h1>
      {conversaciones.length === 0 ? (
        <p className={styles.empty}>No tienes conversaciones aún. Marca un objeto como encontrado para iniciar una.</p>
      ) : (
        <Row className={styles.chatRow}>
          <Col md={4} className={styles.sidebar}>
            <ListGroup>
              {conversaciones.map((conv) => (
                <ListGroup.Item
                  key={`${conv.contacto_id}-${conv.objeto_id}`}
                  action
                  active={contacto?.contacto_id === conv.contacto_id && contacto?.objeto_id === conv.objeto_id}
                  onClick={() => setContacto(conv)}
                  className={styles.convItem}
                >
                  <div className="d-flex justify-content-between">
                    <strong>{conv.contacto_nombre}</strong>
                    {!conv.leido && conv.id_destinatario === usuario.id && (
                      <Badge bg="danger" pill>Nuevo</Badge>
                    )}
                  </div>
                  <small className="text-muted">{conv.objeto_titulo}</small>
                  <p className="mb-0 text-truncate">{conv.mensaje}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={8}>
            {contacto ? (
              <Card className={styles.chatCard}>
                <Card.Header>
                  <strong>{contacto.contacto_nombre}</strong>
                  <small className="text-muted ms-2">- {contacto.objeto_titulo}</small>
                </Card.Header>
                <Card.Body className={styles.chatBody}>
                  {cargandoHistorial ? (
                    <div className="text-center py-4"><Spinner animation="border" size="sm" /></div>
                  ) : historial.length === 0 ? (
                    <p className="text-muted text-center py-4">No hay mensajes aún. Escribe el primero.</p>
                  ) : (
                    historial.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${styles.msg} ${msg.id_remitente === usuario.id ? styles.msgSent : styles.msgReceived}`}
                      >
                        <div className={styles.msgBubble}>
                          <p className="mb-0">{msg.mensaje}</p>
                          <small className={styles.msgTime}>
                            {new Date(msg.fecha).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </Card.Body>
                <Card.Footer>
                  <Form onSubmit={handleEnviar} className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Escribe un mensaje..."
                    />
                    <Button variant="primary" type="submit">Enviar</Button>
                  </Form>
                </Card.Footer>
              </Card>
            ) : (
              <div className={styles.noSelection}>
                <p>Selecciona una conversación</p>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};
