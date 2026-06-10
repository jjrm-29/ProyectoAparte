import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseconfig";
import PageHero from "../components/navegacion/PageHero";

const ProductoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from("productos")
                    .select("*")
                    .eq("id_producto", id)
                    .single();

                if (error) throw error;
                setProducto(data);
            } catch (err) {
                console.error("Error al cargar producto:", err);
                setProducto(null);
            } finally {
                setLoading(false);
            }
        };

        cargarProducto();
    }, [id]);

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/600x600?text=Sin+Imagen";
    };

    if (loading) {
        return (
            <Container fluid="lg" className="view-page">
                <div className="text-center py-5 fade-in">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted loading-pulse">Cargando producto…</p>
                </div>
            </Container>
        );
    }

    if (!producto) {
        return (
            <Container fluid="lg" className="view-page">
                <Card className="view-empty-card text-center animate-scale-in">
                    <Card.Body className="py-5">
                        <i className="bi bi-box-seam view-empty-icon" aria-hidden="true" />
                        <h3 className="fw-bold mt-3">Producto no encontrado</h3>
                        <p className="text-muted mb-4">El artículo que buscas no existe o fue eliminado.</p>
                        <Button
                            variant="primary"
                            className="rounded-pill px-4 btn-interactive"
                            onClick={() => navigate("/catalogo")}
                        >
                            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                            Volver al catálogo
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container fluid="lg" className="px-0 view-page">
            <PageHero
                kicker={producto.categoria || "Producto"}
                title={producto.nombre}
                subtitle={producto.descripcion || "Detalle del producto en catálogo."}
                action={
                    <Button
                        variant="light"
                        className="btn-hero-cta rounded-pill px-4 btn-interactive"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                        Volver
                    </Button>
                }
            />

            <Card className="view-detail-card animate-fade-right overflow-hidden">
                <Card.Body className="p-4 p-md-5">
                    <Row className="g-4 align-items-center">
                        <Col md={5} className="text-center">
                            <div className="view-detail-image-wrap">
                                <img
                                    src={producto.imagen || "https://via.placeholder.com/600x600?text=Sin+Imagen"}
                                    alt={producto.nombre}
                                    className="view-detail-image"
                                    onError={handleImageError}
                                />
                            </div>
                        </Col>

                        <Col md={7}>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <Badge bg="primary" pill className="px-3 py-2">
                                    {producto.categoria || "Sin categoría"}
                                </Badge>
                                <Badge
                                    bg={parseInt(producto.stock, 10) > 0 ? "success" : "danger"}
                                    pill
                                    className="px-3 py-2"
                                >
                                    Stock: {producto.stock ?? 0}
                                </Badge>
                            </div>

                            <h2 className="view-detail-price mb-3">
                                C$ {Number(producto.precio).toFixed(2)}
                            </h2>

                            {producto.descripcion && (
                                <p className="text-muted fs-5 mb-4">{producto.descripcion}</p>
                            )}

                            <Button
                                variant="primary"
                                size="lg"
                                className="rounded-pill px-4 btn-interactive"
                                onClick={() => navigate("/catalogo")}
                            >
                                <i className="bi bi-grid me-2" aria-hidden="true" />
                                Ver más productos
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProductoDetalle;
