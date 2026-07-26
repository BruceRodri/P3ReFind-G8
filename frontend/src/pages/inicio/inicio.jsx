import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { getObjetos, buscarObjetos } from "../../services/objetos_services";
import { getCategorias } from "../../services/categorias_services";
import { LostCard, FoundCard, SearchBar, CategoryCard } from "../../components";
import styles from "./inicio.module.css";

export const InicioPage = () => {
    const [objetos, setObjetos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);


    const cargarDatos = async () => {
        try {
            const [objData, catData] = await Promise.all([getObjetos(), getCategorias()]);
            setObjetos(objData);
            setCategorias(catData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (termino) => {
        try {
            const data = await buscarObjetos(termino);
            setObjetos(data);
        } catch (error) {
            console.error("Error en la búsqueda:", error);
        }
    };

    const handleCategoria = async (idCategoria) => {
        setFiltroCategoria(idCategoria);
    };

    const objetosFiltrados = filtroCategoria
        ? objetos.filter((obj) => obj.id_categoria === filtroCategoria)
        : objetos;

    if (loading) {
        return (
            <div className={styles.spinner}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container>
            <h1 className={styles.title}>Objetos Perdidos y Encontrados</h1>
            <SearchBar onSearch={handleSearch} />

            <div className={styles.categorias}>
                {categorias.map((cat) => (
                    <CategoryCard
                        key={cat.id}
                        categoria={cat}
                        onSeleccionar={handleCategoria}
                    />
                ))}
            </div>

            <Row>
                {objetosFiltrados.map((obj) => (
                    <Col key={obj.id} md={4} sm={6} xs={12}>
                        {obj.estado === "perdido" ? (
                            <LostCard objeto={obj} onVerDetalle={() => { }} />
                        ) : (
                            <FoundCard objeto={obj} onVerDetalle={() => { }} />
                        )}
                    </Col>
                ))}
            </Row>
        </Container>
    );
};