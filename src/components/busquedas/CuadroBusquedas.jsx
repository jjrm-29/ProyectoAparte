import React, { useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";

const CuadroBusquedas = ({ onBuscar }) => {
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onBuscar) {
            onBuscar(busqueda.trim(), categoriaFiltro);
        }
    };

    const handleLimpiar = () => {
        setBusqueda("");
        setCategoriaFiltro("Todas");
        if (onBuscar) onBuscar("", "Todas");
    };

    return (
        <Container className="my-4">
            <div className="bg-white rounded-4 shadow p-4 border border-light">
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3 align-items-end">
                        {/* Campo de búsqueda */}
                        <Col md={7}>
                            <Form.Label className="fw-semibold text-muted small mb-1">
                                ¿Qué estás buscando?
                            </Form.Label>
                            <InputGroup size="lg">
                                <InputGroup.Text>
                                    🔍
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Café, arroz, detergente..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="border-0 shadow-sm"
                                />
                            </InputGroup>
                        </Col>

                        {/* Filtro de categoría */}
                        <Col md={3}>
                            <Form.Label className="fw-semibold text-muted small mb-1">
                                Categoría
                            </Form.Label>
                            <Form.Select
                                size="lg"
                                value={categoriaFiltro}
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                                className="shadow-sm"
                            >
                                <option value="Todas">Todas las categorías</option>
                                <option value="Alimentos">Alimentos</option>
                                <option value="Bebidas">Bebidas</option>
                                <option value="Despensa">Despensa</option>
                                <option value="Lácteos">Lácteos</option>
                                <option value="Limpieza">Limpieza</option>
                                <option value="Snacks">Snacks</option>
                            </Form.Select>
                        </Col>

                        {/* Botones */}
                        <Col md={2}>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    size="lg"
                                    className="fw-semibold"
                                >
                                    Buscar
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={handleLimpiar}
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>

                {/* Texto decorativo abajo */}
                <div className="text-center mt-3">
                    <small className="text-muted">
                        Encuentra rápidamente lo que necesitas en nuestra pulpería ❤️
                    </small>
                </div>
            </div>
        </Container>
    );
};

export default CuadroBusquedas;