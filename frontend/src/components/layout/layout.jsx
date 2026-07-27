import { Header } from "../header";
import { Footer } from "../footer";
import styles from "./layout.module.css";

export const Layout = ({ children }) => {
    return (
        <div className={styles.wrapper}>
            <Header />
            <main className={styles.main}>{children}</main>
            <Footer />
        </div>
    );
};
