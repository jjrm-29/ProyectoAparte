import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Table,
    Badge,
    Button,
    ProgressBar
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const DashboardVentas = () => {

    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarVentas();
    }, []);

    // =========================================
    // CARGAR VENTAS
    // =========================================

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

    // =========================================
    // KPIs
    // =========================================

    const totalIngresos = ventas.reduce(
        (acc, venta) => acc + Number(venta.subtotal || 0),
        0
    );

    const totalVentas = ventas.length;

    const totalProductos = ventas.reduce(
        (acc, venta) => acc + Number(venta.cantidad || 0),
        0
    );

    return (

        <div className="dashboard-bg">

            <Container fluid="xl" className="py-5">

                {/* HERO */}

                <div className="hero-section mb-5">

                    <div className="hero-overlay"></div>

                    <Row className="align-items-center position-relative">

                        <Col lg={8}>

                            <Badge
                                bg="light"
                                text="dark"
                                className="rounded-pill px-4 py-2 fw-semibold mb-4"
                            >
                                PANEL ADMINISTRATIVO
                            </Badge>

                            <h1 className="hero-title">
                                Dashboard de Ventas
                            </h1>

                            <p className="hero-text">
                                Visualiza estadísticas, ingresos y productos vendidos
                                en tiempo real desde un panel moderno y elegante.
                            </p>

                            <div className="d-flex gap-3 flex-wrap mt-4">

                                <Button
                                    variant="light"
                                    size="lg"
                                    className="rounded-4 fw-bold px-4 shadow-sm"
                                >
                                    📊 Ver Reportes
                                </Button>

                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    className="rounded-4 fw-semibold px-4"
                                >
                                    📈 Estadísticas
                                </Button>

                            </div>

                        </Col>

                        <Col lg={4} className="mt-5 mt-lg-0">

                            <Card className="hero-mini-card border-0">

                                <Card.Body>

                                    <div className="d-flex justify-content-between align-items-center mb-3">

                                        <div>

                                            <small className="mini-text">
                                                Rendimiento General
                                            </small>

                                            <h3 className="fw-bold mb-0 text-dark">
                                                Excelente
                                            </h3>

                                        </div>

                                        <div className="hero-icon">
                                            🚀
                                        </div>

                                    </div>

                                    <ProgressBar
                                        now={85}
                                        className="rounded-pill"
                                        style={{ height: "10px" }}
                                    />

                                    <p className="mini-text mt-3 mb-0">
                                        Tu sistema mantiene un crecimiento constante.
                                    </p>

                                </Card.Body>

                            </Card>

                        </Col>

                    </Row>

                </div>

                {/* KPIs */}

                <Row className="g-4 mb-5">

                    <Col lg={4} md={6}>

                        <Card className="kpi-card ingresos-card border-0">

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                        <p className="kpi-label">
                                            INGRESOS TOTALES
                                        </p>

                                        <h2 className="fw-bold text-white">
                                            C$ {totalIngresos.toFixed(2)}
                                        </h2>

                                        <small className="text-light opacity-75">
                                            Ventas acumuladas
                                        </small>

                                    </div>

                                    <div className="kpi-icon">
                                        💰
                                    </div>

                                </div>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col lg={4} md={6}>

                        <Card className="kpi-card ventas-card border-0">

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                        <p className="kpi-label">
                                            TOTAL VENTAS
                                        </p>

                                        <h2 className="fw-bold text-white">
                                            {totalVentas}
                                        </h2>

                                        <small className="text-light opacity-75">
                                            Ventas registradas
                                        </small>

                                    </div>

                                    <div className="kpi-icon">
                                        🧾
                                    </div>

                                </div>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col lg={4} md={12}>

                        <Card className="kpi-card productos-card border-0">

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                        <p className="kpi-label">
                                            PRODUCTOS VENDIDOS
                                        </p>

                                        <h2 className="fw-bold text-white">
                                            {totalProductos}
                                        </h2>

                                        <small className="text-light opacity-75">
                                            Productos comercializados
                                        </small>

                                    </div>

                                    <div className="kpi-icon">
                                        📦
                                    </div>

                                </div>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

                {/* TABLA */}

                <Card className="table-card border-0 overflow-hidden">

                    <div className="table-header">

                        <div>

                            <h3 className="fw-bold mb-1 text-dark">
                                Historial de Ventas
                            </h3>

                            <p className="table-subtitle mb-0">
                                Últimos movimientos registrados en el sistema
                            </p>

                        </div>

                    </div>

                    {loading ? (

                        <div className="text-center py-5">

                            <Spinner
                                animation="border"
                                variant="primary"
                            />

                            <p className="mt-3 table-subtitle">
                                Cargando información...
                            </p>

                        </div>

                    ) : (

                        <Table responsive hover className="align-middle mb-0 custom-table">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Estado</th>

                                </tr>

                            </thead>

                            <tbody>

                                {ventas.length > 0 ? (

                                    ventas.map((venta) => (

                                        <tr key={venta.id_detalle}>

                                            <td className="fw-bold text-primary">
                                                #{venta.id_detalle}
                                            </td>

                                            <td>

                                                <div className="d-flex align-items-center gap-3">

                                                    {venta.productos?.imagen ? (

                                                        <img
                                                            src={venta.productos.imagen}
                                                            alt={venta.productos.nombre}
                                                            className="producto-img"
                                                        />

                                                    ) : (

                                                        <div className="producto-placeholder">
                                                            📦
                                                        </div>

                                                    )}

                                                    <div>

                                                        <h6 className="fw-bold mb-1 text-dark">
                                                            {venta.productos?.nombre || "Sin producto"}
                                                        </h6>

                                                        <small className="table-subtitle">
                                                            Venta registrada
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <Badge
                                                    bg="light"
                                                    text="dark"
                                                    className="border px-3 py-2 rounded-pill"
                                                >
                                                    {venta.productos?.categoria || "Sin categoría"}
                                                </Badge>

                                            </td>

                                            <td className="fw-semibold text-dark">
                                                {venta.cantidad}
                                            </td>

                                            <td className="fw-bold text-success">
                                                C$ {Number(venta.subtotal).toFixed(2)}
                                            </td>

                                            <td>

                                                <Badge
                                                    bg="success"
                                                    className="px-3 py-2 rounded-pill"
                                                >
                                                    Completada
                                                </Badge>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center py-5"
                                        >

                                            <div className="empty-state">

                                                <div className="empty-icon">
                                                    📊
                                                </div>

                                                <h3 className="fw-bold mt-4 text-dark">
                                                    No hay ventas registradas
                                                </h3>

                                                <p className="table-subtitle">
                                                    Aún no existen movimientos en el sistema
                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </Table>

                    )}

                </Card>

            </Container>

            <style>{`

                .dashboard-bg{
                    min-height:100vh;
                    background:
                    radial-gradient(circle at top left,#1e3a8a 0%,#0f172a 45%,#020617 100%);
                }

                .hero-section{
                    position:relative;
                    overflow:hidden;
                    border-radius:35px;
                    padding:60px;
                    background:
                    linear-gradient(135deg,
                    rgba(37,99,235,.95),
                    rgba(15,23,42,.95));
                    box-shadow:
                    0 20px 60px rgba(0,0,0,.35);
                }

                .hero-overlay{
                    position:absolute;
                    top:-100px;
                    right:-100px;
                    width:300px;
                    height:300px;
                    background:rgba(255,255,255,.08);
                    border-radius:50%;
                }

                .hero-title{
                    color:white;
                    font-size:3.5rem;
                    font-weight:800;
                    margin-bottom:20px;
                    line-height:1.1;
                }

                .hero-text{
                    color:rgba(255,255,255,.85);
                    font-size:1.1rem;
                    max-width:650px;
                    line-height:1.8;
                }

                .hero-mini-card{
                    border-radius:28px;
                    background:white;
                    box-shadow:0 15px 40px rgba(0,0,0,.25);
                }

                .mini-text{
                    color:#64748b;
                }

                .hero-icon{
                    width:70px;
                    height:70px;
                    border-radius:22px;
                    background:#eff6ff;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:2rem;
                }

                .kpi-card{
                    border-radius:28px;
                    overflow:hidden;
                    transition:.35s ease;
                    box-shadow:0 15px 40px rgba(0,0,0,.25);
                }

                .kpi-card:hover{
                    transform:translateY(-8px);
                }

                .ingresos-card{
                    background:linear-gradient(135deg,#059669,#10b981);
                }

                .ventas-card{
                    background:linear-gradient(135deg,#2563eb,#3b82f6);
                }

                .productos-card{
                    background:linear-gradient(135deg,#7c3aed,#8b5cf6);
                }

                .kpi-label{
                    color:rgba(255,255,255,.75);
                    font-size:.85rem;
                    font-weight:700;
                    letter-spacing:1px;
                    margin-bottom:12px;
                }

                .kpi-icon{
                    width:75px;
                    height:75px;
                    border-radius:24px;
                    background:rgba(255,255,255,.15);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:2rem;
                }

                .table-card{
                    border-radius:30px;
                    box-shadow:0 15px 50px rgba(0,0,0,.25);
                    background:white;
                }

                .table-header{
                    padding:30px;
                    border-bottom:1px solid #e5e7eb;
                    background:white;
                }

                .table-subtitle{
                    color:#64748b;
                }

                .custom-table thead{
                    background:#f8fafc;
                }

                .custom-table thead th{
                    padding:20px;
                    border:none;
                    color:#0f172a;
                    font-size:.95rem;
                    font-weight:700;
                }

                .custom-table tbody td{
                    padding:20px;
                    vertical-align:middle;
                    border-color:#f1f5f9;
                }

                .custom-table tbody tr{
                    transition:.25s ease;
                }

                .custom-table tbody tr:hover{
                    background:#f8fafc;
                }

                .producto-img{
                    width:65px;
                    height:65px;
                    object-fit:cover;
                    border-radius:18px;
                    border:3px solid #f1f5f9;
                }

                .producto-placeholder{
                    width:65px;
                    height:65px;
                    border-radius:18px;
                    background:#f1f5f9;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:1.7rem;
                }

                .empty-state{
                    padding:40px;
                }

                .empty-icon{
                    font-size:5rem;
                }

                @media(max-width:768px){

                    .hero-section{
                        padding:35px 25px;
                    }

                    .hero-title{
                        font-size:2.3rem;
                    }

                }

            `}</style>

        </div>
    );
};

export default DashboardVentas;