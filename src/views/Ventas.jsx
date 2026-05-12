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

      // VENTAS
      const { data: ventasData, error: errorVentas } = await supabase
        .from("Hecho_Ventas")
        .select("*")
        .order("id_venta", { ascending: false });

      if (errorVentas) {
        console.error("Error ventas:", errorVentas);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
    .from("Hecho_Ventas")
    .select(`
        *,
        Dim_Producto!id_producto (
            nombre,
            imagen,
            categoria
        )
    `)
    .order("id_venta", { ascending: false });

      // PRODUCTOS
      const { data: productosData, error: errorProductos } = await supabase
        .from("Dim_Producto")
        .select("*");

      if (errorProductos) {
        console.error("Error productos:", errorProductos);
        setLoading(false);
        return;
      }

      // UNIR DATOS
      const ventasCompletas = ventasData.map((venta) => {

        const producto = productosData.find(
          (p) => p.id_producto === venta.id_producto
        );

        return {
          ...venta,
          producto
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

    <Container className="py-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-5">

        <div>

          <h1 className="fw-bold mb-1">
            🧾 Gestión de Ventas
          </h1>

          <p className="text-muted mb-0">
            Administra todas las ventas registradas
          </p>

        </div>

        <Button
          variant="success"
          size="lg"
          className="shadow-sm"
          onClick={() => setShowRegistro(true)}
        >
          ➕ Nueva Venta
        </Button>

      </div>

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

          <div className="d-none d-md-block">

            <Card className="border-0 shadow rounded-4 overflow-hidden">

              <Table hover responsive className="mb-0 align-middle">

                <thead className="table-dark">

                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th className="text-center">
                      Acciones
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {ventas.length > 0 ? (

                    ventas.map((venta) => (

                      <tr key={venta.id_venta}>

                        <td>
                          #{venta.id_venta}
                        </td>

                        <td>

                          {venta.Dim_Producto?.imagen ? (

                            <img
                              src={venta.Dim_Producto.imagen}
                              alt={venta.Dim_Producto.nombre}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "10px"
                              }}
                            />

                          ) : (

                            <div
                              className="bg-light d-flex align-items-center justify-content-center"
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "10px"
                              }}
                            >
                              📦
                            </div>

                          )}

                        </td>

                        <td className="fw-semibold">
                          {venta.Dim_Producto?.nombre || "Sin producto"}
                        </td>

                        <td>

                          <Badge bg="secondary">
                            {venta.Dim_Producto?.categoria || "Sin categoría"}
                          </Badge>

                        </td>

                        <td>
                          {venta.cantidad}
                        </td>

                        <td className="fw-bold text-success">
                          C$ {parseFloat(venta.total || 0).toFixed(2)}
                        </td>

                        <td className="text-center">

                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() => {
                              setVentaSeleccionada(venta);
                              setShowEditar(true);
                            }}
                          >
                            ✏️
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setVentaSeleccionada(venta);
                              setShowEliminar(true);
                            }}
                          >
                            🗑️
                          </Button>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td colSpan="7" className="text-center py-5">

                        <h5>
                          No hay ventas registradas
                        </h5>

                        <p className="text-muted">
                          Agrega una nueva venta
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </Table>

            </Card>

          </div>

          {/* TARJETAS MOBILE */}

          <div className="d-block d-md-none">

            <Row className="g-3">

              {ventas.map((venta) => (

                <Col xs={12} key={venta.id_venta}>

                  <Card className="border-0 shadow rounded-4">

                    <Card.Body>

                      <div className="d-flex gap-3">

                        {venta.Dim_Producto?.imagen ? (

                          <img
                            src={venta.Dim_Producto.imagen}
                            alt={venta.Dim_Producto.nombre}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "10px"
                            }}
                          />

                        ) : (

                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "10px"
                            }}
                          >
                            📦
                          </div>

                        )}

                        <div className="flex-grow-1">

                          <h5 className="mb-1">
                            {venta.Dim_Producto?.nombre || "Sin producto"}
                          </h5>

                          <Badge bg="secondary" className="mb-2">
                            {venta.Dim_Producto?.categoria || "Sin categoría"}
                          </Badge>

                          <p className="mb-1">
                            <strong>Cantidad:</strong> {venta.cantidad}
                          </p>

                          <p className="fw-bold text-success mb-3">
                            C$ {parseFloat(venta.total || 0).toFixed(2)}
                          </p>

                          <div className="d-flex gap-2">

                            <Button
                              size="sm"
                              variant="warning"
                              className="w-50"
                              onClick={() => {
                                setVentaSeleccionada(venta);
                                setShowEditar(true);
                              }}
                            >
                              Editar
                            </Button>

                            <Button
                              size="sm"
                              variant="danger"
                              className="w-50"
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