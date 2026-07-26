import { Card, Badge, Button } from "react-bootstrap";
import styles from "./found-card.module.css";

export const FoundCard = ({ objeto, onVerDetalle }) => {
    return (
        <Card className={styles.card}>
            {objeto.imagen && (
                <Card.Img variant="top" src={objeto.imagen} className={styles.cardImg} />
            )}
            <Card.Body>
                <Card.Title>{objeto.titulo}</Card.Title>
                <Card.Text>{objeto.descripcion}</Card.Text>
                <Badge bg="success" className={styles.badge}>Encontrado</Badge>
                <Card.Text><small>📍 {objeto.ubicacion}</small></Card.Text>
                <Card.Text><small>📁 {objeto.categoria}</small></Card.Text>
                <Button variant="success" onClick={() => onVerDetalle(objeto)}>
                    Ver Detalle
                </Button>
            </Card.Body>
        </Card>
    );
};