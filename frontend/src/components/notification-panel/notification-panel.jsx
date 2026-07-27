import { useState, useEffect, useRef } from "react";
import { Button, ListGroup, Badge, Nav } from "react-bootstrap";
import { getNotificaciones, getNoLeidas, leerTodas, leerNotificacion } from "../../services/notificaciones_services";
import styles from "./notification-panel.module.css";

export const NotificationPanel = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    cargarNoLeidas();
    const interval = setInterval(cargarNoLeidas, 15000);
    return () => clearInterval(interval);
  }, []);

  const cargarNoLeidas = async () => {
    try {
      const data = await getNoLeidas();
      setNoLeidas(data.count);
    } catch (error) { /* ignore */ }
  };

  const togglePanel = async () => {
    if (!show) {
      try {
        const data = await getNotificaciones();
        setNotificaciones(data);
      } catch (error) { /* ignore */ }
    }
    setShow(!show);
  };

  const handleLeerTodas = async () => {
    try {
      await leerTodas();
      setNoLeidas(0);
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
    } catch (error) { /* ignore */ }
  };

  const handleLeer = async (id) => {
    try {
      await leerNotificacion(id);
      setNotificaciones((prev) => prev.map((n) => n.id === id ? { ...n, leido: true } : n));
      setNoLeidas((prev) => Math.max(0, prev - 1));
    } catch (error) { /* ignore */ }
  };

  return (
    <div className={styles.container} ref={ref}>
      <Nav.Link className={styles.bell} onClick={togglePanel}>
        Notif
        {noLeidas > 0 && (
          <Badge bg="danger" pill className={styles.badge}>{noLeidas}</Badge>
        )}
      </Nav.Link>
      {show && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <strong>Notificaciones</strong>
            {noLeidas > 0 && (
              <Button variant="link" size="sm" onClick={handleLeerTodas}>
                Marcar todas como leídas
              </Button>
            )}
          </div>
          {notificaciones.length === 0 ? (
            <p className={styles.empty}>Sin notificaciones</p>
          ) : (
            <ListGroup variant="flush">
              {notificaciones.map((n) => (
                <ListGroup.Item
                  key={n.id}
                  className={`${styles.item} ${!n.leido ? styles.unread : ""}`}
                  onClick={() => handleLeer(n.id)}
                >
                  <div className="d-flex justify-content-between">
                    <small className={styles.time}>
                      {new Date(n.fecha).toLocaleString()}
                    </small>
                    {!n.leido && <Badge bg="primary" pill>Nueva</Badge>}
                  </div>
                  <p className="mb-0">{n.mensaje}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      )}
    </div>
  );
};
