import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    InputGroup,
    Button
} from "react-bootstrap";

const CuadroBusquedas = ({
    onBuscar,
    categorias = []
}) => {

    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

    const handleSubmit = (e) => {

        e.preventDefault();

        if (onBuscar) {
            onBuscar(
                busqueda.trim(),
                categoriaFiltro
            );
        }
    };

    const handleLimpiar = () => {

        setBusqueda("");
        setCategoriaFiltro("Todas");

        if (onBuscar) {
            onBuscar("", "Todas");
        }
    };

    return (

        <Container className="my-4">

            <div className="bg-white rounded-4 shadow p-4 border border-light">

                <Form onSubmit={handleSubmit}>

                    <Row className="g-3 align-items-end">

                        {/* BUSQUEDA */}
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
                                    placeholder="Buscar categoría..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                    className="border-0 shadow-sm"
                                />

                            </InputGroup>

                        </Col>

                        {/* FILTRO */}
                        <Col md={3}>

                            <Form.Label className="fw-semibold text-muted small mb-1">
                                Categoría
                            </Form.Label>

                            <Form.Select
                                size="lg"
                                value={categoriaFiltro}
                                onChange={(e) =>
                                    setCategoriaFiltro(e.target.value)
                                }
                                className="shadow-sm"
                            >

                                <option value="Todas">
                                    Todas las categorías
                                </option>

                                {categorias.map((categoria) => (

                                    <option
                                        key={categoria.id}
                                        value={categoria.nombre}
                                    >
                                        {categoria.nombre}
                                    </option>

                                ))}

                            </Form.Select>

                        </Col>

                        {/* BOTONES */}
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