import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Pagination, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getObjetos, getTotalObjetos, buscarObjetos, getEstadisticas } from "../../services/objetos_services";
import { getCategorias } from "../../services/categorias_services";
import { LostCard, FoundCard, SearchBar, CategoryCard } from "../../components";
import styles from "./inicio.module.css";

const LIMIT = 12;

export const InicioPage = () => {
    const [objetos, setObjetos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroFecha, setFiltroFecha] = useState("todos");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [buscando, setBuscando] = useState(false);

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    useEffect(() => {
        if (!buscando) cargarObjetos();
    }, [page]);

    const cargarDatosIniciales = async () => {
        setLoading(true);
        try {
            const [catData, statsData] = await Promise.all([
                getCategorias(),
                getEstadisticas(),
            ]);
            setCategorias(catData);
            setEstadisticas(statsData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
        cargarObjetos();
    };

    const cargarObjetos = async () => {
        try {
            const [objData, totalData] = await Promise.all([
                getObjetos(page, LIMIT),
                getTotalObjetos(),
            ]);
            setObjetos(objData);
            setTotal(totalData);
        } catch (error) {
            console.error("Error al cargar objetos:", error);
        }
    };

    const handleSearch = async (termino) => {
        if (!termino) {
            setBuscando(false);
            setPage(1);
            cargarObjetos();
            return;
        }
        setBuscando(true);
        try { setObjetos(await buscarObjetos(termino)); }
        catch (error) { console.error("Error en la búsqueda:", error); }
    };

    const recargarObjetos = () => {
        if (!buscando) cargarObjetos();
    };

    const aplicarFiltros = () => {
        let filtrados = [...objetos];

        if (filtroCategoria) {
            filtrados = filtrados.filter((obj) => obj.id_categoria === filtroCategoria);
        }
        if (filtroEstado !== "todos") {
            filtrados = filtrados.filter((obj) => obj.estado === filtroEstado);
        }
        if (filtroFecha !== "todos") {
            const ahora = new Date();
            let inicio;
            if (filtroFecha === "hoy") {
                inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
            } else if (filtroFecha === "semana") {
                inicio = new Date(ahora);
                inicio.setDate(inicio.getDate() - 7);
            } else if (filtroFecha === "mes") {
                inicio = new Date(ahora);
                inicio.setMonth(inicio.getMonth() - 1);
            }
            filtrados = filtrados.filter((obj) => new Date(obj.fecha) >= inicio);
        }

        return filtrados;
    };

    const objetosFiltrados = aplicarFiltros();
    const totalPages = Math.ceil(total / LIMIT);

    if (loading) return <div className={styles.spinner}><Spinner animation="border" /></div>;

    return (
        <>
            <section className={styles.hero}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <span className={styles.eyebrow}>La comunidad que conecta y ayuda</span>
                            <h1>¿Perdiste algo en el campus? <em>Podemos encontrarlo juntos.</em></h1>
                            <p>ReFind conecta a estudiantes que perdieron un objeto con quienes lo encontraron. Publica, busca y ayuda a que cada pertenencia vuelva a su dueño.</p>
                            <div className={styles.actions}>
                                <Link to="/registro" className={styles.primaryButton}>Publicar un objeto</Link>
                                <a href="#publicaciones" className={styles.secondaryButton}>Explorar publicaciones</a>
                            </div>
                            <div className={styles.trust}><span>Fácil de usar</span><span>Comunidad segura</span><span>Totalmente gratis</span></div>
                        </Col>
                        <Col lg={5} className={styles.heroVisual}>
                            <div className={styles.imageGlow}></div>
                            <div className={`${styles.floatingCard} ${styles.found}`}><span>!</span><div><small>Objeto encontrado</small><strong>Mochila recuperada</strong></div></div>
                            <div className={`${styles.floatingCard} ${styles.community}`}><span>+</span><div><strong>Una comunidad</strong><small>que se ayuda</small></div></div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {estadisticas && (
                <section className={styles.stats}>
                    <Container>
                        <Row>
                            <Col md={3} xs={6} className="mb-3">
                                <div className={styles.statCard}>
                                    <h3>{estadisticas.total}</h3>
                                    <p>Objetos publicados</p>
                                </div>
                            </Col>
                            <Col md={3} xs={6} className="mb-3">
                                <div className={styles.statCard}>
                                    <h3>{estadisticas.perdidos}</h3>
                                    <p>Perdidos</p>
                                </div>
                            </Col>
                            <Col md={3} xs={6} className="mb-3">
                                <div className={styles.statCard}>
                                    <h3>{estadisticas.encontrados}</h3>
                                    <p>Encontrados</p>
                                </div>
                            </Col>
                            <Col md={3} xs={6} className="mb-3">
                                <div className={styles.statCard}>
                                    <h3>{estadisticas.usuariosActivos}</h3>
                                    <p>Usuarios activos</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            )}

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

                    <div className={styles.filters}>
                        <div className={styles.categorias}>
                            <button className={`${styles.allCategory} ${!filtroCategoria ? styles.active : ""}`} onClick={() => setFiltroCategoria(null)}>Todos</button>
                            {categorias.filter((cat) => cat.nombre !== "Otros").map((cat) => <CategoryCard key={cat.id} categoria={cat} onSeleccionar={setFiltroCategoria} />)}
                        </div>
                        <div className={styles.filterRow}>
                            <Form.Select
                                className={styles.filterSelect}
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="perdido">Perdido</option>
                                <option value="encontrado">Encontrado</option>
                            </Form.Select>
                            <Form.Select
                                className={styles.filterSelect}
                                value={filtroFecha}
                                onChange={(e) => setFiltroFecha(e.target.value)}
                            >
                                <option value="todos">Todas las fechas</option>
                                <option value="hoy">Hoy</option>
                                <option value="semana">Última semana</option>
                                <option value="mes">Último mes</option>
                            </Form.Select>
                        </div>
                    </div>

                    <div className={styles.resultsHeader}>
                        <div><span>PUBLICACIONES</span><h2>Objetos de la comunidad</h2></div>
                        <strong>{objetosFiltrados.length} resultado{objetosFiltrados.length === 1 ? "" : "s"}</strong>
                    </div>
                    {objetosFiltrados.length ? (
                        <>
                            <Row>{objetosFiltrados.map((obj) => (
                                <Col key={obj.id} lg={4} md={6} xs={12}>
                                    {obj.estado === "perdido" ? <LostCard objeto={obj} onVerDetalle={() => {}} onEncontrado={recargarObjetos} /> : <FoundCard objeto={obj} onVerDetalle={() => {}} />}
                                </Col>
                            ))}</Row>
                            {!buscando && totalPages > 1 && (
                                <Pagination className="justify-content-center mt-4">
                                    <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
                                            {p}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
                                </Pagination>
                            )}
                        </>
                    ) : <div className={styles.empty}><span>!</span><h3>No encontramos publicaciones</h3><p>Prueba otra búsqueda o selecciona una categoría diferente.</p></div>}
                </Container>
            </section>
        </>
    );
};
