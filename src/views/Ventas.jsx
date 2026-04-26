import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroVenta from "../components/Venta/ModalRegistroVenta";
import ModalEditarVenta from "../components/Venta/ModalEditarVenta";
import ModalEliminarVenta from "../components/Venta/ModalEliminarVenta";

const Ventas = () => {

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRegistro, setShowRegistro] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);

  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("Hecho_Ventas")
      .select("*");

    setVentas(data || []);
    setLoading(false);
  };

  const eliminarVenta = async () => {
    await supabase
      .from("Hecho_Ventas")
      .delete()
      .eq("id_venta", ventaSeleccionada.id_venta);

    setShowEliminar(false);
    cargarVentas();
  };

  return (
    <Container className="py-4">

      <Row className="mb-3">
        <Col><h3>🧾 Ventas</h3></Col>
        <Col className="text-end">
          <Button onClick={() => setShowRegistro(true)}>
            ➕ Nueva Venta
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spinner />
      ) : (
        <Table striped>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map(v => (
              <tr key={v.id_venta}>
                <td>{v.id_venta}</td>
                <td>{v.id_producto}</td>
                <td>{v.cantidad}</td>
                <td>C$ {v.total}</td>
                <td>
                  <Button size="sm" variant="warning"
                    onClick={() => {
                      setVentaSeleccionada(v);
                      setShowEditar(true);
                    }}>
                    ✏️
                  </Button>{" "}

                  <Button size="sm" variant="danger"
                    onClick={() => {
                      setVentaSeleccionada(v);
                      setShowEliminar(true);
                    }}>
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* MODALES */}
      <ModalRegistroVenta
        show={showRegistro}
        onHide={() => setShowRegistro(false)}
        onSuccess={cargarVentas}
      />

      <ModalEditarVenta
        show={showEditar}
        onHide={() => setShowEditar(false)}
        venta={ventaSeleccionada}
        onSuccess={cargarVentas}
      />

      <ModalEliminarVenta
        show={showEliminar}
        onHide={() => setShowEliminar(false)}
        onConfirmar={eliminarVenta}
        venta={ventaSeleccionada}
      />

    </Container>
  );
};

export default Ventas;