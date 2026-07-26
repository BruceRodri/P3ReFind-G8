import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";

export const DashboardPage = () => {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario")) || {};

    return (
        <Container className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <Card className={styles.card}>
                <Card.Body>
                    <h3>Bienvenido, {usuario.nombre || "Usuario"}</h3>
                    <p>Correo: {usuario.correo || "N/A"}</p>
                    <p>Rol: {usuario.rol || "N/A"}</p>
                    <div className={styles.buttons}>
                        <Button variant="primary" onClick={() => navigate("/mis-objetos")}>
                            Mis Objetos
                        </Button>
                        <Button variant="warning" onClick={() => navigate("/favoritos")}>
                            Favoritos
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};