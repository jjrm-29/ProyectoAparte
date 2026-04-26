import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import CardKPI from "../components/dashboard/CardKPI";
import { obtenerTotalVentas, obtenerIngresos } from "../services/dashboardService";

const Dashboard = () => {
  const [ventas, setVentas] = useState(0);
  const [ingresos, setIngresos] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const totalVentas = await obtenerTotalVentas();
      const totalIngresos = await obtenerIngresos();

      setVentas(totalVentas);
      setIngresos(totalIngresos);
    };

    cargarDatos();
  }, []);

  return (
    <Container className="py-4">
      <h2>📊 Dashboard</h2>

      <Row>
        <Col md={4}>
          <CardKPI titulo="Ventas" valor={ventas} />
        </Col>

        <Col md={4}>
          <CardKPI titulo="Ingresos" valor={`C$ ${ingresos}`} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;