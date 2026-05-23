import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Spinner,
    Card,
    Badge,
    InputGroup
} from "react-bootstrap";

import { useSearchParams } from "react-router-dom";

import { supabase } from "../database/supabaseconfig";

import TarjetaCatalogo from "../../src/components/catalogo/TarjetaCatalogo";

const Catalogo = () => {

    const [searchParams] = useSearchParams();

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

    // =========================
    // LEER CATEGORÍA DESDE URL
    // =========================

    useEffect(() => {

        const categoriaDesdeURL = searchParams.get("categoria");

        if (categoriaDesdeURL) {
            setCategoriaFiltro(categoriaDesdeURL);
        }

    }, [searchParams]);

    // =========================
    // CARGAR PRODUCTOS
    // =========================

    useEffect(() => {

        cargarProductos();

    }, []);

    const cargarProductos = async () => {

        try {

            setLoading(true);

            // PRODUCTOS
            const { data: productosData, error: productosError } = await supabase
                .from("productos")
                .select("*")
                .order("id_producto", { ascending: false });

            if (productosError) throw productosError;

            // CATEGORÍAS
            const { data: categoriasData, error: categoriasError } = await supabase
                .from("categorias")
                .select("*")
                .order("nombre", { ascending: true });

            if (categoriasError) throw categoriasError;

            setProductos(productosData || []);
            setCategorias(categoriasData || []);

        } catch (error) {

            console.error("Error al cargar catálogo:", error);

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // FILTROS
    // =========================

    const productosFiltrados = productos.filter((producto) => {

        const coincideBusqueda =

            producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||

            producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

        const coincideCategoria =

            categoriaFiltro === "Todas" ||

            producto.categoria === categoriaFiltro;

        return coincideBusqueda && coincideCategoria;
    });

    return (

        <Container fluid className="margen-superior-main py-4 px-lg-5">

            {/* HERO */}

            <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-5">

                <div
                    style={{
                        background:
                            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)"
                    }}
                    className="text-white p-5"
                >

                    <Row className="align-items-center">

                        <Col lg={8}>

                            <Badge
                                bg="light"
                                text="dark"
                                className="rounded-pill px-3 py-2 mb-3 fw-semibold"
                            >
                                Catálogo Digital
                            </Badge>

                            <h1 className="fw-bold display-5 mb-3">

                                {categoriaFiltro !== "Todas"

                                    ? `Categoría: ${categoriaFiltro}`

                                    : "Explora Nuestro Catálogo"}

                            </h1>

                            <p
                                className="mb-0"
                                style={{
                                    fontSize: "1.1rem",
                                    opacity: 0.9
                                }}
                            >
                                Descubre productos organizados por categorías
                                con una experiencia moderna y profesional.
                            </p>

                        </Col>

                        <Col
                            lg={4}
                            className="text-center d-none d-lg-block"
                        >

                            <div
                                style={{
                                    fontSize: "7rem"
                                }}
                            >
                                🛒
                            </div>

                        </Col>

                    </Row>

                </div>

            </Card>

            {/* FILTROS */}

            <Card className="border-0 shadow-sm rounded-4 mb-5">

                <Card.Body className="p-4">

                    <Row className="g-3 align-items-center">

                        <Col lg={8}>

                            <InputGroup size="lg">

                                <InputGroup.Text className="bg-white border-end-0 rounded-start-4">
                                    🔍
                                </InputGroup.Text>

                                <Form.Control
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                    className="border-start-0 rounded-end-4 shadow-none"
                                />

                            </InputGroup>

                        </Col>

                        <Col lg={4}>

                            <Form.Select
                                value={categoriaFiltro}
                                onChange={(e) =>
                                    setCategoriaFiltro(e.target.value)
                                }
                                size="lg"
                                className="rounded-4 shadow-none"
                            >

                                <option value="Todas">
                                    Todas las categorías
                                </option>

                                {categorias.map((categoria) => (

                                    <option
                                        key={categoria.id}
                                        value={categoria.nombre}
                                    >
                                        {categoria.nombre}
                                    </option>

                                ))}

                            </Form.Select>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

            {/* ESTADÍSTICAS */}

            <Row className="g-4 mb-5">

                <Col md={4}>

                    <Card className="border-0 shadow-sm rounded-4 h-100">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Productos
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {productos.length}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        background: "rgba(59,130,246,0.12)",
                                        fontSize: "1.8rem"
                                    }}
                                >
                                    📦
                                </div>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

                <Col md={4}>

                    <Card className="border-0 shadow-sm rounded-4 h-100">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Categorías
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {categorias.length}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        background: "rgba(16,185,129,0.12)",
                                        fontSize: "1.8rem"
                                    }}
                                >
                                    🏷️
                                </div>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

                <Col md={4}>

                    <Card className="border-0 shadow-sm rounded-4 h-100">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Resultados
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {productosFiltrados.length}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        background: "rgba(234,179,8,0.12)",
                                        fontSize: "1.8rem"
                                    }}
                                >
                                    🔎
                                </div>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            {/* LOADING */}

            {loading ? (

                <div className="text-center py-5">

                    <Spinner
                        animation="border"
                        variant="primary"
                    />

                    <p className="mt-3 text-muted">
                        Cargando productos...
                    </p>

                </div>

            ) : (

                <>
                    {productosFiltrados.length > 0 ? (

                        <Row
                            xs={1}
                            sm={2}
                            md={2}
                            lg={3}
                            xl={4}
                            className="g-4"
                        >

                            {productosFiltrados.map((producto) => (

                                <Col key={producto.id_producto}>

                                    <TarjetaCatalogo
                                        producto={producto}
                                    />

                                </Col>

                            ))}

                        </Row>

                    ) : (

                        <Card className="border-0 shadow-sm rounded-4">

                            <Card.Body className="text-center py-5">

                                <div
                                    style={{
                                        fontSize: "5rem"
                                    }}
                                >
                                    🔍
                                </div>

                                <h3 className="fw-bold mt-3">
                                    No encontramos productos
                                </h3>

                                <p className="text-muted mb-0">

                                    {categoriaFiltro !== "Todas"

                                        ? `No existen productos en la categoría "${categoriaFiltro}"`

                                        : "Intenta con otra búsqueda o filtro"}

                                </p>

                            </Card.Body>

                        </Card>

                    )}
                </>

            )}

        </Container>
    );
};

export default Catalogo;