import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Table } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

const DashboardVentas = () => {

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const { data, error } = await supabase
        .from("Hecho_Ventas")
        .select(`
          total,
          cantidad,
          Dim_Tiempo (fecha),
          Dim_Producto (nombre, categoria)
        `);

      if (error) {
        console.error(error);
        return;
      }

      setVentas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 métricas
  const totalIngresos = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalVentas = ventas.length;
  const totalProductos = ventas.reduce((acc, v) => acc + v.cantidad, 0);

  return (
    <Container className="py-4">

      <h2 className="mb-4">📊 Dashboard de Ventas</h2>

      {loading ? (
        <div className="text-center">
          <Spinner />
          <p>Cargando datos...</p>
        </div>
      ) : (
        <>
          {/* 🔥 KPIs */}
          <Row className="mb-4">

            <Col md={4}>
              <Card className="p-3 shadow-sm">
                <h5>💰 Ingresos</h5>
                <h3>C$ {totalIngresos}</h3>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-3 shadow-sm">
                <h5>🧾 Ventas</h5>
                <h3>{totalVentas}</h3>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-3 shadow-sm">
                <h5>📦 Productos vendidos</h5>
                <h3>{totalProductos}</h3>
              </Card>
            </Col>

          </Row>

          {/* 🔥 Tabla */}
          <Card className="p-3 shadow-sm">
            <h5>Detalle de ventas</h5>

            <Table striped>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {ventas.map((v, i) => (
                  <tr key={i}>
                    <td>{v.Dim_Tiempo?.fecha}</td>
                    <td>{v.Dim_Producto?.nombre}</td>
                    <td>{v.Dim_Producto?.categoria}</td>
                    <td>{v.cantidad}</td>
                    <td>C$ {v.total}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

          </Card>
        </>
      )}

    </Container>
  );
};

export default DashboardVentas;     