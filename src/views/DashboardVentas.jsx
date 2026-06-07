import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Table,
    Badge,
    ProgressBar
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
                .from("detalle_venta")
                .select(`
                    *,
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

    const totalIngresos = ventas.reduce(
        (acc, venta) => acc + Number(venta.subtotal || 0),
        0
    );

    const totalVentas = ventas.length;

    const totalProductos = ventas.reduce(
        (acc, venta) => acc + Number(venta.cantidad || 0),
        0
    );

    const ticketPromedio = totalVentas > 0 ? totalIngresos / totalVentas : 0;

    const rendimiento = Math.min(100, Math.round((totalVentas / Math.max(totalVentas, 10)) * 85 + 15));

    const kpis = [
        {
            label: "Ingresos totales",
            valor: `C$ ${totalIngresos.toFixed(2)}`,
            sub: "Ventas acumuladas",
            icono: "bi-cash-stack",
            clase: "dashboard-kpi--green",
        },
        {
            label: "Operaciones",
            valor: totalVentas,
            sub: "Líneas de venta",
            icono: "bi-receipt",
            clase: "dashboard-kpi--blue",
        },
        {
            label: "Unidades vendidas",
            valor: totalProductos,
            sub: "Productos comercializados",
            icono: "bi-box-seam",
            clase: "dashboard-kpi--purple",
        },
        {
            label: "Ticket promedio",
            valor: `C$ ${ticketPromedio.toFixed(2)}`,
            sub: "Por operación",
            icono: "bi-graph-up",
            clase: "dashboard-kpi--pink",
        },
    ];

    return (
        <Container fluid="lg" className="px-0">
            <div className="page-hero dashboard-hero animate-fade-left mb-4">
                <Row className="align-items-center g-4">
                    <Col lg={8}>
                        <span className="home-kicker">Resumen</span>
                        <h1 className="display-5 fw-bold mb-2">Dashboard de ventas</h1>
                        <p className="lead mb-0">
                            Estadísticas, ingresos y productos vendidos en tiempo real.
                        </p>
                    </Col>
                    <Col lg={4}>
                        <Card className="dashboard-mini-card border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <small className="dashboard-mini-label">Actividad</small>
                                        <h5 className="fw-bold mb-0">En línea</h5>
                                    </div>
                                    <span className="dashboard-mini-icon">
                                        <i className="bi bi-activity" aria-hidden="true" />
                                    </span>
                                </div>
                                <ProgressBar now={rendimiento} className="dashboard-progress rounded-pill" />
                                <small className="dashboard-mini-label mt-2 d-block">
                                    {totalVentas} movimientos registrados
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Row className="g-3 g-md-4 stagger-children mb-4">
                {kpis.map((kpi) => (
                    <Col sm={6} lg={3} key={kpi.label}>
                        <Card className={`dashboard-kpi ${kpi.clase} h-100`}>
                            <Card.Body className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="dashboard-kpi-label">{kpi.label}</p>
                                    <h2 className="dashboard-kpi-value">{kpi.valor}</h2>
                                    <small className="dashboard-kpi-sub">{kpi.sub}</small>
                                </div>
                                <span className="dashboard-kpi-icon">
                                    <i className={`bi ${kpi.icono}`} aria-hidden="true" />
                                </span>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="data-table-card border-0 overflow-hidden animate-fade-right">
                <div className="table-hero-bar d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h4 className="fw-bold mb-0">
                            <i className="bi bi-clock-history me-2" aria-hidden="true" />
                            Historial de ventas
                        </h4>
                        <small className="table-hero-sub">Últimos movimientos del sistema</small>
                    </div>
                    <span className="table-hero-count">{ventas.length} registros</span>
                </div>

                {loading ? (
                    <div className="text-center py-5 fade-in">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted loading-pulse">Cargando información…</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 data-table">
                            <thead>
                                <tr>
                                    <th className="col-id">ID</th>
                                    <th className="col-producto">Producto</th>
                                    <th className="d-none d-md-table-cell">Categoría</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th className="d-none d-sm-table-cell">Estado</th>
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
                                                #{venta.id_detalle}
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
                                                    <span
                                                        className="table-product-name"
                                                        title={venta.productos?.nombre}
                                                    >
                                                        {venta.productos?.nombre || "Sin producto"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="d-none d-md-table-cell">
                                                <Badge bg="primary" pill className="table-badge">
                                                    {venta.productos?.categoria || "—"}
                                                </Badge>
                                            </td>
                                            <td className="fw-semibold">{venta.cantidad}</td>
                                            <td>
                                                <span className="table-price">
                                                    C$ {Number(venta.subtotal).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="d-none d-sm-table-cell">
                                                <Badge bg="success" pill className="table-badge">
                                                    Completada
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="table-empty-state py-4">
                                                <i className="bi bi-bar-chart table-empty-icon" aria-hidden="true" />
                                                <h5 className="fw-bold mt-3">No hay ventas registradas</h5>
                                                <p className="text-muted mb-0">
                                                    Aún no existen movimientos en el sistema
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default DashboardVentas;
