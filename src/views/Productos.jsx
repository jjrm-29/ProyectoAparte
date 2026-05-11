import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Spinner
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { supabase } from "../database/supabaseconfig";

import FormularioRegistroProducto from "../../src/components/productos/FormularioRegistroProducto";
import ModalEdicionProducto from "../../src/components/productos/ModalEdicionProducto";
import ModalEliminacion from "../components/productos/ModalEliminacionProducto";

import TablaProductos from "../components/productos/TablaProductos";
import TarjetasProductos from "../components/productos/TarjetaProducto";

import NotificacionOperacion from "../components/NotificacionOperacion";
import Paginacion from "../components/ordenamiento/Paginacion";

const Productos = () => {

    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);

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

    const cargarProductos = async () => {

        try {

            const { data, error } = await supabase
                .from("productos")
                .select("*")
                .order("id_producto", { ascending: true });

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

        let filtrados = productos.filter((producto) => {

            const coincideBusqueda =
                producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

            const coincideCategoria =
                categoriaFiltro === "Todas" ||
                producto.categoria === categoriaFiltro;

            return coincideBusqueda && coincideCategoria;
        });

        setProductosFiltrados(filtrados);

    }, [busqueda, categoriaFiltro, productos]);

    const productosPaginados = productosFiltrados.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );

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

    const handleGuardarNuevo = async (nuevoProducto) => {

        try {

            setModalLoading(true);

            let urlImagen = "";

            if (nuevoProducto.archivo) {

                const nombreArchivo =
                    `${Date.now()}_${nuevoProducto.archivo.name}`;

                const { error: uploadError } = await supabase.storage
                    .from("imagenes_productos")
                    .upload(nombreArchivo, nuevoProducto.archivo);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("imagenes_productos")
                    .getPublicUrl(nombreArchivo);

                urlImagen = data.publicUrl;
            }

            const { error } = await supabase
                .from("productos")
                .insert([
                    {
                        nombre: nuevoProducto.nombre,
                        precio: parseFloat(nuevoProducto.precio),
                        stock: parseInt(nuevoProducto.stock),
                        categoria: nuevoProducto.categoria,
                        descripcion: nuevoProducto.descripcion,
                        imagen: urlImagen,
                    },
                ]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Producto registrado correctamente",
                tipo: "exito",
            });

            setShowRegistroModal(false);

            await cargarProductos();

        } catch (err) {

            console.error("Error al registrar:", err);

            setToast({
                mostrar: true,
                mensaje: "Error al registrar producto",
                tipo: "error",
            });

        } finally {

            setModalLoading(false);
        }
    };

    const handleGuardarEdicion = async (datosEditados) => {

        try {

            setModalLoading(true);

            let urlImagen = datosEditados.imagen;

            if (datosEditados.archivo) {

                const nombreArchivo =
                    `${Date.now()}_${datosEditados.archivo.name}`;

                const { error: uploadError } = await supabase.storage
                    .from("imagenes_productos")
                    .upload(nombreArchivo, datosEditados.archivo);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("imagenes_productos")
                    .getPublicUrl(nombreArchivo);

                urlImagen = data.publicUrl;
            }

            const { error } = await supabase
                .from("productos")
                .update({
                    nombre: datosEditados.nombre,
                    precio: parseFloat(datosEditados.precio),
                    stock: parseInt(datosEditados.stock),
                    categoria: datosEditados.categoria,
                    descripcion: datosEditados.descripcion,
                    imagen: urlImagen,
                })
                .eq("id_producto", productoEditar.id_producto);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Producto actualizado correctamente",
                tipo: "exito",
            });

            setShowEditModal(false);

            await cargarProductos();

        } catch (err) {

            console.error("Error al actualizar:", err);

            setToast({
                mostrar: true,
                mensaje: "Error al actualizar producto",
                tipo: "error",
            });

        } finally {

            setModalLoading(false);
        }
    };

    const handleConfirmarEliminacion = async () => {

        try {

            setModalLoading(true);

            const { error } = await supabase
                .from("productos")
                .delete()
                .eq("id_producto", productoEliminar.id_producto);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Producto eliminado correctamente",
                tipo: "exito",
            });

            setShowDeleteModal(false);

            await cargarProductos();

        } catch (err) {

            console.error("Error al eliminar:", err);

            setToast({
                mostrar: true,
                mensaje: "Error al eliminar producto",
                tipo: "error",
            });

        } finally {

            setModalLoading(false);
        }
    };

    return (

        <Container className="margen-superior-main py-5">

            <div className="d-flex justify-content-between align-items-center mb-5">

                <div>

                    <h1 className="display-4 fw-bold text-dark mb-2">
                        Todos los Productos
                    </h1>

                    <p className="lead text-muted">
                        Gestiona el inventario de tu pulpería
                    </p>

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
                                    onChange={(e) =>
                                        setCategoriaFiltro(e.target.value)
                                    }
                                    size="lg"
                                    className="shadow-sm"
                                >
                                    <option value="Todas">
                                        Todas las categorías
                                    </option>

                                    <option value="Alimentos">
                                        Alimentos
                                    </option>

                                    <option value="Bebidas">
                                        Bebidas
                                    </option>

                                    <option value="Despensa">
                                        Despensa
                                    </option>

                                    <option value="Lácteos">
                                        Lácteos
                                    </option>

                                    <option value="Limpieza">
                                        Limpieza
                                    </option>

                                </Form.Select>

                            </Col>

                            <Col md={2}>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-100 fw-semibold shadow-sm"
                                >
                                    Buscar
                                </Button>

                            </Col>

                        </Row>

                    </div>

                </Col>

            </Row>

            {loading ? (

                <div className="text-center py-5">

                    <Spinner
                        animation="border"
                        variant="primary"
                        size="lg"
                    />

                    <p className="mt-3 text-muted">
                        Cargando productos...
                    </p>

                </div>

            ) : (

                <>

                    {/* TABLA SOLO DESKTOP */}
                    <div className="d-none d-md-block">

                        <TablaProductos
                            productos={productosPaginados}
                            abrirModalEdicion={handleEditarProducto}
                            abrirModalEliminacion={handleEliminarProducto}
                        />

                    </div>

                    {/* TARJETAS SOLO MOBILE */}
                    <div className="d-block d-md-none">

                        <TarjetasProductos
                            productos={productosPaginados}
                            categorias={[
                                { id_categoria: "Bebidas", nombre_categoria: "Bebidas" },
                                { id_categoria: "Alimentos", nombre_categoria: "Alimentos" },
                                { id_categoria: "Despensa", nombre_categoria: "Despensa" },
                                { id_categoria: "Lácteos", nombre_categoria: "Lácteos" },
                                { id_categoria: "Limpieza", nombre_categoria: "Limpieza" },
                            ]}
                            abrirModalEdicion={handleEditarProducto}
                            abrirModalEliminacion={handleEliminarProducto}
                        />

                    </div>

                    <hr className="my-4" />

                    <Paginacion
                        registrosPorPagina={registrosPorPagina}
                        totalRegistros={productosFiltrados.length}
                        paginaActual={paginaActual}
                        establecerPaginaActual={setPaginaActual}
                        establecerRegistrosPorPagina={setRegistrosPorPagina}
                    />

                </>

            )}

            <FormularioRegistroProducto
                show={showRegistroModal}
                onHide={() => setShowRegistroModal(false)}
                onGuardar={handleGuardarNuevo}
                loading={modalLoading}
            />

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

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() =>
                    setToast({ ...toast, mostrar: false })
                }
            />

        </Container>
    );
};

export default Productos;