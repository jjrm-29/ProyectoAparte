import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalRegistroVenta = ({ show, onHide, onSuccess }) => {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        id_producto: "",
        cantidad: 1,
        precio: 0,
        total: 0
    });

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        const { data, error } = await supabase
            .from("Dim_Producto")
            .select("*");

        if (error) {
            console.error(error);
            return;
        }

        setProductos(data || []);
    };

    const handleProducto = (e) => {
        const id = parseInt(e.target.value);

        const producto = productos.find(p => p.id_producto === id);

        setForm({
            ...form,
            id_producto: id,
            precio: producto?.precio || 0,
            total: (producto?.precio || 0) * form.cantidad
        });
    };

    const handleCantidad = (e) => {
        const cantidad = parseInt(e.target.value) || 1;

        setForm({
            ...form,
            cantidad,
            total: cantidad * form.precio
        });
    };

    const guardar = async () => {

        // 🔥 VALIDACIÓN
        if (!form.id_producto) {
            alert("Selecciona un producto");
            return;
        }

        if (form.cantidad <= 0) {
            alert("Cantidad inválida");
            return;
        }

        setLoading(true);

        const hoy = new Date().toISOString().split("T")[0];

        // 🔍 buscar fecha
        const { data: tiempos, error: errorTiempo } = await supabase
            .from("Dim_Tiempo")
            .select("*")
            .eq("fecha", hoy);

        if (errorTiempo) {
            console.error(errorTiempo);
            setLoading(false);
            return;
        }

        let tiempo = tiempos?.[0];

        // 🧠 crear si no existe
        if (!tiempo) {
            const { data: nuevoTiempo, error } = await supabase
                .from("Dim_Tiempo")
                .insert([{
                    fecha: hoy,
                    mes: new Date().toLocaleString("es", { month: "long" }),
                    anio: new Date().getFullYear()
                }])
                .select();

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            tiempo = nuevoTiempo[0];
        }

        if (!tiempo) {
            alert("Error con la fecha");
            setLoading(false);
            return;
        }

        // 💾 INSERTAR VENTA
        const { error: errorVenta } = await supabase
            .from("Hecho_Ventas")
            .insert([{
                id_producto: form.id_producto,
                id_tiempo: tiempo.id_tiempo,
                cantidad: form.cantidad,
                total: form.total
            }]);

        if (errorVenta) {
            console.error(errorVenta);
            alert("Error al guardar venta");
            setLoading(false);
            return;
        }

        // ✅ reset
        setForm({
            id_producto: "",
            cantidad: 1,
            precio: 0,
            total: 0
        });

        setLoading(false);
        onHide();
        onSuccess();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>🧾 Nueva Venta</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    <Form.Group className="mb-3">
                        <Form.Label>Producto</Form.Label>
                        <Form.Select value={form.id_producto} onChange={handleProducto}>
                            <option value="">Seleccione...</option>
                            {productos.map(p => (
                                <option key={p.id_producto} value={p.id_producto}>
                                    {p.nombre} - C$ {p.precio}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={form.cantidad}
                            onChange={handleCantidad}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Total</Form.Label>
                        <Form.Control
                            value={`C$ ${form.total}`}
                            disabled
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>

                <Button variant="success" onClick={guardar} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Guardar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroVenta;