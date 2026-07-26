import { Card, Badge, Button } from "react-bootstrap";
import styles from "./lost-card.module.css";

export const LostCard = ({ objeto, onVerDetalle }) => {
    return (
        <Card className={styles.card}>
            {objeto.imagen && (
                <Card.Img variant="top" src={objeto.imagen} className={styles.cardImg} />
            )}
            <Card.Body>
                <Card.Title>{objeto.titulo}</Card.Title>
                <Card.Text>{objeto.descripcion}</Card.Text>
                <Badge bg="danger" className={styles.badge}>Perdido</Badge>
                <Card.Text><small>📍 {objeto.ubicacion}</small></Card.Text>
                <Card.Text><small>📁 {objeto.categoria}</small></Card.Text>
                <Button variant="primary" onClick={() => onVerDetalle(objeto)}>
                    Ver Detalle
                </Button>
            </Card.Body>
        </Card>
    );
};