import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseconfig";
import logo from "../assets/logo_tpo.webp";

const CARACTERISTICAS = [
  {
    icono: "bi-box-seam",
    titulo: "Inventario inteligente",
    desc: "Controla stock, precios y alertas de reposición en tiempo real.",
    color: "landing-feature--brand",
  },
  {
    icono: "bi-receipt-cutoff",
    titulo: "Ventas al instante",
    desc: "Registra cada operación y consulta el historial cuando lo necesites.",
    color: "landing-feature--success",
  },
  {
    icono: "bi-tags",
    titulo: "Categorías ordenadas",
    desc: "Organiza tu catálogo por grupos para encontrar todo más rápido.",
    color: "landing-feature--accent",
  },
  {
    icono: "bi-shop-window",
    titulo: "Catálogo público",
    desc: "Comparte tus productos con clientes a través del catálogo digital.",
    color: "landing-feature--cyan",
  },
];

const ACCESOS = [
  { ruta: "/productos", icono: "bi-box-seam", titulo: "Productos" },
  { ruta: "/ventas", icono: "bi-receipt", titulo: "Ventas" },
  { ruta: "/categorias", icono: "bi-tags", titulo: "Categorías" },
  { ruta: "/dashboard", icono: "bi-graph-up-arrow", titulo: "Resumen" },
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
      <div className="landing-loading">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted loading-pulse">Cargando…</p>
      </div>
    );
  }

  const stats = [
    { valor: estadisticas.productos, label: "Productos", icono: "bi-box-seam" },
    { valor: estadisticas.cantidadVentas, label: "Ventas", icono: "bi-receipt-cutoff" },
    { valor: estadisticas.categorias, label: "Categorías", icono: "bi-tags" },
    { valor: `C$ ${estadisticas.totalVentas.toFixed(0)}`, label: "Ingresos", icono: "bi-cash-stack" },
  ];

  return (
    <div className="landing-page">
      {/* —— Hero —— */}
      <section className="landing-hero">
        <div className="landing-orb landing-orb-1" aria-hidden="true" />
        <div className="landing-orb landing-orb-2" aria-hidden="true" />
        <div className="landing-orb landing-orb-3" aria-hidden="true" />

        <Container className="landing-hero-inner">
          <Row className="align-items-center g-5">
            <Col lg={7} className="animate-fade-left">
              <span className="landing-kicker">{saludo()} · Panel activo</span>
              <h1 className="landing-title">
                Pulpería
                <span className="landing-title-accent"> Chevez</span>
              </h1>
              <p className="landing-subtitle">
                Tu negocio de barrio, digitalizado. Gestiona inventario, ventas
                y catálogo desde un solo lugar — simple, rápido y siempre al día.
              </p>
              <div className="landing-hero-actions">
                <Button
                  size="lg"
                  className="landing-btn-primary btn-interactive"
                  onClick={() => navigate("/ventas")}
                >
                  <i className="bi bi-plus-circle me-2" aria-hidden="true" />
                  Nueva venta
                </Button>
                <Button
                  size="lg"
                  variant="outline-light"
                  className="landing-btn-outline btn-interactive"
                  onClick={() => navigate("/catalogo")}
                >
                  <i className="bi bi-shop me-2" aria-hidden="true" />
                  Ver catálogo
                </Button>
              </div>
            </Col>

            <Col lg={5} className="d-none d-lg-flex justify-content-center animate-scale-in">
              <div className="landing-hero-visual">
                <div className="landing-hero-logo-ring">
                  <img src={logo} alt="Pulpería Chevez" className="landing-hero-logo" />
                </div>
                <div className="landing-hero-badge landing-hero-badge--1">
                  <i className="bi bi-box-seam" aria-hidden="true" />
                  <span>{estadisticas.productos} productos</span>
                </div>
                <div className="landing-hero-badge landing-hero-badge--2">
                  <i className="bi bi-graph-up-arrow" aria-hidden="true" />
                  <span>{estadisticas.cantidadVentas} ventas</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <div className="landing-hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* —— Alerta stock —— */}
      {estadisticas.stockBajo > 0 && (
        <Container className="landing-alert-wrap">
          <div className="home-alert animate-scale-in">
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
        </Container>
      )}

      {/* —— Stats —— */}
      <section className="landing-stats">
        <Container>
          <Row className="g-3 g-md-4 stagger-children">
            {stats.map((stat) => (
              <Col xs={6} lg={3} key={stat.label}>
                <div className="landing-stat-card">
                  <div className="landing-stat-icon">
                    <i className={`bi ${stat.icono}`} aria-hidden="true" />
                  </div>
                  <div className="landing-stat-value">{stat.valor}</div>
                  <div className="landing-stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* —— Características —— */}
      <section className="landing-section">
        <Container>
          <div className="landing-section-header text-center">
            <span className="landing-section-kicker">Funcionalidades</span>
            <h2 className="landing-section-title">Todo lo que necesitas para tu pulpería</h2>
            <p className="landing-section-desc">
              Herramientas pensadas para el día a día: registrar, consultar y crecer sin complicaciones.
            </p>
          </div>

          <Row className="g-4 stagger-children">
            {CARACTERISTICAS.map((feat) => (
              <Col sm={6} lg={3} key={feat.titulo}>
                <div className={`landing-feature-card ${feat.color}`}>
                  <div className="landing-feature-icon">
                    <i className={`bi ${feat.icono}`} aria-hidden="true" />
                  </div>
                  <h3 className="landing-feature-title">{feat.titulo}</h3>
                  <p className="landing-feature-desc">{feat.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* —— Accesos rápidos —— */}
      <section className="landing-section landing-section--muted">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5} className="animate-fade-left">
              <span className="landing-section-kicker">Acceso directo</span>
              <h2 className="landing-section-title">Entra a donde lo necesites</h2>
              <p className="landing-section-desc mb-4">
                Atajos a las secciones más usadas del sistema. Un clic y listo.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill px-4 btn-interactive"
                onClick={() => navigate("/dashboard")}
              >
                <i className="bi bi-bar-chart-line me-2" aria-hidden="true" />
                Ver resumen completo
              </Button>
            </Col>

            <Col lg={7}>
              <div className="landing-access-grid stagger-children">
                {ACCESOS.map((acc) => (
                  <button
                    key={acc.ruta}
                    type="button"
                    className="landing-access-btn btn-interactive"
                    onClick={() => navigate(acc.ruta)}
                  >
                    <span className="landing-access-icon">
                      <i className={`bi ${acc.icono}`} aria-hidden="true" />
                    </span>
                    <span className="landing-access-label">{acc.titulo}</span>
                    <i className="bi bi-arrow-right landing-access-arrow" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* —— CTA final —— */}
      <section className="landing-cta">
        <Container>
          <div className="landing-cta-inner animate-scale-in">
            <h2 className="landing-cta-title">¿Listo para vender?</h2>
            <p className="landing-cta-desc">
              Registra tu próxima venta o explora el catálogo de productos disponibles.
            </p>
            <div className="landing-cta-actions">
              <Button
                size="lg"
                className="landing-btn-primary btn-interactive"
                onClick={() => navigate("/ventas")}
              >
                Registrar venta
              </Button>
              <Button
                size="lg"
                variant="outline-light"
                className="landing-btn-outline btn-interactive"
                onClick={() => navigate("/productos")}
              >
                Gestionar productos
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* —— Footer —— */}
      <footer className="landing-footer">
        <Container>
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <img src={logo} width="32" height="32" alt="" aria-hidden="true" />
              <span>Pulpería Chevez</span>
            </div>
            <p className="landing-footer-copy mb-0">
              Sistema de gestión · {new Date().getFullYear()}
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Inicio;
