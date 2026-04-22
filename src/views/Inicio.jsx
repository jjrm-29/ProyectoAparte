import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
    const navigate = useNavigate();

    return (
        <Container className="margen-superior-main py-5">
            {/* Encabezado principal */}
            <Row className="justify-content-center text-center mb-5">
                <Col lg={8}>
                    <h1 className="display-4 fw-bold text-dark mb-3">
                        Bienvenido a la Pulpería
                    </h1>
                    <p className="lead text-muted mb-4">
                        Tu tienda de confianza con los mejores productos 
                        al mejor precio.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button 
                            variant="primary" 
                            size="lg"
                            onClick={() => navigate("/catalogo")}
                        >
                            Ver Catálogo
                        </Button>
                        <Button 
                            variant="outline-primary" 
                            size="lg"
                            onClick={() => navigate("/categorias")}
                        >
                            Explorar Categorías
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Tarjetas de acceso rápido */}
            <Row className="g-4 mt-4">
                <Col md={4}>
                    <Card className="h-100 shadow-sm border-0 text-center categoria-card">
                        <Card.Body className="py-5">
                            <div className="display-1 mb-3">🛒</div>
                            <Card.Title className="fw-bold fs-4">Catálogo</Card.Title>
                            <Card.Text className="text-muted">
                                Explora todos nuestros productos
                            </Card.Text>
                            <Button 
                                variant="primary" 
                                className="mt-3"
                                onClick={() => navigate("/catalogo")}
                            >
                                Ir al Catálogo
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm border-0 text-center categoria-card">
                        <Card.Body className="py-5">
                            <div className="display-1 mb-3">📂</div>
                            <Card.Title className="fw-bold fs-4">Categorías</Card.Title>
                            <Card.Text className="text-muted">
                                Encuentra productos por categoría
                            </Card.Text>
                            <Button 
                                variant="primary" 
                                className="mt-3"
                                onClick={() => navigate("/categorias")}
                            >
                                Ver Categorías
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm border-0 text-center categoria-card">
                        <Card.Body className="py-5">
                            <div className="display-1 mb-3">📦</div>
                            <Card.Title className="fw-bold fs-4">Productos</Card.Title>
                            <Card.Text className="text-muted">
                                Lista completa de todos los productos
                            </Card.Text>
                            <Button 
                                variant="primary" 
                                className="mt-3"
                                onClick={() => navigate("/productos")}
                            >
                                Ver Productos
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Sección de información */}
            <Row className="mt-5 pt-5 border-top">
                <Col md={6}>
                    <h4 className="fw-bold mb-3">¿Por qué elegirnos?</h4>
                    <ul className="list-unstyled">
                        <li className="mb-2">✅ Productos de calidad</li>
                        <li className="mb-2">✅ Precios competitivos</li>
                        <li className="mb-2">✅ Entrega rápida</li>
                        <li className="mb-2">✅ Atención personalizada</li>
                    </ul>
                </Col>
                <Col md={6}>
                    <h4 className="fw-bold mb-3">Horario de atención</h4>
                    <p className="text-muted">
                        Lunes a Sábado: 7:00 AM - 8:00 PM<br />
                        Domingo: 8:00 AM - 2:00 PM
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Inicio;