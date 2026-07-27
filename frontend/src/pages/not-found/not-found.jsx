import { Link } from "react-router-dom";
import styles from "./not-found.module.css";

export const NotFoundPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.code}>404</div>
            <h1 className={styles.title}>Pagina no encontrada</h1>
            <p className={styles.subtitle}>
                Lo sentimos, la pagina que buscas no existe o fue movida a otra ubicacion.
            </p>
            <Link to="/" className={styles.button}>Volver al inicio</Link>
        </div>
    );
};
