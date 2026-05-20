import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

const TarjetaCategoria = ({
    categorias,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    return (

        <Row className="g-4">

            {categorias.map((categoria) => (

                <Col
                    xs={12}
                    sm={6}
                    key={categoria.id_categoria}
                >

                    <Card className="border-0 shadow-sm rounded-4 h-100">

                        <Card.Body className="p-4">

                            <div className="d-flex justify-content-between align-items-start mb-3">

                                <div>

                                    <h5 className="fw-bold text-dark mb-1">
                                        {categoria.nombre_categoria}
                                    </h5>

                                    <small className="text-muted">
                                        ID: {categoria.id_categoria}
                                    </small>

                                </div>

                                <div
                                    className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >

                                    <i className="bi bi-tags-fill text-primary"></i>

                                </div>

                            </div>

                            <p
                                className="text-muted mb-4"
                                style={{
                                    minHeight: "60px"
                                }}
                            >
                                {categoria.descripcion_categoria}
                            </p>

                            <div className="d-flex gap-2">

                                <Button
                                    variant="outline-warning"
                                    className="w-100 rounded-3"
                                    onClick={() =>
                                        abrirModalEdicion(categoria)
                                    }
                                >

                                    <i className="bi bi-pencil-square me-2"></i>
                                    Editar

                                </Button>

                                <Button
                                    variant="outline-danger"
                                    className="w-100 rounded-3"
                                    onClick={() =>
                                        abrirModalEliminacion(categoria)
                                    }
                                >

                                    <i className="bi bi-trash3-fill me-2"></i>
                                    Eliminar

                                </Button>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            ))}

        </Row>

    );
};

export default TarjetaCategoria;