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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

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
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
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
                Marcar todas como leidas
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
