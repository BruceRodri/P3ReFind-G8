import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Row, Col, Spinner, Badge, Button } from "react-bootstrap";
import { getPerfil } from "../../services/perfil_services";
import styles from "./perfil.module.css";

export const PerfilPage = () => {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    if (id) {
      setLoading(true);
      getPerfil(id)
        .then(setPerfil)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <Container className={styles.container}>
        <div className="text-center py-5"><Spinner animation="border" /></div>
      </Container>
    );
  }

  if (!perfil) {
    return (
      <Container className={styles.container}>
        <h1>Usuario no encontrado</h1>
        <Link to="/">Volver al inicio</Link>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <Link to="/" className={styles.back}>← Volver al inicio</Link>
      <Card className={styles.card}>
        <Card.Body className="text-center">
          <div className={styles.avatar}>
            {perfil.nombre?.charAt(0).toUpperCase() || "?"}
          </div>
          <h2 className={styles.name}>{perfil.nombre}</h2>
          <p className={styles.email}>{perfil.correo}</p>
          <Badge bg={perfil.rol === "ADMIN" ? "warning" : "info"} className="mb-3">
            {perfil.rol}
          </Badge>
          <Row className="mt-4">
            <Col>
              <h3 className={styles.statNumber}>{perfil.totalObjetos}</h3>
              <p className={styles.statLabel}>Objetos publicados</p>
            </Col>
            <Col>
              <h3 className={styles.statNumber}>{perfil.encontrados}</h3>
              <p className={styles.statLabel}>Encontrados</p>
            </Col>
            <Col>
              <h3 className={styles.statNumber}>{perfil.totalObjetos - perfil.encontrados}</h3>
              <p className={styles.statLabel}>Perdidos</p>
            </Col>
          </Row>
          {usuario.id === perfil.id && (
            <Link to="/mis-objetos">
              <Button variant="primary" className="mt-3">Mis Objetos</Button>
            </Link>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
