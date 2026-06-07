import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseconfig";

const ACCIONES_RAPIDAS = [
  { ruta: "/productos", icono: "bi-box-seam", titulo: "Productos", desc: "Gestionar inventario" },
  { ruta: "/ventas", icono: "bi-receipt", titulo: "Ventas", desc: "Registrar movimientos" },
  { ruta: "/categorias", icono: "bi-tags", titulo: "Categorías", desc: "Organizar catálogo" },
  { ruta: "/catalogo", icono: "bi-shop", titulo: "Catálogo", desc: "Ver productos públicos" },
];

const Inicio = () => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);

  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    cantidadVentas: 0,
    productos: 0,
    categorias: 0,
    stockBajo: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [{ data: ventas }, { count: productos }, { count: categorias }, { data: productosData }] =
        await Promise.all([
          supabase.from("ventas").select("total"),
          supabase.from("productos").select("*", { count: "exact", head: true }),
          supabase.from("categorias").select("*", { count: "exact", head: true }),
          supabase.from("productos").select("stock"),
        ]);

      const totalVentas =
        ventas?.reduce((acumulado, venta) => acumulado + Number(venta.total || 0), 0) || 0;

      const stockBajo =
        productosData?.filter((p) => parseInt(p.stock, 10) <= 5).length || 0;

      setEstadisticas({
        totalVentas,
        cantidadVentas: ventas?.length || 0,
        productos: productos || 0,
        categorias: categorias || 0,
        stockBajo,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const saludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  if (cargando) {
    return (
      <Container className="text-center py-5 fade-in">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted loading-pulse">Cargando panel…</p>
      </Container>
    );
  }

  const stats = [
    {
      icono: "bi-cash-stack",
      label: "Ingresos totales",
      valor: `C$ ${estadisticas.totalVentas.toFixed(2)}`,
      acento: "stat-accent-brand",
    },
    {
      icono: "bi-receipt-cutoff",
      label: "Ventas registradas",
      valor: estadisticas.cantidadVentas,
      acento: "stat-accent-success",
    },
    {
      icono: "bi-box-seam",
      label: "Productos",
      valor: estadisticas.productos,
      acento: "stat-accent-cyan",
    },
    {
      icono: "bi-tags",
      label: "Categorías",
      valor: estadisticas.categorias,
      acento: "stat-accent-accent",
    },
  ];

  return (
    <Container fluid="lg" className="px-0">
      <div className="page-hero home-hero animate-fade-left mb-4">
        <Row className="align-items-center g-4">
          <Col lg={8}>
            <span className="home-kicker">{saludo()}</span>
            <h1 className="display-5 fw-bold mb-2">Pulpería Chevez</h1>
            <p className="lead mb-0">
              Panel de control — inventario, ventas y resumen en un solo lugar.
            </p>
          </Col>
          <Col lg={4} className="text-lg-end">
            <Button
              variant="light"
              size="lg"
              className="btn-hero-cta rounded-pill px-4 btn-interactive"
              onClick={() => navigate("/dashboard")}
            >
              <i className="bi bi-graph-up-arrow me-2" aria-hidden="true" />
              Ver resumen
            </Button>
          </Col>
        </Row>
      </div>

      {estadisticas.stockBajo > 0 && (
        <div className="home-alert animate-scale-in mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true" />
          <span>
            <strong>{estadisticas.stockBajo}</strong>{" "}
            {estadisticas.stockBajo === 1 ? "producto tiene" : "productos tienen"} stock bajo (≤ 5 unidades).
          </span>
          <Button
            variant="link"
            className="home-alert-link btn-interactive p-0 ms-2"
            onClick={() => navigate("/productos")}
          >
            Revisar inventario
          </Button>
        </div>
      )}

      <Row className="g-3 g-md-4 stagger-children mb-4">
        {stats.map((stat) => (
          <Col sm={6} lg={3} key={stat.label}>
            <Card className={`home-stat-card h-100 ${stat.acento}`}>
              <Card.Body className="d-flex align-items-start gap-3">
                <div className="home-stat-icon">
                  <i className={`bi ${stat.icono}`} aria-hidden="true" />
                </div>
                <div>
                  <div className="stat-label">{stat.label}</div>
                  <p className="stat-value mb-0">{stat.valor}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="welcome-panel animate-fade-right">
            <Card.Body className="p-4">
              <h4 className="mb-3">
                <i className="bi bi-lightning-charge-fill me-2 text-primary" aria-hidden="true" />
                Accesos rápidos
              </h4>
              <Row className="g-3 stagger-children">
                {ACCIONES_RAPIDAS.map((accion) => (
                  <Col sm={6} key={accion.ruta}>
                    <button
                      type="button"
                      className="quick-action-btn btn-interactive w-100"
                      onClick={() => navigate(accion.ruta)}
                    >
                      <span className="quick-action-icon">
                        <i className={`bi ${accion.icono}`} aria-hidden="true" />
                      </span>
                      <span className="quick-action-text">
                        <strong>{accion.titulo}</strong>
                        <small>{accion.desc}</small>
                      </span>
                      <i className="bi bi-arrow-right quick-action-arrow" aria-hidden="true" />
                    </button>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="home-info-card animate-fade-right h-100">
            <Card.Body className="p-4 d-flex flex-column">
              <h4 className="mb-3">Estado del negocio</h4>
              <ul className="home-info-list list-unstyled mb-4 flex-grow-1">
                <li>
                  <span>Ingresos acumulados</span>
                  <strong>C$ {estadisticas.totalVentas.toFixed(2)}</strong>
                </li>
                <li>
                  <span>Operaciones registradas</span>
                  <strong>{estadisticas.cantidadVentas}</strong>
                </li>
                <li>
                  <span>Artículos en catálogo</span>
                  <strong>{estadisticas.productos}</strong>
                </li>
                <li>
                  <span>Grupos de categorías</span>
                  <strong>{estadisticas.categorias}</strong>
                </li>
              </ul>
              <Button
                variant="primary"
                className="rounded-pill fw-bold btn-interactive"
                onClick={() => navigate("/ventas")}
              >
                <i className="bi bi-plus-circle me-2" aria-hidden="true" />
                Nueva venta
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;
