import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const ProductoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productosEjemplo = [
            { id: 1, nombre: "Café Molido Premium", precio: 150, categoria: "Bebidas", imagen: "https://http2.mlstatic.com/D_NQ_NP_706638-MCO82270894377_022025-O.webp", descripcion: "Café 100% arábica tostado nicaragüense" },
            { id: 2, nombre: "Arroz Integral 1LB", precio: 35, categoria: "Alimentos", imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop", descripcion: "Arroz integral de larga duración" },
            { id: 3, nombre: "Aceite de Oliva Extra Virgen", precio: 120, categoria: "Despensa", imagen: "https://tse1.mm.bing.net/th/id/OIP.t4wQKuIzZDUUTERtSad8CAHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3", descripcion: "Aceite de oliva importado 500ml" }
        ];

        const productoEncontrado = productosEjemplo.find(p => p.id === parseInt(id));

        setTimeout(() => {
            setProducto(productoEncontrado);
            setLoading(false);
        }, 400);
    }, [id]);

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/600x600?text=Sin+Imagen";
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando producto...</p>
            </Container>
        );
    }

    if (!producto) {
        return (
            <Container className="py-5 text-center">
                <h3>Producto no encontrado</h3>
                <Button onClick={() => navigate("/catalogo")}>
                    Volver
                </Button>
            </Container>
        );
    }

    return (
        <Container className="margen-superior-main py-5">
            <Button 
                variant="light" 
                className="mb-4 shadow-sm"
                onClick={() => navigate(-1)}
            >
                ← Volver
            </Button>

            <Row className="justify-content-center">
                <Col lg={10}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <Row className="g-0">

                            {/* Imagen */}
                            <Col md={6}>
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    onError={handleImageError}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover", minHeight: "400px" }}
                                />
                            </Col>

                            {/* Info */}
                            <Col md={6}>
                                <Card.Body className="p-5 d-flex flex-column h-100">

                                    <Badge bg="secondary" className="mb-3 w-fit">
                                        {producto.categoria}
                                    </Badge>

                                    <h2 className="fw-bold mb-3">
                                        {producto.nombre}
                                    </h2>

                                    <h3 className="text-success fw-bold mb-4">
                                        C$ {producto.precio.toLocaleString()}
                                    </h3>

                                    <p className="text-muted flex-grow-1">
                                        {producto.descripcion}
                                    </p>

                                    <div className="d-grid gap-3 mt-4">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={() => alert(`✅ ${producto.nombre} agregado`)}
                                        >
                                            🛒 Agregar al carrito
                                        </Button>

                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => navigate("/catalogo")}
                                        >
                                            Seguir comprando
                                        </Button>
                                    </div>

                                </Card.Body>
                            </Col>

                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductoDetalle;