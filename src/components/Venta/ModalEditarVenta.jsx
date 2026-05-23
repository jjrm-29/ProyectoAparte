import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Image,
  Badge,
  Alert,
  Spinner,
  Card
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalEditarVenta = ({
  show,
  onHide,
  venta,
  onSuccess
}) => {

  const [form, setForm] = useState({});
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorForm, setErrorForm] = useState("");

  useEffect(() => {

    if (show && venta) {

      setForm({
        ...venta,
        productos: venta.productos
      });

      cargarProductos();
    }

  }, [show, venta]);

  const cargarProductos = async () => {

    try {

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setProductos(data || []);

    } catch (error) {

      console.error(error);
    }
  };

  const handleProducto = (e) => {

    const id = parseInt(e.target.value);

    const producto = productos.find(
      (p) => p.id_producto === id
    );

    const precio = parseFloat(producto?.precio || 0);

    const cantidad = form.cantidad || 1;

    setForm({
      ...form,
      id_producto: id,
      productos: producto,
      precio_unitario: precio,
      subtotal: cantidad * precio
    });
  };

  const handleCantidad = (e) => {

    const cantidad = parseInt(e.target.value) || 1;

    const precio = form.precio_unitario || 0;

    setForm({
      ...form,
      cantidad,
      subtotal: cantidad * precio
    });
  };

  const actualizar = async () => {

    try {

      setLoading(true);
      setErrorForm("");

      const { error } = await supabase
        .from("detalle_venta")
        .update({
          id_producto: form.id_producto,
          cantidad: form.cantidad,
          precio_unitario: form.precio_unitario,
          subtotal: form.subtotal
        })
        .eq("id_detalle", venta.id_detalle);

      if (error) {

        console.error(error);

        setErrorForm(
          "Error al actualizar la venta"
        );

        return;
      }

      onHide();

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {

      console.error(error);

      setErrorForm(
        "Ocurrió un error inesperado"
      );

    } finally {

      setLoading(false);
    }
  };

  if (!venta) return null;

  return (

    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
    >

      <Modal.Header
        closeButton
        className="border-0 text-white"
        style={{
          background:
            "linear-gradient(135deg,#111827,#2563eb)"
        }}
      >

        <Modal.Title className="fw-bold fs-3">
          ✏️ Editar Venta
        </Modal.Title>

      </Modal.Header>

      <Modal.Body className="p-4 bg-light">

        {errorForm && (

          <Alert variant="danger">
            {errorForm}
          </Alert>

        )}

        <Row className="g-4 align-items-center">

          {/* IMAGEN */}

          <Col md={5}>

            <Card className="border-0 shadow-lg rounded-5 overflow-hidden">

              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  height: "320px",
                  background:
                    "linear-gradient(135deg,#eff6ff,#dbeafe)"
                }}
              >

                {form.productos?.imagen ? (

                  <Image
                    src={form.productos.imagen}
                    fluid
                    style={{
                      width: "240px",
                      height: "240px",
                      objectFit: "cover",
                      borderRadius: "25px",
                      boxShadow:
                        "0 10px 25px rgba(0,0,0,0.15)"
                    }}
                  />

                ) : (

                  <div
                    className="bg-white shadow-sm d-flex justify-content-center align-items-center"
                    style={{
                      width: "240px",
                      height: "240px",
                      borderRadius: "25px",
                      fontSize: "5rem"
                    }}
                  >
                    📦
                  </div>

                )}

              </div>

            </Card>

          </Col>

          {/* FORMULARIO */}

          <Col md={7}>

            <Card className="border-0 shadow rounded-5">

              <Card.Body className="p-4">

                <Form>

                  {/* PRODUCTO */}

                  <Form.Group className="mb-4">

                    <Form.Label className="fw-bold">
                      Producto
                    </Form.Label>

                    <Form.Select
                      value={form.id_producto || ""}
                      onChange={handleProducto}
                      size="lg"
                      className="rounded-4"
                    >

                      <option value="">
                        Selecciona un producto
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

                  </Form.Group>

                  {/* CATEGORÍA */}

                  <div className="mb-4">

                    <Form.Label className="fw-bold d-block">
                      Categoría
                    </Form.Label>

                    <Badge
                      bg="primary"
                      className="px-4 py-2 rounded-pill fs-6"
                    >
                      {form.productos?.categoria ||
                        "Sin categoría"}
                    </Badge>

                  </div>

                  {/* CANTIDAD */}

                  <Form.Group className="mb-4">

                    <Form.Label className="fw-bold">
                      Cantidad
                    </Form.Label>

                    <Form.Control
                      type="number"
                      min="1"
                      value={form.cantidad || ""}
                      onChange={handleCantidad}
                      size="lg"
                      className="rounded-4"
                    />

                  </Form.Group>

                  {/* PRECIO */}

                  <Form.Group className="mb-4">

                    <Form.Label className="fw-bold">
                      Precio Unitario
                    </Form.Label>

                    <Form.Control
                      value={`C$ ${parseFloat(
                        form.precio_unitario || 0
                      ).toFixed(2)}`}
                      disabled
                      size="lg"
                      className="rounded-4 fw-bold text-primary"
                    />

                  </Form.Group>

                  {/* SUBTOTAL */}

                  <Form.Group>

                    <Form.Label className="fw-bold">
                      Subtotal
                    </Form.Label>

                    <Form.Control
                      value={`C$ ${parseFloat(
                        form.subtotal || 0
                      ).toFixed(2)}`}
                      disabled
                      size="lg"
                      className="rounded-4 fw-bold text-success"
                    />

                  </Form.Group>

                </Form>

              </Card.Body>

            </Card>

          </Col>

        </Row>

      </Modal.Body>

      <Modal.Footer className="border-0 bg-light">

        <Button
          variant="secondary"
          onClick={onHide}
          className="rounded-4 px-4"
        >
          Cancelar
        </Button>

        <Button
          variant="success"
          onClick={actualizar}
          disabled={loading}
          className="rounded-4 px-4 fw-bold"
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

            "💾 Guardar Cambios"

          )}

        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default ModalEditarVenta;