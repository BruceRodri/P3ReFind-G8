import { Container } from "react-bootstrap";
import styles from "./footer.module.css";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.footerInner}>
                    <div className={styles.footerBrand}>
                        <img src="/favicon-128x128.png" alt="ReFind" />
                        ReFind
                    </div>
                    <p className={styles.footerText}>
                        Conectando a la comunidad universitaria para recuperar pertenencias perdidas.
                    </p>
                    <p className={styles.footerBottom}>&copy; 2026 ReFind. Todos los derechos reservados.</p>
                </div>
            </Container>
        </footer>
    );
};
