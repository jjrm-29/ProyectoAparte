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
    Badge
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalRegistroVenta = ({
    show,
    onHide,
    onSuccess
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

    useEffect(() => {

        if (show) {
            cargarProductos();
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

    const eliminarProducto = (index) => {

        const nuevosItems = items.filter((_, i) => i !== index);

        setItems(nuevosItems);
    };

    const totalGeneral = items.reduce(
        (acc, item) => acc + item.total,
        0
    );

    const guardar = async () => {

        try {

            setFormError("");

            const itemsValidos = items.filter(
                (item) => item.id_producto
            );

            if (itemsValidos.length === 0) {

                setFormError("Debes seleccionar al menos un producto");
                return;
            }

            setLoading(true);

            const fechaHoy = new Date()
                .toISOString()
                .split("T")[0];

            let { data: tiempoExistente } = await supabase
                .from("Dim_Tiempo")
                .select("*")
                .eq("fecha", fechaHoy)
                .single();

            if (!tiempoExistente) {

                const { data: nuevoTiempo } = await supabase
                    .from("Dim_Tiempo")
                    .insert([
                        {
                            fecha: fechaHoy,
                            mes: new Date().toLocaleString("es-ES", {
                                month: "long"
                            }),
                            anio: new Date().getFullYear()
                        }
                    ])
                    .select()
                    .single();

                tiempoExistente = nuevoTiempo;
            }

            for (const item of itemsValidos) {

                await supabase
                    .from("Hecho_Ventas")
                    .insert([
                        {
                            id_producto: item.id_producto,
                            id_tiempo: tiempoExistente.id_tiempo,
                            cantidad: item.cantidad,
                            total: item.total
                        }
                    ]);

                const producto = productos.find(
                    (p) => String(p.id_producto) === String(item.id_producto)
                );

                const nuevoStock =
                    (producto.stock || 0) - item.cantidad;

                await supabase
                    .from("productos")
                    .update({
                        stock: nuevoStock
                    })
                    .eq("id_producto", item.id_producto);
            }

            setItems([
                {
                    id_producto: "",
                    cantidad: 1,
                    precio: 0,
                    total: 0
                }
            ]);

            onHide();
            onSuccess();

        } catch (error) {

            console.error(error);

            setFormError("Error al registrar venta");

        } finally {

            setLoading(false);
        }
    };

    return (

        <Modal
            show={show}
            onHide={onHide}
            centered
            size="xl"
        >

            <Modal.Header closeButton className="border-0 pb-0">

                <Modal.Title className="fw-bold fs-3">
                    🧾 Nueva Venta
                </Modal.Title>

            </Modal.Header>

            <Modal.Body className="pt-2">

                {formError && (

                    <Alert variant="danger" className="rounded-4">
                        {formError}
                    </Alert>

                )}

                <Row>

                    {/* PRODUCTOS */}

                    <Col lg={8}>

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h5 className="fw-bold mb-0">
                                Productos Agregados
                            </h5>

                            <Button
                                variant="dark"
                                className="rounded-4 px-4"
                                onClick={agregarProducto}
                            >
                                + Agregar Producto
                            </Button>

                        </div>

                        <div
                            style={{
                                maxHeight: "500px",
                                overflowY: "auto"
                            }}
                        >

                            {items.map((item, index) => {

                                const producto = productos.find(
                                    (p) =>
                                        String(p.id_producto) ===
                                        String(item.id_producto)
                                );

                                return (

                                    <Card
                                        key={index}
                                        className="border-0 shadow-sm rounded-4 mb-3"
                                    >

                                        <Card.Body>

                                            <Row className="align-items-center">

                                                {/* IMAGEN */}

                                                <Col md={3} className="text-center">

                                                    <div
                                                        className="bg-light rounded-4 overflow-hidden mx-auto"
                                                        style={{
                                                            width: "110px",
                                                            height: "110px"
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
                                                                <span style={{ fontSize: "3rem" }}>
                                                                    📦
                                                                </span>
                                                            </div>

                                                        )}

                                                    </div>

                                                </Col>

                                                {/* FORM */}

                                                <Col md={9}>

                                                    <Row>

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

                                                        <Col md={3} className="mb-3">

                                                            <Form.Label className="fw-semibold">
                                                                Subtotal
                                                            </Form.Label>

                                                            <Form.Control
                                                                value={`C$ ${item.total.toFixed(2)}`}
                                                                disabled
                                                                className="rounded-4 fw-bold text-success"
                                                            />

                                                        </Col>

                                                    </Row>

                                                    <div className="d-flex justify-content-between align-items-center mt-2">

                                                        <div className="d-flex gap-2">

                                                            <Badge bg="dark" className="px-3 py-2 rounded-pill">
                                                                Precio: C$ {item.precio.toFixed(2)}
                                                            </Badge>

                                                            {producto?.stock >= 1 && (

                                                                <Badge bg="success" className="px-3 py-2 rounded-pill">
                                                                    Stock: {producto.stock}
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
                                                                Eliminar
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

                        <Card className="border-0 shadow rounded-4 sticky-top">

                            <Card.Body className="p-4">

                                <h4 className="fw-bold mb-4">
                                    Resumen
                                </h4>

                                <div className="d-flex justify-content-between mb-3">

                                    <span className="text-muted">
                                        Productos
                                    </span>

                                    <span className="fw-semibold">
                                        {items.length}
                                    </span>

                                </div>

                                <div className="d-flex justify-content-between mb-4">

                                    <span className="text-muted">
                                        Total General
                                    </span>

                                    <span className="fw-bold fs-4 text-success">
                                        C$ {totalGeneral.toFixed(2)}
                                    </span>

                                </div>

                                <Button
                                    variant="success"
                                    className="w-100 rounded-4 py-3 fw-bold"
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

                                        "Guardar Venta"

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