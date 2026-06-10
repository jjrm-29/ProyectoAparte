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
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";
import { resolverImagenProducto } from "../utils/imagen";

import FormularioRegistroProducto from "../components/productos/FormularioRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacion from "../components/productos/ModalEliminacionProducto";
import PageHero from "../components/navegacion/PageHero";

import TablaProductos from "../components/productos/TablaProductos";
import TarjetasProductos from "../components/productos/TarjetaProducto";

import NotificacionOperacion from "../components/NotificacionOperacion";
import Paginacion from "../components/ordenamiento/Paginacion";

const Productos = () => {

    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [productoEditar, setProductoEditar] = useState(null);
    const [productoEliminar, setProductoEliminar] = useState(null);

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

    const cargarProductos = async () => {
        try {
            setLoading(true);

            const [{ data, error }, { data: catsData }] = await Promise.all([
                supabase
                    .from("productos")
                    .select("*")
                    .order("id_producto", { ascending: false }),
                supabase
                    .from("categorias")
                    .select("nombre")
                    .order("nombre"),
            ]);

            if (error) throw error;

            const productosMapeados = (data || []).map((p) => ({
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

            const nombresCategorias = (catsData || []).map((c) => c.nombre).filter(Boolean);
            const categoriasUnicas = [
                ...new Set(productosMapeados.map((p) => p.categoria).filter(Boolean)),
            ];

            setCategorias(nombresCategorias.length ? nombresCategorias : categoriasUnicas);

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

    const productosPaginados = productosFiltrados.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );

    const guardarProducto = async (datos) => {
        try {
            setGuardando(true);

            const imagen = await resolverImagenProducto(datos);

            const { error } = await supabase.from("productos").insert([
                {
                    nombre: datos.nombre.trim(),
                    descripcion: datos.descripcion?.trim() || "",
                    precio: parseFloat(datos.precio),
                    categoria: datos.categoria,
                    stock: parseInt(datos.stock, 10) || 0,
                    imagen,
                },
            ]);

            if (error) throw error;

            await cargarProductos();

            setToast({
                mostrar: true,
                mensaje: "Producto registrado correctamente",
                tipo: "exito",
            });

            setShowRegistroModal(false);
        } catch (err) {
            console.error("Error al registrar producto:", err);
            setToast({
                mostrar: true,
                mensaje: err.message || "Error al registrar producto",
                tipo: "error",
            });
        } finally {
            setGuardando(false);
        }
    };

    const actualizarProducto = async (datos) => {
        if (!productoEditar) return;

        try {
            setGuardando(true);

            const imagen = await resolverImagenProducto(datos, productoEditar.imagen);

            const { error } = await supabase
                .from("productos")
                .update({
                    nombre: datos.nombre.trim(),
                    descripcion: datos.descripcion?.trim() || "",
                    precio: parseFloat(datos.precio),
                    categoria: datos.categoria,
                    stock: parseInt(datos.stock, 10) || 0,
                    imagen,
                })
                .eq("id_producto", productoEditar.id_producto);

            if (error) throw error;

            await cargarProductos();

            setToast({
                mostrar: true,
                mensaje: "Producto actualizado correctamente",
                tipo: "exito",
            });

            setShowEditModal(false);
            setProductoEditar(null);
        } catch (err) {
            console.error("Error al actualizar producto:", err);
            setToast({
                mostrar: true,
                mensaje: err.message || "Error al actualizar producto",
                tipo: "error",
            });
        } finally {
            setGuardando(false);
        }
    };

    const eliminarProducto = async () => {
        if (!productoEliminar) return;

        try {
            setGuardando(true);

            const { error } = await supabase
                .from("productos")
                .delete()
                .eq("id_producto", productoEliminar.id_producto);

            if (error) throw error;

            await cargarProductos();

            setToast({
                mostrar: true,
                mensaje: "Producto eliminado correctamente",
                tipo: "exito",
            });

            setShowDeleteModal(false);
            setProductoEliminar(null);
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            setToast({
                mostrar: true,
                mensaje: err.message || "Error al eliminar producto",
                tipo: "error",
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Container fluid="lg" className="px-0 view-page">

            <PageHero
                kicker="Inventario digital"
                title="Gestión de Productos"
                subtitle="Administra el inventario de tu pulpería de manera rápida y profesional."
                action={
                    <Button
                        variant="light"
                        size="lg"
                        className="btn-hero-cta fw-bold rounded-pill px-4 btn-interactive"
                        onClick={() => setShowRegistroModal(true)}
                    >
                        <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                        Nuevo producto
                    </Button>
                }
            />

            <Card className="view-filter-card animate-scale-in mb-4">
                <Card.Body className="p-4">
                    <Row className="g-3 align-items-center">
                        <Col lg={7}>
                            <InputGroup size="lg">
                                <InputGroup.Text className="border-end-0 rounded-start-4">
                                    <i className="bi bi-search" aria-hidden="true" />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar producto…"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="border-start-0 shadow-none rounded-end-4"
                                />
                            </InputGroup>
                        </Col>

                        <Col lg={3}>
                            <Form.Select
                                value={categoriaFiltro}
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                                size="lg"
                                className="rounded-4 shadow-none"
                            >
                                <option value="Todas">Todas las categorías</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria} value={categoria}>
                                        {categoria}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col lg={2}>
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-100 rounded-pill fw-semibold btn-interactive"
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

            {loading ? (
                <div className="text-center py-5 fade-in">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted loading-pulse">Cargando productos…</p>
                </div>
            ) : (
                <>
                    <div className="d-none d-md-block animate-fade-right">
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

            <FormularioRegistroProducto
                show={showRegistroModal}
                onHide={() => setShowRegistroModal(false)}
                onGuardar={guardarProducto}
                loading={guardando}
                categorias={categorias}
            />

            <ModalEdicionProducto
                key={productoEditar?.id_producto ?? "edicion"}
                show={showEditModal}
                onHide={() => {
                    setShowEditModal(false);
                    setProductoEditar(null);
                }}
                producto={productoEditar}
                onGuardar={actualizarProducto}
                loading={guardando}
                categorias={categorias}
            />

            <ModalEliminacion
                show={showDeleteModal}
                onHide={() => {
                    setShowDeleteModal(false);
                    setProductoEliminar(null);
                }}
                item={productoEliminar}
                onConfirmar={eliminarProducto}
                loading={guardando}
                tipo="producto"
            />

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() => setToast({ ...toast, mostrar: false })}
            />
        </Container>
    );
};

export default Productos;
