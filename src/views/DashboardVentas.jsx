import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Table
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const DashboardVentas = () => {

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {

    try {

      setLoading(true);

      const { data, error } = await supabase
        .from("Hecho_Ventas")
        .select("*");

      if (error) {
        console.error("Error Supabase:", error);
        return;
      }

      setVentas(data || []);

    } catch (err) {

      console.error("Error:", err);

    } finally {

      setLoading(false);
    }
  };

  // KPIs
  const totalIngresos = ventas.reduce(
    (acc, venta) => acc + Number(venta.total || 0),
    0
  );

  const totalVentas = ventas.length;

  const totalProductos = ventas.reduce(
    (acc, venta) => acc + Number(venta.cantidad || 0),
    0
  );

  return (

    <Container className="py-4">

      <h2 className="mb-4 fw-bold">
        📊 Dashboard de Ventas
      </h2>

      {loading ? (

        <div className="text-center py-5">

          <Spinner animation="border" variant="primary" />

          <p className="mt-3">
            Cargando datos...
          </p>

        </div>

      ) : (

        <>

          {/* KPIs */}

          <Row className="mb-4 g-4">

            <Col md={4}>

              <Card className="shadow-sm border-0 rounded-4 p-3">

                <h5>💰 Ingresos</h5>

                <h3>
                  C$ {totalIngresos.toFixed(2)}
                </h3>

              </Card>

            </Col>

            <Col md={4}>

              <Card className="shadow-sm border-0 rounded-4 p-3">

                <h5>🧾 Ventas</h5>

                <h3>{totalVentas}</h3>

              </Card>

            </Col>

            <Col md={4}>

              <Card className="shadow-sm border-0 rounded-4 p-3">

                <h5>📦 Productos Vendidos</h5>

                <h3>{totalProductos}</h3>

              </Card>

            </Col>

          </Row>

          {/* TABLA */}

          <Card className="shadow-sm border-0 rounded-4 p-3">

            <h5 className="mb-3">
              Detalle de Ventas
            </h5>

            <Table responsive hover striped>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Cantidad</th>
                  <th>Total</th>

                </tr>

              </thead>

              <tbody>

                {ventas.map((venta) => (

                  <tr key={venta.id_venta}>

                    <td>{venta.id_venta}</td>

                    <td>{venta.cantidad}</td>

                    <td>
                      C$ {Number(venta.total).toFixed(2)}
                    </td>

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