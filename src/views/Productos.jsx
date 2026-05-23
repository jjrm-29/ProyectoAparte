import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Spinner,
    InputGroup,
    Card,
    Badge
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import FormularioRegistroProducto from "../../src/components/productos/FormularioRegistroProducto";
import ModalEdicionProducto from "../../src/components/productos/ModalEdicionProducto";
import ModalEliminacion from "../components/productos/ModalEliminacionProducto";

import TablaProductos from "../components/productos/TablaProductos";
import TarjetasProductos from "../components/productos/TarjetaProducto";

import NotificacionOperacion from "../components/NotificacionOperacion";
import Paginacion from "../components/ordenamiento/Paginacion";

const Productos = () => {

    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    const [categorias, setCategorias] = useState([]);

    const [loading, setLoading] = useState(true);

    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [productoEditar, setProductoEditar] = useState(null);
    const [productoEliminar, setProductoEliminar] = useState(null);

    const [modalLoading, setModalLoading] = useState(false);

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: "",
    });

    const [paginaActual, setPaginaActual] = useState(1);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(8);

    useEffect(() => {
        cargarProductos();
    }, []);

    // =========================
    // CARGAR PRODUCTOS
    // =========================

    const cargarProductos = async () => {

        try {

            setLoading(true);

            const { data, error } = await supabase
                .from("productos")
                .select("*")
                .order("id_producto", { ascending: false });

            if (error) throw error;

            const productosMapeados = data.map((p) => ({
                id_producto: p.id_producto,
                nombre: p.nombre,
                descripcion: p.descripcion,
                precio: p.precio,
                categoria: p.categoria,
                stock: p.stock,
                imagen: p.imagen,
            }));

            setProductos(productosMapeados);
            setProductosFiltrados(productosMapeados);

            // =========================
            // CATEGORÍAS DINÁMICAS
            // =========================

            const categoriasUnicas = [
                ...new Set(
                    productosMapeados
                        .map((p) => p.categoria)
                        .filter(Boolean)
                )
            ];

            setCategorias(categoriasUnicas);

        } catch (err) {

            console.error("Error al cargar productos:", err);

            setToast({
                mostrar: true,
                mensaje: "Error al cargar productos",
                tipo: "error",
            });

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // FILTROS
    // =========================

    useEffect(() => {

        const filtrados = productos.filter((producto) => {

            const coincideBusqueda =

                producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||

                producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

            const coincideCategoria =

                categoriaFiltro === "Todas" ||

                producto.categoria === categoriaFiltro;

            return coincideBusqueda && coincideCategoria;

        });

        setProductosFiltrados(filtrados);
        setPaginaActual(1);

    }, [busqueda, categoriaFiltro, productos]);

    // =========================
    // PAGINACIÓN
    // =========================

    const productosPaginados = productosFiltrados.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );

    return (

        <Container fluid className="margen-superior-main py-4 px-lg-5">

            {/* HERO */}

            <div
                className="rounded-4 p-4 p-lg-5 mb-5 text-white shadow-lg"
                style={{
                    background:
                        "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)"
                }}
            >

                <Row className="align-items-center">

                    <Col lg={8}>

                        <Badge
                            bg="light"
                            text="dark"
                            className="mb-3 px-3 py-2 rounded-pill fw-semibold"
                        >
                            Inventario Digital
                        </Badge>

                        <h1 className="display-5 fw-bold mb-3">
                            Gestión de Productos
                        </h1>

                        <p
                            className="lead mb-0"
                            style={{
                                opacity: 0.9
                            }}
                        >
                            Administra el inventario de tu pulpería
                            de manera rápida y profesional.
                        </p>

                    </Col>

                    <Col
                        lg={4}
                        className="text-lg-end text-center mt-4 mt-lg-0"
                    >

                        <Button
                            variant="light"
                            size="lg"
                            className="fw-bold rounded-4 px-4 shadow-sm"
                            onClick={() => setShowRegistroModal(true)}
                        >
                            ➕ Nuevo Producto
                        </Button>

                    </Col>

                </Row>

            </div>

            {/* FILTROS */}

            <Card className="border-0 shadow-sm rounded-4 mb-5">

                <Card.Body className="p-4">

                    <Row className="g-3 align-items-center">

                        <Col lg={7}>

                            <InputGroup size="lg">

                                <InputGroup.Text className="bg-white border-end-0 rounded-start-4">
                                    🔍
                                </InputGroup.Text>

                                <Form.Control
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                    className="border-start-0 shadow-none rounded-end-4"
                                />

                            </InputGroup>

                        </Col>

                        <Col lg={3}>

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

                                {categorias.map((categoria, index) => (

                                    <option
                                        key={index}
                                        value={categoria}
                                    >
                                        {categoria}
                                    </option>

                                ))}

                            </Form.Select>

                        </Col>

                        <Col lg={2}>

                            <Button
                                variant="primary"
                                size="lg"
                                className="w-100 rounded-4 fw-semibold shadow-sm"
                                onClick={() => {
                                    setBusqueda("");
                                    setCategoriaFiltro("Todas");
                                }}
                            >
                                Limpiar
                            </Button>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

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
                    <div className="d-none d-md-block">

                        <div className="bg-white rounded-4 shadow-sm border overflow-hidden">

                            <div className="p-4 border-bottom">

                                <h4 className="fw-bold mb-1">
                                    Inventario de Productos
                                </h4>

                                <p className="text-muted mb-0">
                                    {productosFiltrados.length} productos encontrados
                                </p>

                            </div>

                            <div className="table-responsive">

                                <TablaProductos
                                    productos={productosPaginados}
                                    abrirModalEdicion={(producto) => {
                                        setProductoEditar(producto);
                                        setShowEditModal(true);
                                    }}
                                    abrirModalEliminacion={(producto) => {
                                        setProductoEliminar(producto);
                                        setShowDeleteModal(true);
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    {/* MOBILE */}

                    <div className="d-block d-md-none">

                        <TarjetasProductos
                            productos={productosPaginados}
                            categorias={categorias}
                            abrirModalEdicion={(producto) => {
                                setProductoEditar(producto);
                                setShowEditModal(true);
                            }}
                            abrirModalEliminacion={(producto) => {
                                setProductoEliminar(producto);
                                setShowDeleteModal(true);
                            }}
                        />

                    </div>

                    <div className="mt-5">

                        <Paginacion
                            registrosPorPagina={registrosPorPagina}
                            totalRegistros={productosFiltrados.length}
                            paginaActual={paginaActual}
                            establecerPaginaActual={setPaginaActual}
                            establecerRegistrosPorPagina={setRegistrosPorPagina}
                        />

                    </div>

                </>

            )}

            {/* MODALES */}

            <FormularioRegistroProducto
                show={showRegistroModal}
                onHide={() => setShowRegistroModal(false)}
                onGuardar={() => {}}
                loading={modalLoading}
            />

            <ModalEdicionProducto
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                producto={productoEditar}
                onGuardar={() => {}}
                loading={modalLoading}
            />

            <ModalEliminacion
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                item={productoEliminar}
                onConfirmar={() => {}}
                loading={modalLoading}
                tipo="producto"
            />

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() =>
                    setToast({
                        ...toast,
                        mostrar: false
                    })
                }
            />

        </Container>
    );
};

export default Productos;