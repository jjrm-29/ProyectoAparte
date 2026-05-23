import { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Form,
    Spinner,
    Row,
    Col,
    Image,
    Alert,
    Card,
    Badge,
    InputGroup
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalRegistroVenta = ({
    show,
    handleClose,
    cargarVentas
}) => {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");

    const [items, setItems] = useState([
        {
            id_producto: "",
            cantidad: 1,
            precio: 0,
            total: 0
        }
    ]);

    // =====================================
    // CARGAR PRODUCTOS
    // =====================================

    useEffect(() => {

        if (show) {

            cargarProductos();

            // LIMPIAR FORMULARIO
            setItems([
                {
                    id_producto: "",
                    cantidad: 1,
                    precio: 0,
                    total: 0
                }
            ]);

            setFormError("");
        }

    }, [show]);

    const cargarProductos = async () => {

        try {

            const { data, error } = await supabase
                .from("productos")
                .select("*")
                .order("nombre", { ascending: true });

            if (error) throw error;

            setProductos(data || []);

        } catch (error) {

            console.error(error);
        }
    };

    // =====================================
    // CAMBIAR PRODUCTO
    // =====================================

    const handleProducto = (index, e) => {

        const id = e.target.value;

        const producto = productos.find(
            (p) => String(p.id_producto) === String(id)
        );

        const precio = parseFloat(producto?.precio || 0);

        const nuevosItems = [...items];

        nuevosItems[index] = {
            ...nuevosItems[index],
            id_producto: id,
            precio,
            total: precio * nuevosItems[index].cantidad
        };

        setItems(nuevosItems);
    };

    // =====================================
    // CAMBIAR CANTIDAD
    // =====================================

    const handleCantidad = (index, e) => {

        const cantidad = parseInt(e.target.value) || 1;

        const nuevosItems = [...items];

        nuevosItems[index] = {
            ...nuevosItems[index],
            cantidad,
            total: cantidad * nuevosItems[index].precio
        };

        setItems(nuevosItems);
    };

    // =====================================
    // AGREGAR PRODUCTO
    // =====================================

    const agregarProducto = () => {

        setItems([
            ...items,
            {
                id_producto: "",
                cantidad: 1,
                precio: 0,
                total: 0
            }
        ]);
    };

    // =====================================
    // ELIMINAR PRODUCTO
    // =====================================

    const eliminarProducto = (index) => {

        const nuevosItems = items.filter(
            (_, i) => i !== index
        );

        setItems(nuevosItems);
    };

    // =====================================
    // TOTAL GENERAL
    // =====================================

    const totalGeneral = items.reduce(
        (acc, item) => acc + item.total,
        0
    );

    // =====================================
    // GUARDAR VENTA
    // =====================================

    const guardar = async () => {

        try {

            setLoading(true);
            setFormError("");

            const itemsValidos = items.filter(
                (item) => item.id_producto
            );

            if (itemsValidos.length === 0) {

                setFormError(
                    "Debes seleccionar al menos un producto"
                );

                setLoading(false);
                return;
            }

            // =====================================
            // CREAR VENTA
            // =====================================

            const { data: ventaCreada, error: errorVenta } =
                await supabase
                    .from("ventas")
                    .insert([
                        {
                            total: totalGeneral,
                            fecha: new Date()
                        }
                    ])
                    .select()
                    .single();

            if (errorVenta) {

                console.error(errorVenta);

                setFormError(
                    "Error al crear la venta"
                );

                setLoading(false);
                return;
            }

            // =====================================
            // INSERTAR DETALLE
            // =====================================

            for (const item of itemsValidos) {

                const { error: errorDetalle } =
                    await supabase
                        .from("detalle_venta")
                        .insert([
                            {
                                id_venta: ventaCreada.id_venta,
                                id_producto: item.id_producto,
                                cantidad: item.cantidad,
                                precio_unitario: item.precio,
                                subtotal: item.total
                            }
                        ]);

                if (errorDetalle) {

                    console.error(errorDetalle);
                    continue;
                }

                // =====================================
                // ACTUALIZAR STOCK
                // =====================================

                const producto = productos.find(
                    (p) =>
                        String(p.id_producto) ===
                        String(item.id_producto)
                );

                const nuevoStock =
                    Number(producto.stock) -
                    Number(item.cantidad);

                await supabase
                    .from("productos")
                    .update({
                        stock: nuevoStock
                    })
                    .eq("id_producto", item.id_producto);
            }

            // =====================================
            // LIMPIAR
            // =====================================

            setItems([
                {
                    id_producto: "",
                    cantidad: 1,
                    precio: 0,
                    total: 0
                }
            ]);

            handleClose();

            if (cargarVentas) {
                cargarVentas();
            }

        } catch (error) {

            console.error(error);

            setFormError(
                "Error al registrar venta"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="xl"
        >

            {/* HEADER */}

            <Modal.Header
                closeButton
                className="border-0 pb-0"
            >

                <Modal.Title className="fw-bold fs-3">
                    🧾 Registrar Venta
                </Modal.Title>

            </Modal.Header>

            {/* BODY */}

            <Modal.Body className="pt-2">

                {formError && (

                    <Alert
                        variant="danger"
                        className="rounded-4"
                    >
                        {formError}
                    </Alert>

                )}

                <Row>

                    {/* PRODUCTOS */}

                    <Col lg={8}>

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h4 className="fw-bold mb-0">
                                Productos
                            </h4>

                            <Button
                                variant="dark"
                                className="rounded-4 px-4"
                                onClick={agregarProducto}
                            >
                                ➕ Agregar
                            </Button>

                        </div>

                        <div
                            style={{
                                maxHeight: "550px",
                                overflowY: "auto"
                            }}
                        >

                            {items.map((item, index) => {

                                const producto =
                                    productos.find(
                                        (p) =>
                                            String(p.id_producto) ===
                                            String(item.id_producto)
                                    );

                                return (

                                    <Card
                                        key={index}
                                        className="border-0 shadow-sm rounded-5 mb-4"
                                    >

                                        <Card.Body className="p-4">

                                            <Row className="align-items-center">

                                                {/* IMAGEN */}

                                                <Col md={3} className="text-center">

                                                    <div
                                                        className="bg-light rounded-4 overflow-hidden mx-auto"
                                                        style={{
                                                            width: "120px",
                                                            height: "120px"
                                                        }}
                                                    >

                                                        {producto?.imagen ? (

                                                            <Image
                                                                src={producto.imagen}
                                                                fluid
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                            />

                                                        ) : (

                                                            <div className="d-flex justify-content-center align-items-center h-100">
                                                                <span
                                                                    style={{
                                                                        fontSize: "4rem"
                                                                    }}
                                                                >
                                                                    📦
                                                                </span>
                                                            </div>

                                                        )}

                                                    </div>

                                                </Col>

                                                {/* FORMULARIO */}

                                                <Col md={9}>

                                                    <Row>

                                                        {/* PRODUCTO */}

                                                        <Col md={6} className="mb-3">

                                                            <Form.Label className="fw-semibold">
                                                                Producto
                                                            </Form.Label>

                                                            <Form.Select
                                                                value={item.id_producto}
                                                                onChange={(e) =>
                                                                    handleProducto(index, e)
                                                                }
                                                                className="rounded-4"
                                                            >

                                                                <option value="">
                                                                    Selecciona producto
                                                                </option>

                                                                {productos.map((p) => (

                                                                    <option
                                                                        key={p.id_producto}
                                                                        value={p.id_producto}
                                                                    >
                                                                        {p.nombre}
                                                                    </option>

                                                                ))}

                                                            </Form.Select>

                                                        </Col>

                                                        {/* CANTIDAD */}

                                                        <Col md={3} className="mb-3">

                                                            <Form.Label className="fw-semibold">
                                                                Cantidad
                                                            </Form.Label>

                                                            <Form.Control
                                                                type="number"
                                                                min="1"
                                                                value={item.cantidad}
                                                                onChange={(e) =>
                                                                    handleCantidad(index, e)
                                                                }
                                                                className="rounded-4"
                                                            />

                                                        </Col>

                                                        {/* SUBTOTAL */}

                                                        <Col md={3} className="mb-3">

                                                            <Form.Label className="fw-semibold">
                                                                Subtotal
                                                            </Form.Label>

                                                            <InputGroup>

                                                                <InputGroup.Text>
                                                                    C$
                                                                </InputGroup.Text>

                                                                <Form.Control
                                                                    value={item.total.toFixed(2)}
                                                                    disabled
                                                                    className="fw-bold text-success"
                                                                />

                                                            </InputGroup>

                                                        </Col>

                                                    </Row>

                                                    {/* INFO */}

                                                    <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">

                                                        <div className="d-flex gap-2 flex-wrap">

                                                            <Badge
                                                                bg="primary"
                                                                className="px-3 py-2 rounded-pill"
                                                            >
                                                                Precio:
                                                                {" "}
                                                                C$
                                                                {" "}
                                                                {item.precio.toFixed(2)}
                                                            </Badge>

                                                            <Badge
                                                                bg={
                                                                    producto?.stock > 0
                                                                        ? "success"
                                                                        : "danger"
                                                                }
                                                                className="px-3 py-2 rounded-pill"
                                                            >
                                                                Stock:
                                                                {" "}
                                                                {producto?.stock || 0}
                                                            </Badge>

                                                            {producto?.categoria && (

                                                                <Badge
                                                                    bg="dark"
                                                                    className="px-3 py-2 rounded-pill"
                                                                >
                                                                    {producto.categoria}
                                                                </Badge>

                                                            )}

                                                        </div>

                                                        {items.length > 1 && (

                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                className="rounded-pill"
                                                                onClick={() =>
                                                                    eliminarProducto(index)
                                                                }
                                                            >
                                                                🗑 Eliminar
                                                            </Button>

                                                        )}

                                                    </div>

                                                </Col>

                                            </Row>

                                        </Card.Body>

                                    </Card>

                                );
                            })}

                        </div>

                    </Col>

                    {/* RESUMEN */}

                    <Col lg={4}>

                        <Card className="border-0 shadow rounded-5 sticky-top">

                            <Card.Body className="p-4">

                                <h3 className="fw-bold mb-4">
                                    💰 Resumen
                                </h3>

                                <div className="mb-3">

                                    <div className="d-flex justify-content-between">

                                        <span className="text-muted">
                                            Productos
                                        </span>

                                        <span className="fw-bold">
                                            {items.length}
                                        </span>

                                    </div>

                                </div>

                                <div className="mb-4">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <span className="text-muted">
                                            Total General
                                        </span>

                                        <span className="fw-bold fs-3 text-success">
                                            C$ {totalGeneral.toFixed(2)}
                                        </span>

                                    </div>

                                </div>

                                <Button
                                    variant="success"
                                    className="w-100 rounded-4 py-3 fw-bold fs-5"
                                    onClick={guardar}
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                                className="me-2"
                                            />
                                            Guardando...
                                        </>

                                    ) : (

                                        "💾 Guardar Venta"

                                    )}

                                </Button>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

            </Modal.Body>

        </Modal>
    );
};

export default ModalRegistroVenta;