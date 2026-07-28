import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { register } from "../../services/auth_services";
import styles from "./registro.module.css";

export const RegistroPage = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!nombre || !correo || !password) {
            setError("Completa todos los campos");
            return;
        }

        setLoading(true);
        try {
            await register(nombre, correo, password);
            navigate("/login");
        } catch (err) {
            setError("Error al registrar. El correo ya puede estar en uso", err);
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
                    <h2 className={styles.title}>Crear una cuenta</h2>
                    <p className={styles.subtitle}>Únete a ReFind y ayuda a conectar objetos perdidos con sus dueños</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Nombre</Form.Label>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                placeholder="Tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                autoComplete="name"
                            />
                        </Form.Group>
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
                                autoComplete="new-password"
                            />
                        </Form.Group>
                        <Button type="submit" disabled={loading} className={styles.button}>
                            {loading ? "Registrando..." : "Registrarse"}
                        </Button>
                    </Form>
                    <p className={styles.link}>
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};
