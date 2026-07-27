import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import styles from "./header.module.css";

export const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className={styles.navbar}>
            <Container>
                <Navbar.Brand as={Link} to="/" className={styles.brand}>CampusLost+</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navigation" />
                <Navbar.Collapse id="main-navigation">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        {token && <>
                            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/mis-objetos">Mis objetos</Nav.Link>
                            <Nav.Link as={Link} to="/favoritos">Favoritos</Nav.Link>
                        </>}
                    </Nav>
                    <Nav>
                        {token ? (
                            <div className={styles.userArea}>
                                <Link to="/dashboard" className={styles.user}>
                                    <span className={styles.avatar}>
                                        {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                    <span><small>Hola,</small><strong>{usuario?.nombre || "Usuario"}</strong></span>
                                </Link>
                                <button className={styles.logout} onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        ) : <>
                            <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
                            <Nav.Link as={Link} to="/registro">Registrarse</Nav.Link>
                        </>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
