import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import styles from "./header.module.css";

export const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className={styles.navbar}>
            <Container>
                <Navbar.Brand as={Link} to="/" className={styles.brand}>
                    CampusLost+
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Inicio
                        </Nav.Link>
                        {token && (
                            <>
                                <Nav.Link as={Link} to="/dashboard">
                                    Dashboard
                                </Nav.Link>
                                <Nav.Link as={Link} to="/mis-objetos">
                                    Mis Objetos
                                </Nav.Link>
                                <Nav.Link as={Link} to="/favoritos">
                                    Favoritos
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {token ? (
                            <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">
                                    Iniciar Sesión
                                </Nav.Link>
                                <Nav.Link as={Link} to="/registro">
                                    Registrarse
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};