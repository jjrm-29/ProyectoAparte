import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

const Inicio = () => {
  const [cargando, setCargando] = useState(true);

  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    cantidadVentas: 0,
    productos: 0,
    categorias: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const { data: ventas } = await supabase
        .from("ventas")
        .select("total");

      const { count: productos } = await supabase
        .from("productos")
        .select("*", { count: "exact", head: true });

      const { count: categorias } = await supabase
        .from("categorias")
        .select("*", { count: "exact", head: true });

      const totalVentas =
        ventas?.reduce(
          (acumulado, venta) => acumulado + Number(venta.total || 0),
          0
        ) || 0;

      setEstadisticas({
        totalVentas,
        cantidadVentas: ventas?.length || 0,
        productos: productos || 0,
        categorias: categorias || 0,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">Cargando información...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">
        <i className="bi bi-house-fill me-2"></i>
        Inicio
      </h2>

      <Row className="g-4">
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Total Ventas</h6>
              <h3>C$ {estadisticas.totalVentas.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Cantidad Ventas</h6>
              <h3>{estadisticas.cantidadVentas}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Productos</h6>
              <h3>{estadisticas.productos}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Categorías</h6>
              <h3>{estadisticas.categorias}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4 shadow-sm border-0">
        <Card.Body>
          <h4>Bienvenido al sistema de ferretería</h4>
          <p className="text-muted mb-0">
            Desde aquí puedes administrar productos, categorías,
            empleados, clientes y ventas.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Inicio;