import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TarjetaCatalogo from "../../src/components/catalogo/TarjetaCatalogo";
import FormularioRegistroProducto from "../../src/components/productos/FormularioRegistroProducto";
import ModalEdicionProducto from "../../src/components/productos/ModalEdicionProducto";
import ModalEliminacion from "../../src/components/productos/ModalEliminacionProducto";   // ← Nuevo

const Productos = () => {
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

    // Estados para los modales
    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [productoEditar, setProductoEditar] = useState(null);
    const [productoEliminar, setProductoEliminar] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Cargar productos
    useEffect(() => {
        const productosEjemplo = [
            { id: 1, nombre: "Café Molido Premium", precio: 150, categoria: "Bebidas", imagen: "https://http2.mlstatic.com/D_NQ_NP_706638-MCO82270894377_022025-O.webp", descripcion: "Café 100% arábica tostado nicaragüense" },
            { id: 2, nombre: "Arroz Integral 1LB", precio: 27, categoria: "Alimentos", imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop", descripcion: "Arroz integral de larga duración" },
            { id: 3, nombre: "Aceite de Oliva Extra Virgen", precio: 120, categoria: "Despensa", imagen: "https://tse1.mm.bing.net/th/id/OIP.t4wQKuIzZDUUTERtSad8CAHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3", descripcion: "Aceite de oliva importado 500ml" },
            { id: 4, nombre: "Leche en Polvo", precio: 20, categoria: "Lácteos", imagen: "https://tse4.mm.bing.net/th/id/OIP.1VpIWsny8P0GKOOkNOcsCwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3", descripcion: "Leche en polvo fortificada" },
            { id: 5, nombre: "Frijoles Rojos 1LB", precio: 45, categoria: "Alimentos", imagen: "https://tse3.mm.bing.net/th/id/OIP.zU6-X-TSiz-KSO3oqE1auwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3", descripcion: "Frijoles rojos seleccionados" },
            { id: 6, nombre: "Coca Cola Lata", precio: 30, categoria: "Bebidas", imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop", descripcion: "Refresco Coca Cola" },
            { id: 7, nombre: "Pasta Spaghetti 500g", precio: 30, categoria: "Despensa", imagen: "https://tse4.mm.bing.net/th/id/OIP.Wos-0g0qvUS2FV4bwKfGkQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", descripcion: "Pasta italiana de sémola" },
            { id: 8, nombre: "Jabón de Baño", precio: 30, categoria: "Limpieza", imagen: "https://tse1.mm.bing.net/th/id/OIP.dHNpk8eVy0ADxiM-QfyE-QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", descripcion: "Jabón corporal" },
            { id: 9, nombre: "Galletas María 400g", precio: 25, categoria: "Alimentos", imagen: "https://tse2.mm.bing.net/th/id/OIP.J5mDvU0Cim_lOm9ZHFsojQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", descripcion: "Galletas clásicas" },
            { id: 10, nombre: "Detergente Líquido 1L", precio: 70, categoria: "Limpieza", imagen: "https://tse3.mm.bing.net/th/id/OIP.L7HL0QG64ucur-USA-FssgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", descripcion: "Detergente para lavadora" }
        ];

        setTimeout(() => {
            setProductos(productosEjemplo);
            setLoading(false);
        }, 600);
    }, []);

    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda =
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());

        const coincideCategoria = categoriaFiltro === "Todas" ||
            producto.categoria === categoriaFiltro;

        return coincideBusqueda && coincideCategoria;
    });

    const agregarAlCarrito = (producto) => {
        alert(`✅ ${producto.nombre} agregado al carrito`);
    };

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/600x600/8B6F47/ffffff?text=Sin+Imagen";
    };

    // ==================== FUNCIONES DE MODALES ====================

    const handleNuevoProducto = () => {
        setShowRegistroModal(true);
    };

    const handleEditarProducto = (producto) => {
        setProductoEditar(producto);
        setShowEditModal(true);
    };

    const handleEliminarProducto = (producto) => {
        setProductoEliminar(producto);
        setShowDeleteModal(true);
    };

    // Guardar nuevo producto
    const handleGuardarNuevo = (nuevoProducto) => {
        setModalLoading(true);
        setTimeout(() => {
            const productoNuevo = {
                ...nuevoProducto,
                id: Date.now(),
                precio: parseFloat(nuevoProducto.precio) || 0
            };

            setProductos(prev => [...prev, productoNuevo]);
            alert("✅ Producto registrado correctamente");

            setShowRegistroModal(false);
            setModalLoading(false);
        }, 800);
    };

    // Guardar edición
    const handleGuardarEdicion = (datosEditados) => {
        setModalLoading(true);
        setTimeout(() => {
            setProductos(prev =>
                prev.map(p =>
                    p.id === productoEditar.id
                        ? { ...p, ...datosEditados, precio: parseFloat(datosEditados.precio) || p.precio }
                        : p
                )
            );
            alert("✅ Producto actualizado correctamente");

            setShowEditModal(false);
            setProductoEditar(null);
            setModalLoading(false);
        }, 800);
    };

    // Confirmar eliminación
    const handleConfirmarEliminacion = () => {
        setModalLoading(true);
        setTimeout(() => {
            setProductos(prev => prev.filter(p => p.id !== productoEliminar.id));
            alert("✅ Producto eliminado correctamente");

            setShowDeleteModal(false);
            setProductoEliminar(null);
            setModalLoading(false);
        }, 600);
    };

    return (
        <Container className="margen-superior-main py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="display-4 fw-bold text-dark mb-2">Todos los Productos</h1>
                    <p className="lead text-muted">Gestiona el inventario de tu pulpería</p>
                </div>

                <Button
                    variant="success"
                    size="lg"
                    className="shadow-sm px-4 d-flex align-items-center gap-2"
                    onClick={handleNuevoProducto}
                >
                    <span style={{ fontSize: "1.4rem" }}>+</span>
                    Nuevo Producto
                </Button>
            </div>

            {/* Buscador y Filtro */}
            <Row className="mb-5 justify-content-center">
                <Col lg={11}>
                    <div className="bg-white p-4 rounded-4 shadow border">
                        <Row className="g-3 align-items-end">
                            <Col md={7}>
                                <Form.Control
                                    type="text"
                                    placeholder="Busca por nombre o descripción..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    size="lg"
                                    className="shadow-sm"
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    value={categoriaFiltro}
                                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                                    size="lg"
                                    className="shadow-sm"
                                >
                                    <option value="Todas">Todas las categorías</option>
                                    <option value="Alimentos">Alimentos</option>
                                    <option value="Bebidas">Bebidas</option>
                                    <option value="Despensa">Despensa</option>
                                    <option value="Lácteos">Lácteos</option>
                                    <option value="Limpieza">Limpieza</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Button variant="primary" size="lg" className="w-100 fw-semibold shadow-sm">
                                    Buscar
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>

            {/* Lista de productos */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="lg" />
                    <p className="mt-3 text-muted">Cargando productos...</p>
                </div>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto) => (
                            <Col key={producto.id}>
                                <TarjetaCatalogo
                                    producto={producto}
                                    onEditar={() => handleEditarProducto(producto)}
                                    onEliminar={() => handleEliminarProducto(producto)}   // ← Nuevo
                                />
                            </Col>
                        ))
                    ) : (
                        <Col xs={12}>
                            <div className="text-center py-5 bg-light rounded-4">
                                <h4>No se encontraron productos</h4>
                                <p className="text-muted">Intenta cambiar tu búsqueda o filtro</p>
                            </div>
                        </Col>
                    )}
                </Row>
            )}

            {/* Modal Registro */}
            <FormularioRegistroProducto
                show={showRegistroModal}
                onHide={() => setShowRegistroModal(false)}
                onGuardar={handleGuardarNuevo}
                loading={modalLoading}
            />

            {/* Modal Edición */}
            <ModalEdicionProducto
                show={showEditModal}
                onHide={() => {
                    setShowEditModal(false);
                    setProductoEditar(null);
                }}
                producto={productoEditar}
                onGuardar={handleGuardarEdicion}
                loading={modalLoading}
            />

            {/* Modal Eliminación */}
            <ModalEliminacion
                show={showDeleteModal}
                onHide={() => {
                    setShowDeleteModal(false);
                    setProductoEliminar(null);
                }}
                item={productoEliminar}
                onConfirmar={handleConfirmarEliminacion}
                loading={modalLoading}
                tipo="producto"
            />
        </Container>
    );
};

export default Productos;