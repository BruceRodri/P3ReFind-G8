import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getObjetos, buscarObjetos } from "../../services/objetos_services";
import { getCategorias } from "../../services/categorias_services";
import { LostCard, FoundCard, SearchBar, CategoryCard } from "../../components";
import heroImage from "../../assets/hero.png";
import styles from "./inicio.module.css";

export const InicioPage = () => {
    const [objetos, setObjetos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState(null);

    useEffect(() => {
        Promise.all([getObjetos(), getCategorias()])
            .then(([objData, catData]) => { setObjetos(objData); setCategorias(catData); })
            .catch((error) => console.error("Error al cargar datos:", error))
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = async (termino) => {
        try { setObjetos(await buscarObjetos(termino)); }
        catch (error) { console.error("Error en la búsqueda:", error); }
    };

    const objetosFiltrados = filtroCategoria
        ? objetos.filter((obj) => obj.id_categoria === filtroCategoria)
        : objetos;

    if (loading) return <div className={styles.spinner}><Spinner animation="border" /></div>;

    return (
        <>
            <section className={styles.hero}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <span className={styles.eyebrow}>La comunidad que conecta y ayuda</span>
                            <h1>¿Perdiste algo en el campus? <em>Podemos encontrarlo juntos.</em></h1>
                            <p>CampusLost+ conecta a estudiantes que perdieron un objeto con quienes lo encontraron. Publica, busca y ayuda a que cada pertenencia vuelva a su dueño.</p>
                            <div className={styles.actions}>
                                <Link to="/registro" className={styles.primaryButton}>Publicar un objeto</Link>
                                <a href="#publicaciones" className={styles.secondaryButton}>Explorar publicaciones</a>
                            </div>
                            <div className={styles.trust}><span>✓ Fácil de usar</span><span>✓ Comunidad segura</span><span>✓ Totalmente gratis</span></div>
                        </Col>
                        <Col lg={5} className={styles.heroVisual}>
                            <div className={styles.imageGlow}></div>
                            
                            <div className={`${styles.floatingCard} ${styles.found}`}><span>✓</span><div><small>Objeto encontrado</small><strong>Mochila recuperada</strong></div></div>
                            <div className={`${styles.floatingCard} ${styles.community}`}><span>♥</span><div><strong>Una comunidad</strong><small>que se ayuda</small></div></div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className={styles.howItWorks}>
                <Container>
                    <div className={styles.sectionHeading}><span>ASÍ DE SIMPLE</span><h2>Recupera lo que perdiste en tres pasos</h2><p>Nosotros facilitamos el encuentro; la comunidad hace el resto.</p></div>
                    <div className={styles.steps}>
                        <article><b>1</b><div className={styles.stepIcon}>⌕</div><h3>Busca</h3><p>Revisa las publicaciones o filtra por categoría para encontrar tu objeto.</p></article>
                        <article><b>2</b><div className={styles.stepIcon}>＋</div><h3>Publica</h3><p>Describe lo que perdiste o encontraste e incluye todos los detalles útiles.</p></article>
                        <article><b>3</b><div className={styles.stepIcon}>⌁</div><h3>Conecta</h3><p>Contacta con la persona indicada y coordina una devolución segura.</p></article>
                    </div>
                </Container>
            </section>

            <section id="publicaciones" className={styles.explore}>
                <Container>
                    <div className={styles.sectionHeading}><span>EXPLORA EL CAMPUS</span><h2>¿Qué estás buscando?</h2><p>Busca por nombre o selecciona una categoría.</p></div>
                    <div className={styles.search}><SearchBar onSearch={handleSearch} /></div>
                    <div className={styles.categorias}>
                        <button className={`${styles.allCategory} ${!filtroCategoria ? styles.active : ""}`} onClick={() => setFiltroCategoria(null)}>Todos</button>
                        {categorias.map((cat) => <CategoryCard key={cat.id} categoria={cat} onSeleccionar={setFiltroCategoria} />)}
                    </div>
                    <div className={styles.resultsHeader}>
                        <div><span>PUBLICACIONES RECIENTES</span><h2>Objetos de la comunidad</h2></div>
                        <strong>{objetosFiltrados.length} resultado{objetosFiltrados.length === 1 ? "" : "s"}</strong>
                    </div>
                    {objetosFiltrados.length ? (
                        <Row>{objetosFiltrados.map((obj) => (
                            <Col key={obj.id} lg={4} md={6} xs={12}>
                                {obj.estado === "perdido" ? <LostCard objeto={obj} onVerDetalle={() => {}} /> : <FoundCard objeto={obj} onVerDetalle={() => {}} />}
                            </Col>
                        ))}</Row>
                    ) : <div className={styles.empty}><span>⌕</span><h3>No encontramos publicaciones</h3><p>Prueba otra búsqueda o selecciona una categoría diferente.</p></div>}
                </Container>
            </section>
        </>
    );
};
