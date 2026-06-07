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

  const abrirDetalle = (venta) => {
    setVentaDetalle(venta);
    setShowDetalle(true);
  };

  const abrirEditar = (venta) => {
    setVentaEditar(venta);
    setShowEditar(true);
  };

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

  if (loading) {
    return (
      <div className="text-center py-5 fade-in">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted loading-pulse">Cargando ventas…</p>
      </div>
    );
  }

  return (
    <>
      <Container fluid className="px-0">
        <Card className="data-table-card border-0 overflow-hidden animate-fade-right">
          <div className="table-hero-bar d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">
                <i className="bi bi-receipt me-2" aria-hidden="true" />
                Historial de Ventas
              </h4>
              <small className="table-hero-sub">Visualiza y administra las ventas registradas</small>
            </div>
            <span className="table-hero-count">{ventas.length} registros</span>
          </div>

          <div className="table-responsive">
            <Table hover className="align-middle mb-0 data-table">
              <thead>
                <tr>
                  <th className="col-id">Venta</th>
                  <th className="col-producto">Producto</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th className="text-center col-acciones">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {ventas.length > 0 ? (
                  ventas.map((venta, index) => (
                    <tr
                      key={venta.id_detalle}
                      className="table-row-animate"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <td className="col-id fw-semibold text-muted">
                        #{venta.ventas?.id_venta}
                      </td>

                      <td className="col-producto">
                        <div className="table-product-cell">
                          {venta.productos?.imagen ? (
                            <img
                              src={venta.productos.imagen}
                              alt={venta.productos.nombre}
                              className="table-product-thumb"
                            />
                          ) : (
                            <div className="table-product-thumb table-product-thumb--empty">
                              <i className="bi bi-box-seam" aria-hidden="true" />
                            </div>
                          )}
                          <div className="table-product-info">
                            <span
                              className="table-product-name"
                              title={venta.productos?.nombre}
                            >
                              {venta.productos?.nombre || "Sin producto"}
                            </span>
                            <Badge bg="primary" pill className="table-badge table-badge--inline">
                              {venta.productos?.categoria || "—"}
                            </Badge>
                          </div>
                        </div>
                      </td>

                      <td className="fw-semibold">{venta.cantidad}</td>

                      <td>
                        <span className="table-price">
                          C$ {Number(venta.subtotal).toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <Button
                            variant="primary"
                            size="sm"
                            className="btn-action btn-interactive"
                            onClick={() => abrirDetalle(venta)}
                            title="Ver detalle"
                          >
                            <i className="bi bi-eye" aria-hidden="true" />
                            <span className="d-none d-xl-inline ms-1">Ver</span>
                          </Button>

                          <Button
                            variant="warning"
                            size="sm"
                            className="btn-action btn-interactive"
                            onClick={() => abrirEditar(venta)}
                            title="Editar venta"
                          >
                            <i className="bi bi-pencil-square" aria-hidden="true" />
                            <span className="d-none d-xl-inline ms-1">Editar</span>
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            className="btn-action btn-interactive"
                            onClick={() => abrirEliminar(venta)}
                            title="Eliminar venta"
                          >
                            <i className="bi bi-trash" aria-hidden="true" />
                            <span className="d-none d-xl-inline ms-1">Eliminar</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="table-empty-state py-4">
                        <i className="bi bi-receipt table-empty-icon" aria-hidden="true" />
                        <h5 className="fw-bold mt-3">No hay ventas registradas</h5>
                        <p className="text-muted mb-0">Aún no existen ventas en el sistema</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      <ModalEditarVenta
        show={showEditar}
        onHide={() => setShowEditar(false)}
        venta={ventaEditar}
        onSuccess={cargarVentas}
      />

      <ModalEliminarVenta
        show={showEliminar}
        onHide={() => setShowEliminar(false)}
        onConfirmar={eliminarVenta}
        venta={ventaEliminar}
      />

      <Modal
        show={showDetalle}
        onHide={() => setShowDetalle(false)}
        centered
        size="lg"
        className="modal-animate"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-3">
            <i className="bi bi-receipt me-2" aria-hidden="true" />
            Detalle de Venta
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          {ventaDetalle && (
            <Row className="align-items-center g-4">
              <Col md={5} className="text-center">
                <div className="venta-detalle-img-wrap mx-auto">
                  {ventaDetalle.productos?.imagen ? (
                    <Image
                      src={ventaDetalle.productos.imagen}
                      fluid
                      className="venta-detalle-img"
                    />
                  ) : (
                    <div className="venta-detalle-img venta-detalle-img--empty">
                      <i className="bi bi-box-seam" aria-hidden="true" />
                    </div>
                  )}
                </div>
              </Col>

              <Col md={7}>
                <div className="venta-detalle-card">
                  <Badge bg="primary" pill className="table-badge mb-3">
                    Venta #{ventaDetalle.ventas?.id_venta}
                  </Badge>

                  <h2 className="fw-bold mb-3 table-product-name table-product-name--lg">
                    {ventaDetalle.productos?.nombre}
                  </h2>

                  <div className="venta-detalle-item">
                    <span className="venta-detalle-label">Categoría</span>
                    <span className="venta-detalle-value">{ventaDetalle.productos?.categoria}</span>
                  </div>

                  <div className="venta-detalle-item">
                    <span className="venta-detalle-label">Cantidad</span>
                    <span className="venta-detalle-value">{ventaDetalle.cantidad}</span>
                  </div>

                  <div className="venta-detalle-item">
                    <span className="venta-detalle-label">Precio unitario</span>
                    <span className="venta-detalle-value text-primary fw-bold">
                      C$ {Number(ventaDetalle.precio_unitario).toFixed(2)}
                    </span>
                  </div>

                  <div className="venta-detalle-item border-0">
                    <span className="venta-detalle-label fw-bold">Subtotal</span>
                    <span className="table-price table-price--lg">
                      C$ {Number(ventaDetalle.subtotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TablaVenta;
