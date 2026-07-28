import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { login } from "../../services/auth_services";
import styles from "./login.module.css";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!correo || !password) {
            setError("Completa todos los campos");
            return;
        }

        setLoading(true);
        try {
            const data = await login(correo, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            navigate("/");
        } catch (err) {
            setError("Credenciales incorrectas", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className={styles.container}>
            <Card className={styles.card}>
                <Card.Body className={styles.cardBody}>
                    <div className={styles.logoWrapper}>
                        <img src="/favicon-128x128.png" alt="ReFind" className={styles.logo} />
                    </div>
                    <h2 className={styles.title}>Iniciar sesión</h2>
                    <p className={styles.subtitle}>Bienvenido de nuevo a ReFind</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Correo electrónico</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                autoComplete="email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Contraseña</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="password"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </Form.Group>
                        <Button type="submit" disabled={loading} className={styles.button}>
                            {loading ? "Ingresando..." : "Ingresar"}
                        </Button>
                    </Form>
                    <p className={styles.link}>
                        ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};
