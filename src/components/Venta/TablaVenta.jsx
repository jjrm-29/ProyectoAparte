import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Spinner,
  Card,
  Badge,
  Button,
  Modal,
  Row,
  Col,
  Image
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

import ModalEditarVenta from "./ModalEditarVenta";
import ModalEliminarVenta from "./ModalEliminarVenta";

const TablaVenta = () => {

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDetalle, setShowDetalle] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState(null);

  const [showEditar, setShowEditar] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null);

  const [showEliminar, setShowEliminar] = useState(false);
  const [ventaEliminar, setVentaEliminar] = useState(null);

  useEffect(() => {
    cargarVentas();
  }, []);

  // =========================================
  // CARGAR VENTAS
  // =========================================

  const cargarVentas = async () => {

    try {

      setLoading(true);

      const { data, error } = await supabase
        .from("detalle_venta")
        .select(`
          *,
          ventas (
            id_venta,
            fecha,
            total
          ),
          productos (
            id_producto,
            nombre,
            categoria,
            imagen
          )
        `)
        .order("id_detalle", { ascending: false });

      if (error) {

        console.error(error);
        return;
      }

      setVentas(data || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // DETALLE
  // =========================================

  const abrirDetalle = (venta) => {

    setVentaDetalle(venta);
    setShowDetalle(true);
  };

  // =========================================
  // EDITAR
  // =========================================

  const abrirEditar = (venta) => {

    setVentaEditar(venta);
    setShowEditar(true);
  };

  // =========================================
  // ELIMINAR
  // =========================================

  const abrirEliminar = (venta) => {

    setVentaEliminar(venta);
    setShowEliminar(true);
  };

  const eliminarVenta = async () => {

    try {

      await supabase
        .from("detalle_venta")
        .delete()
        .eq("id_detalle", ventaEliminar.id_detalle);

      setShowEliminar(false);

      cargarVentas();

    } catch (error) {

      console.error(error);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="text-center py-5">

        <Spinner
          animation="border"
          variant="primary"
        />

      </div>

    );
  }

  return (

    <>

      <Container fluid>

        <Card className="border-0 rounded-5 shadow-lg overflow-hidden">

          <div
            className="p-4"
            style={{
              background: "linear-gradient(135deg,#0f172a,#1e293b)"
            }}
          >

            <h3 className="text-white fw-bold mb-1">
              Historial de Ventas
            </h3>

            <p className="text-light opacity-75 mb-0">
              Visualiza y administra todas las ventas registradas
            </p>

          </div>

          <Table hover responsive className="align-middle mb-0">

            <thead
              style={{
                background: "#111827",
                color: "white"
              }}
            >

              <tr>

                <th>ID</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>

              </tr>

            </thead>

            <tbody>

              {ventas.length > 0 ? (

                ventas.map((venta) => (

                  <tr key={venta.id_detalle}>

                    <td className="fw-bold text-primary">
                      #{venta.ventas?.id_venta}
                    </td>

                    <td>

                      <div className="d-flex align-items-center gap-3">

                        {venta.productos?.imagen ? (

                          <img
                            src={venta.productos.imagen}
                            alt={venta.productos.nombre}
                            className="producto-img"
                          />

                        ) : (

                          <div className="producto-placeholder">
                            📦
                          </div>

                        )}

                        <div>

                          <h6 className="fw-bold mb-1">
                            {venta.productos?.nombre}
                          </h6>

                          <Badge
                            bg="light"
                            text="dark"
                            className="rounded-pill px-3 py-2 border"
                          >
                            {venta.productos?.categoria}
                          </Badge>

                        </div>

                      </div>

                    </td>

                    <td className="fw-semibold">
                      {venta.cantidad}
                    </td>

                    <td className="fw-bold text-success">
                      C$ {Number(venta.subtotal).toFixed(2)}
                    </td>

                    <td>

                      <div className="d-flex gap-2 flex-wrap">

                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => abrirDetalle(venta)}
                        >
                          👁 Ver
                        </Button>

                        <Button
                          variant="warning"
                          size="sm"
                          className="rounded-pill px-3 text-white"
                          onClick={() => abrirEditar(venta)}
                        >
                          ✏️ Editar
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => abrirEliminar(venta)}
                        >
                          🗑 Eliminar
                        </Button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-5"
                  >

                    <div>

                      <div style={{ fontSize: "4rem" }}>
                        📦
                      </div>

                      <h4 className="fw-bold mt-3">
                        No hay ventas registradas
                      </h4>

                      <p className="text-muted">
                        Aún no existen ventas en el sistema
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </Table>

        </Card>

      </Container>

      {/* ========================================= */}
      {/* MODAL EDITAR */}
      {/* ========================================= */}

      <ModalEditarVenta
        show={showEditar}
        onHide={() => setShowEditar(false)}
        venta={ventaEditar}
        onSuccess={cargarVentas}
      />

      {/* ========================================= */}
      {/* MODAL ELIMINAR */}
      {/* ========================================= */}

      <ModalEliminarVenta
        show={showEliminar}
        onHide={() => setShowEliminar(false)}
        onConfirmar={eliminarVenta}
        venta={ventaEliminar}
      />

      {/* ========================================= */}
      {/* MODAL DETALLE */}
      {/* ========================================= */}

      <Modal
        show={showDetalle}
        onHide={() => setShowDetalle(false)}
        centered
        size="lg"
      >

        <Modal.Header
          closeButton
          className="border-0 pb-0"
        >

          <Modal.Title className="fw-bold fs-3">
            🧾 Detalle de Venta
          </Modal.Title>

        </Modal.Header>

        <Modal.Body className="p-4">

          {ventaDetalle && (

            <Row className="align-items-center g-4">

              {/* IMAGEN */}

              <Col md={5} className="text-center">

                <div
                  className="bg-light rounded-5 overflow-hidden shadow-sm mx-auto"
                  style={{
                    width: "250px",
                    height: "250px"
                  }}
                >

                  {ventaDetalle.productos?.imagen ? (

                    <Image
                      src={ventaDetalle.productos.imagen}
                      fluid
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />

                  ) : (

                    <div className="d-flex justify-content-center align-items-center h-100">
                      <span style={{ fontSize: "5rem" }}>
                        📦
                      </span>
                    </div>

                  )}

                </div>

              </Col>

              {/* INFO */}

              <Col md={7}>

                <div className="detalle-card">

                  <Badge
                    bg="primary"
                    className="rounded-pill px-3 py-2 mb-3"
                  >
                    Venta #{ventaDetalle.ventas?.id_venta}
                  </Badge>

                  <h2 className="fw-bold mb-3">
                    {ventaDetalle.productos?.nombre}
                  </h2>

                  <div className="detalle-item">

                    <span className="detalle-label">
                      Categoría
                    </span>

                    <span className="detalle-value">
                      {ventaDetalle.productos?.categoria}
                    </span>

                  </div>

                  <div className="detalle-item">

                    <span className="detalle-label">
                      Cantidad
                    </span>

                    <span className="detalle-value">
                      {ventaDetalle.cantidad}
                    </span>

                  </div>

                  <div className="detalle-item">

                    <span className="detalle-label">
                      Precio Unitario
                    </span>

                    <span className="detalle-value text-primary fw-bold">
                      C$ {Number(
                        ventaDetalle.precio_unitario
                      ).toFixed(2)}
                    </span>

                  </div>

                  <div className="detalle-item border-0">

                    <span className="detalle-label fw-bold">
                      Subtotal
                    </span>

                    <span className="detalle-total">
                      C$ {Number(
                        ventaDetalle.subtotal
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </Col>

            </Row>

          )}

        </Modal.Body>

      </Modal>

      {/* ========================================= */}
      {/* ESTILOS */}
      {/* ========================================= */}

      <style>{`

        .producto-img{
          width:65px;
          height:65px;
          object-fit:cover;
          border-radius:18px;
          border:2px solid #f1f5f9;
        }

        .producto-placeholder{
          width:65px;
          height:65px;
          border-radius:18px;
          background:#f8fafc;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:1.7rem;
        }

        .detalle-card{
          background:#f8fafc;
          border-radius:24px;
          padding:30px;
          box-shadow:0 10px 25px rgba(0,0,0,.05);
        }

        .detalle-item{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 0;
          border-bottom:1px solid #e5e7eb;
        }

        .detalle-label{
          color:#6b7280;
          font-weight:600;
        }

        .detalle-value{
          color:#111827;
          font-weight:700;
        }

        .detalle-total{
          font-size:1.5rem;
          font-weight:800;
          color:#16a34a;
        }

        tbody tr{
          transition:.2s ease;
        }

        tbody tr:hover{
          background:#f8fafc;
        }

      `}</style>

    </>
  );
};

export default TablaVenta;