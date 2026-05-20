import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

import CardKPI from "../components/dashboard/CardKPI";
import { supabase } from "../database/supabaseconfig";

const Dashboard = () => {

  const [ventas, setVentas] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [productosVendidos, setProductosVendidos] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {

    try {

      setLoading(true);

      const { data, error } = await supabase
        .from("Hecho_Ventas")
        .select(`
          total,
          cantidad
        `);

      if (error) {
        console.error("Error:", error.message);
        return;
      }

      // TOTAL VENTAS
      const totalVentas = data.length;

      // TOTAL INGRESOS
      const totalIngresos = data.reduce(
        (acc, venta) => acc + Number(venta.total || 0),
        0
      );

      // TOTAL PRODUCTOS VENDIDOS
      const totalProductos = data.reduce(
        (acc, venta) => acc + Number(venta.cantidad || 0),
        0
      );

      setVentas(totalVentas);
      setIngresos(totalIngresos.toFixed(2));
      setProductosVendidos(totalProductos);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  return (

    <Container className="py-4">

      <div className="mb-4">

        <h2 className="fw-bold">
          📊 Dashboard
        </h2>

        <p className="text-muted">
          Resumen general del sistema
        </p>

      </div>

      {loading ? (

        <div className="text-center py-5">

          <Spinner animation="border" variant="primary" />

          <p className="mt-3">
            Cargando dashboard...
          </p>

        </div>

      ) : (

        <>

          <Row className="g-4">

            <Col md={4}>

              <CardKPI
                titulo="🧾 Total Ventas"
                valor={ventas}
              />

            </Col>

            <Col md={4}>

              <CardKPI
                titulo="💰 Ingresos"
                valor={`C$ ${ingresos}`}
              />

            </Col>

            <Col md={4}>

              <CardKPI
                titulo="📦 Productos Vendidos"
                valor={productosVendidos}
              />

            </Col>

          </Row>

          {ventas === 0 && (

            <Alert variant="info" className="mt-4">

              No hay ventas registradas todavía.

            </Alert>

          )}

        </>

      )}

    </Container>
  );
};

export default Dashboard;