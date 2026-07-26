import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { getFavoritos } from "../../services/favoritos_services";
import { LostCard, FoundCard } from "../../components";
import styles from "./favoritos.module.css";

export const FavoritosPage = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarFavoritos();
    }, []);

    const cargarFavoritos = async () => {
        try {
            const data = await getFavoritos();
            setFavoritos(data);
        } catch (error) {
            console.error("Error al cargar favoritos:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.spinner}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container>
            <h1 className={styles.title}>Mis Favoritos</h1>
            {favoritos.length === 0 ? (
                <p className={styles.empty}>No tienes favoritos aún.</p>
            ) : (
                <Row>
                    {favoritos.map((obj) => (
                        <Col key={obj.id} md={4} sm={6} xs={12}>
                            {obj.estado === "perdido" ? (
                                <LostCard objeto={obj} onVerDetalle={() => { }} />
                            ) : (
                                <FoundCard objeto={obj} onVerDetalle={() => { }} />
                            )}
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};