import { Container } from "react-bootstrap";
import styles from "./footer.module.css";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Container>
                <p>&copy; 2026 ReFind - Todos los derechos reservados</p>
            </Container>
        </footer>
    );
};