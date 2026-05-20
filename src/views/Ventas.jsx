import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Card,
  Badge
} from "react-bootstrap";

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

  // =========================
  // CARGAR VENTAS
  // =========================

  const cargarVentas = async () => {

    try {

      setLoading(true);

      const { data: ventasData, error: ventasError } = await supabase
        .from("Hecho_Ventas")
        .select("*")
        .order("id_venta", { ascending: false });

      if (ventasError) {
        console.error("Error ventas:", ventasError);
        return;
      }

      const { data: productosData, error: productosError } = await supabase
        .from("productos")
        .select("*");

      if (productosError) {
        console.error("Error productos:", productosError);
        return;
      }

      const ventasCompletas = ventasData.map((venta) => {

        const producto = productosData.find(
          (p) =>
            String(p.id_producto) === String(venta.id_producto)
        );

        return {
          ...venta,
          productos: producto || null
        };
      });

      setVentas(ventasCompletas);

    } catch (error) {

      console.error("Error general:", error);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // ELIMINAR VENTA
  // =========================

  const eliminarVenta = async () => {

    try {

      await supabase
        .from("Hecho_Ventas")
        .delete()
        .eq("id_venta", ventaSeleccionada.id_venta);

      setShowEliminar(false);

      cargarVentas();

    } catch (error) {

      console.error("Error al eliminar:", error);
    }
  };

  return (

    <Container fluid className="py-4 px-lg-5">

      {/* HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">

        <div>

          <h1 className="fw-bold mb-1 text-dark">
            Gestión de Ventas
          </h1>

          <p className="text-muted mb-0">
            Administra y controla todas las ventas registradas
          </p>

        </div>

        <Button
          variant="primary"
          size="lg"
          className="rounded-4 px-4 shadow-sm fw-semibold"
          onClick={() => setShowRegistro(true)}
        >
          ➕ Nueva Venta
        </Button>

      </div>

      {/* ESTADÍSTICAS */}

      <Row className="g-4 mb-4">

        <Col md={4}>

          <Card className="border-0 shadow-sm rounded-4 h-100">

            <Card.Body>

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Total Ventas
                  </p>

                  <h3 className="fw-bold mb-0">
                    {ventas.length}
                  </h3>

                </div>

                <div
                  className="d-flex align-items-center justify-content-center rounded-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(59,130,246,0.12)",
                    fontSize: "1.8rem"
                  }}
                >
                  🧾
                </div>

              </div>

            </Card.Body>

          </Card>

        </Col>

        <Col md={4}>

          <Card className="border-0 shadow-sm rounded-4 h-100">

            <Card.Body>

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Productos Vendidos
                  </p>

                  <h3 className="fw-bold mb-0">
                    {ventas.reduce((acc, venta) => acc + venta.cantidad, 0)}
                  </h3>

                </div>

                <div
                  className="d-flex align-items-center justify-content-center rounded-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(16,185,129,0.12)",
                    fontSize: "1.8rem"
                  }}
                >
                  📦
                </div>

              </div>

            </Card.Body>

          </Card>

        </Col>

        <Col md={4}>

          <Card className="border-0 shadow-sm rounded-4 h-100">

            <Card.Body>

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Ingresos Totales
                  </p>

                  <h3 className="fw-bold text-success mb-0">
                    C$ {ventas.reduce((acc, venta) => acc + parseFloat(venta.total || 0), 0).toFixed(2)}
                  </h3>

                </div>

                <div
                  className="d-flex align-items-center justify-content-center rounded-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(34,197,94,0.12)",
                    fontSize: "1.8rem"
                  }}
                >
                  💰
                </div>

              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>

      {/* LOADING */}

      {loading ? (

        <div className="text-center py-5">

          <Spinner
            animation="border"
            variant="primary"
          />

          <p className="mt-3 text-muted">
            Cargando ventas...
          </p>

        </div>

      ) : (

        <>

          {/* TABLA DESKTOP */}

          <div className="d-none d-lg-block">

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">

              <div className="p-4 border-bottom bg-white">

                <h5 className="fw-bold mb-0">
                  Historial de Ventas
                </h5>

              </div>

              <Table hover responsive className="align-middle mb-0">

                <thead
                  style={{
                    background: "#0f172a",
                    color: "white"
                  }}
                >

                  <tr>

                    <th className="ps-4">#</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th className="text-center">Acciones</th>

                  </tr>

                </thead>

                <tbody>

                  {ventas.length > 0 ? (

                    ventas.map((venta) => (

                      <tr key={venta.id_venta}>

                        <td className="ps-4 fw-semibold">
                          #{venta.id_venta}
                        </td>

                        <td>

                          <div className="d-flex align-items-center gap-3">

                            {venta.productos?.imagen ? (

                              <img
                                src={venta.productos.imagen}
                                alt={venta.productos.nombre}
                                style={{
                                  width: "65px",
                                  height: "65px",
                                  objectFit: "cover",
                                  borderRadius: "16px"
                                }}
                              />

                            ) : (

                              <div
                                className="bg-light d-flex align-items-center justify-content-center"
                                style={{
                                  width: "65px",
                                  height: "65px",
                                  borderRadius: "16px",
                                  fontSize: "1.5rem"
                                }}
                              >
                                📦
                              </div>

                            )}

                            <div>

                              <h6 className="mb-1 fw-bold">
                                {venta.productos?.nombre || "Sin producto"}
                              </h6>

                              <small className="text-muted">
                                Venta registrada
                              </small>

                            </div>

                          </div>

                        </td>

                        <td>

                          <Badge
                            bg="light"
                            text="dark"
                            className="px-3 py-2 rounded-pill border"
                          >
                            {venta.productos?.categoria || "Sin categoría"}
                          </Badge>

                        </td>

                        <td className="fw-semibold">
                          {venta.cantidad}
                        </td>

                        <td className="fw-bold text-success">
                          C$ {parseFloat(venta.total || 0).toFixed(2)}
                        </td>

                        <td>

                          <div className="d-flex justify-content-center gap-2">

                            <Button
                              variant="light"
                              className="rounded-circle shadow-sm"
                              style={{
                                width: "42px",
                                height: "42px"
                              }}
                              onClick={() => {
                                setVentaSeleccionada(venta);
                                setShowEditar(true);
                              }}
                            >
                              ✏️
                            </Button>

                            <Button
                              variant="light"
                              className="rounded-circle shadow-sm"
                              style={{
                                width: "42px",
                                height: "42px"
                              }}
                              onClick={() => {
                                setVentaSeleccionada(venta);
                                setShowEliminar(true);
                              }}
                            >
                              🗑️
                            </Button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td colSpan="6" className="text-center py-5">

                        <div className="py-4">

                          <div style={{ fontSize: "4rem" }}>
                            📊
                          </div>

                          <h4 className="fw-bold mt-3">
                            No hay ventas registradas
                          </h4>

                          <p className="text-muted">
                            Comienza agregando una nueva venta
                          </p>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </Table>

            </Card>

          </div>

          {/* MOBILE */}

          <div className="d-block d-lg-none">

            <Row className="g-3">

              {ventas.map((venta) => (

                <Col xs={12} key={venta.id_venta}>

                  <Card className="border-0 shadow-sm rounded-4 overflow-hidden">

                    <Card.Body>

                      <div className="d-flex gap-3">

                        {venta.productos?.imagen ? (

                          <img
                            src={venta.productos.imagen}
                            alt={venta.productos.nombre}
                            style={{
                              width: "85px",
                              height: "85px",
                              objectFit: "cover",
                              borderRadius: "18px"
                            }}
                          />

                        ) : (

                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{
                              width: "85px",
                              height: "85px",
                              borderRadius: "18px",
                              fontSize: "2rem"
                            }}
                          >
                            📦
                          </div>

                        )}

                        <div className="flex-grow-1">

                          <div className="d-flex justify-content-between">

                            <h5 className="fw-bold mb-1">
                              {venta.productos?.nombre || "Sin producto"}
                            </h5>

                            <span className="text-muted small">
                              #{venta.id_venta}
                            </span>

                          </div>

                          <Badge
                            bg="light"
                            text="dark"
                            className="border rounded-pill px-3 py-2 mb-2"
                          >
                            {venta.productos?.categoria || "Sin categoría"}
                          </Badge>

                          <p className="mb-1">
                            <strong>Cantidad:</strong> {venta.cantidad}
                          </p>

                          <h5 className="fw-bold text-success mb-3">
                            C$ {parseFloat(venta.total || 0).toFixed(2)}
                          </h5>

                          <div className="d-flex gap-2">

                            <Button
                              variant="warning"
                              className="rounded-4 w-50 fw-semibold"
                              onClick={() => {
                                setVentaSeleccionada(venta);
                                setShowEditar(true);
                              }}
                            >
                              Editar
                            </Button>

                            <Button
                              variant="danger"
                              className="rounded-4 w-50 fw-semibold"
                              onClick={() => {
                                setVentaSeleccionada(venta);
                                setShowEliminar(true);
                              }}
                            >
                              Eliminar
                            </Button>

                          </div>

                        </div>

                      </div>

                    </Card.Body>

                  </Card>

                </Col>

              ))}

            </Row>

          </div>

        </>

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