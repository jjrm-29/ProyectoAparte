import { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Form,
    Spinner,
    Row,
    Col,
    Image,
    Alert
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

    const [form, setForm] = useState({
        id_producto: "",
        cantidad: 1,
        precio: 0,
        total: 0
    });

    useEffect(() => {

        if (show) {
            cargarProductos();
        }

    }, [show]);

    // =========================
    // CARGAR PRODUCTOS
    // =========================

    const cargarProductos = async () => {

        try {

            const { data, error } = await supabase
                .from("productos")
                .select("*")
                .order("nombre", { ascending: true });

            if (error) throw error;

            setProductos(data || []);

        } catch (error) {

            console.error("Error al cargar productos:", error);
        }
    };

    // =========================
    // PRODUCTO SELECCIONADO
    // =========================

    const productoSeleccionado = productos.find(
        (p) => p.id_producto === parseInt(form.id_producto)
    );

    // =========================
    // CAMBIAR PRODUCTO
    // =========================

    const handleProducto = (e) => {

        const id = parseInt(e.target.value);

        const producto = productos.find(
            (p) => p.id_producto === id
        );

        const precio = parseFloat(producto?.precio || 0);

        setForm((prev) => ({
            ...prev,
            id_producto: id,
            precio,
            total: precio * prev.cantidad
        }));
    };

    // =========================
    // CAMBIAR CANTIDAD
    // =========================

    const handleCantidad = (e) => {

        const cantidad = parseInt(e.target.value) || 1;

        setForm((prev) => ({
            ...prev,
            cantidad,
            total: cantidad * prev.precio
        }));
    };

    // =========================
    // GUARDAR
    // =========================

    const guardar = async () => {

        try {

            setFormError("");

            if (!form.id_producto) {
                setFormError("Debes seleccionar un producto");
                return;
            }

            if (form.cantidad <= 0) {
                setFormError("La cantidad debe ser mayor a 0");
                return;
            }

            setLoading(true);

            const fechaHoy = new Date()
                .toISOString()
                .split("T")[0];

            // =========================
            // BUSCAR FECHA
            // =========================

            let { data: tiempoExistente } = await supabase
                .from("Dim_Tiempo")
                .select("*")
                .eq("fecha", fechaHoy)
                .single();

            // =========================
            // CREAR FECHA SI NO EXISTE
            // =========================

            if (!tiempoExistente) {

                const { data: nuevoTiempo, error: errorTiempo } = await supabase
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

                if (errorTiempo) throw errorTiempo;

                tiempoExistente = nuevoTiempo;
            }

            // =========================
            // INSERTAR VENTA
            // =========================

            const { error: errorVenta } = await supabase
                .from("Hecho_Ventas")
                .insert([
                    {
                        id_producto: form.id_producto,
                        id_tiempo: tiempoExistente.id_tiempo,
                        cantidad: form.cantidad,
                        total: form.total
                    }
                ]);

            if (errorVenta) throw errorVenta;

            // =========================
            // ACTUALIZAR STOCK
            // =========================

            const nuevoStock =
                (productoSeleccionado.stock || 0) - form.cantidad;

            await supabase
                .from("productos")
                .update({
                    stock: nuevoStock
                })
                .eq("id_producto", form.id_producto);

            // =========================
            // RESET
            // =========================

            setForm({
                id_producto: "",
                cantidad: 1,
                precio: 0,
                total: 0
            });

            onHide();
            onSuccess();

        } catch (error) {

            console.error("Error al guardar venta:", error);

            setFormError("Ocurrió un error al registrar la venta");

        } finally {

            setLoading(false);
        }
    };

    return (

        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >

            <Modal.Header closeButton>

                <Modal.Title>
                    🧾 Registrar Venta
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                {formError && (

                    <Alert variant="danger">
                        {formError}
                    </Alert>

                )}

                <Row className="g-4">

                    {/* IMAGEN */}

                    <Col md={5} className="text-center">

                        <div
                            className="border rounded-4 overflow-hidden bg-light mx-auto"
                            style={{
                                width: "220px",
                                height: "220px"
                            }}
                        >

                            {productoSeleccionado?.imagen ? (

                                <Image
                                    src={productoSeleccionado.imagen}
                                    fluid
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <span style={{ fontSize: "5rem" }}>
                                        📦
                                    </span>
                                </div>

                            )}

                        </div>

                    </Col>

                    {/* FORMULARIO */}

                    <Col md={7}>

                        <Form>

                            {/* PRODUCTO */}

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Producto
                                </Form.Label>

                                <Form.Select
                                    value={form.id_producto}
                                    onChange={handleProducto}
                                    size="lg"
                                >

                                    <option value="">
                                        Selecciona un producto
                                    </option>

                                    {productos.map((p) => (

                                        <option
                                            key={p.id_producto}
                                            value={p.id_producto}
                                        >
                                            {p.nombre} - C$ {p.precio}
                                        </option>

                                    ))}

                                </Form.Select>

                            </Form.Group>

                            {/* CANTIDAD */}

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Cantidad
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={form.cantidad}
                                    onChange={handleCantidad}
                                    size="lg"
                                />

                            </Form.Group>

                            {/* PRECIO */}

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Precio Unitario
                                </Form.Label>

                                <Form.Control
                                    value={`C$ ${parseFloat(form.precio || 0).toFixed(2)}`}
                                    disabled
                                    size="lg"
                                />

                            </Form.Group>

                            {/* TOTAL */}

                            <Form.Group>

                                <Form.Label className="fw-semibold">
                                    Total
                                </Form.Label>

                                <Form.Control
                                    value={`C$ ${parseFloat(form.total || 0).toFixed(2)}`}
                                    disabled
                                    size="lg"
                                    className="fw-bold text-success"
                                />

                            </Form.Group>

                        </Form>

                    </Col>

                </Row>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Cancelar
                </Button>

                <Button
                    variant="success"
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

            </Modal.Footer>

        </Modal>
    );
};

export default ModalRegistroVenta;