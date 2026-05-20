import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Table,
  Badge
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

    <div className="dashboard-bg py-5">

      <Container>

        {/* HEADER */}

        <div className="mb-5">

          <Badge bg="primary" className="px-3 py-2 rounded-pill mb-3">
            PANEL ADMINISTRATIVO
          </Badge>

          <h1 className="fw-bold text-white display-5">
            Dashboard de Ventas
          </h1>

          <p className="text-light opacity-75">
            Visualiza estadísticas, ingresos y rendimiento de tu negocio
          </p>

        </div>

        {loading ? (

          <div className="text-center py-5">

            <Spinner animation="border" variant="light" />

            <p className="mt-3 text-light">
              Cargando datos...
            </p>

          </div>

        ) : (

          <>

            {/* KPI */}

            <Row className="g-4 mb-5">

              <Col md={4}>

                <Card className="kpi-card ingresos-card border-0 shadow-lg rounded-4">

                  <Card.Body>

                    <div className="d-flex justify-content-between align-items-center">

                      <div>

                        <p className="kpi-title">
                          INGRESOS
                        </p>

                        <h2 className="fw-bold text-white">
                          C$ {totalIngresos.toFixed(2)}
                        </h2>

                      </div>

                      <div className="icon-circle">
                        💰
                      </div>

                    </div>

                  </Card.Body>

                </Card>

              </Col>

              <Col md={4}>

                <Card className="kpi-card ventas-card border-0 shadow-lg rounded-4">

                  <Card.Body>

                    <div className="d-flex justify-content-between align-items-center">

                      <div>

                        <p className="kpi-title">
                          VENTAS
                        </p>

                        <h2 className="fw-bold text-white">
                          {totalVentas}
                        </h2>

                      </div>

                      <div className="icon-circle">
                        📊
                      </div>

                    </div>

                  </Card.Body>

                </Card>

              </Col>

              <Col md={4}>

                <Card className="kpi-card productos-card border-0 shadow-lg rounded-4">

                  <Card.Body>

                    <div className="d-flex justify-content-between align-items-center">

                      <div>

                        <p className="kpi-title">
                          PRODUCTOS
                        </p>

                        <h2 className="fw-bold text-white">
                          {totalProductos}
                        </h2>

                      </div>

                      <div className="icon-circle">
                        📦
                      </div>

                    </div>

                  </Card.Body>

                </Card>

              </Col>

            </Row>

            {/* TABLA */}

            <Card className="border-0 rounded-4 shadow-lg table-card">

              <Card.Body className="p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>

                    <h4 className="fw-bold mb-1">
                      Historial de Ventas
                    </h4>

                    <p className="text-muted mb-0">
                      Últimos registros almacenados
                    </p>

                  </div>

                </div>

                <Table responsive hover className="align-middle custom-table">

                  <thead>

                    <tr>

                      <th>ID</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                      <th>Estado</th>

                    </tr>

                  </thead>

                  <tbody>

                    {ventas.map((venta) => (

                      <tr key={venta.id_venta}>

                        <td>
                          <span className="fw-semibold">
                            #{venta.id_venta}
                          </span>
                        </td>

                        <td>

                          <Badge bg="info" className="px-3 py-2 rounded-pill">
                            {venta.cantidad}
                          </Badge>

                        </td>

                        <td className="fw-bold text-success">

                          C$ {Number(venta.total).toFixed(2)}

                        </td>

                        <td>

                          <Badge bg="success" className="px-3 py-2 rounded-pill">
                            Completada
                          </Badge>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </Table>

              </Card.Body>

            </Card>

          </>

        )}

      </Container>

      {/* ESTILOS */}

      <style>{`

        .dashboard-bg{
          min-height:100vh;
          background:
            linear-gradient(135deg,#0f172a,#1e293b,#111827);
        }

        .kpi-card{
          overflow:hidden;
          transition:.3s;
        }

        .kpi-card:hover{
          transform:translateY(-5px);
        }

        .ingresos-card{
          background:linear-gradient(135deg,#16a34a,#22c55e);
        }

        .ventas-card{
          background:linear-gradient(135deg,#2563eb,#3b82f6);
        }

        .productos-card{
          background:linear-gradient(135deg,#7c3aed,#8b5cf6);
        }

        .kpi-title{
          color:rgba(255,255,255,.75);
          margin-bottom:5px;
          font-size:.85rem;
          letter-spacing:1px;
        }

        .icon-circle{
          width:60px;
          height:60px;
          border-radius:50%;
          background:rgba(255,255,255,.15);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:1.5rem;
        }

        .table-card{
          background:#ffffff;
        }

        .custom-table thead{
          background:#f1f5f9;
        }

        .custom-table thead th{
          border:none;
          padding:15px;
          color:#334155;
          font-weight:700;
        }

        .custom-table tbody td{
          padding:16px;
          border-color:#f1f5f9;
        }

        .custom-table tbody tr{
          transition:.2s;
        }

        .custom-table tbody tr:hover{
          background:#f8fafc;
        }

      `}</style>

    </div>
  );
};

export default DashboardVentas;