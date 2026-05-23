import React from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";

const TarjetaCategoria = ({
    categorias,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    return (

        <Row className="g-4">

            {categorias.map((categoria) => (

                <Col
                    key={categoria.id}
                    xs={12}
                    md={6}
                    lg={4}
                >

                    <Card className="border-0 shadow-lg rounded-4 h-100 categoria-card overflow-hidden">

                        {/* IMAGEN */}
                        <div
                            className="position-relative"
                            style={{
                                height: "220px",
                                overflow: "hidden"
                            }}
                        >

                            {categoria.imagen ? (

                                <Card.Img
                                    variant="top"
                                    src={categoria.imagen}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div
                                    className="d-flex justify-content-center align-items-center h-100"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #1e293b, #334155)"
                                    }}
                                >

                                    <span
                                        style={{
                                            fontSize: "5rem"
                                        }}
                                    >
                                        📂
                                    </span>

                                </div>

                            )}

                            {/* BADGE */}
                            <Badge
                                bg="primary"
                                className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow"
                            >
                                ID #{categoria.id}
                            </Badge>

                        </div>

                        {/* CONTENIDO */}
                        <Card.Body className="p-4 d-flex flex-column">

                            <div className="mb-3">

                                <h4 className="fw-bold text-dark mb-2">
                                    {categoria.nombre}
                                </h4>

                                <p
                                    className="text-muted mb-0"
                                    style={{
                                        minHeight: "70px",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {categoria.descripcion ||
                                        "Sin descripción disponible"}
                                </p>

                            </div>

                            {/* ESTADO */}
                            <div className="mb-4">

                                <Badge
                                    bg="success"
                                    className="px-3 py-2 rounded-pill"
                                >
                                    Activa
                                </Badge>

                            </div>

                            {/* BOTONES */}
                            <div className="d-flex gap-2 mt-auto">

                                <Button
                                    variant="warning"
                                    className="w-100 rounded-3 fw-semibold shadow-sm"
                                    onClick={() =>
                                        abrirModalEdicion(categoria)
                                    }
                                >

                                    <i className="bi bi-pencil-square me-2"></i>
                                    Editar

                                </Button>

                                <Button
                                    variant="danger"
                                    className="w-100 rounded-3 fw-semibold shadow-sm"
                                    onClick={() =>
                                        abrirModalEliminacion(categoria)
                                    }
                                >

                                    <i className="bi bi-trash-fill me-2"></i>
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