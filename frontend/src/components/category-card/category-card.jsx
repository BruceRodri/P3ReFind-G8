import { Card } from "react-bootstrap";
import styles from "./category-card.module.css";

export const CategoryCard = ({ categoria, onSeleccionar }) => {
    return (
        <Card
            className={styles.card}
            onClick={() => onSeleccionar(categoria.id)}
        >
            <Card.Body>
                <Card.Title>{categoria.nombre}</Card.Title>
            </Card.Body>
        </Card>
    );
};