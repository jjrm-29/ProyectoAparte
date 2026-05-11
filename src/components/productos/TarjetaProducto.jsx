import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetasProductos = ({
    productos,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {

    const [cargando, setCargando] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargando(!(productos && productos.length > 0));
    }, [productos]);

    const manejarTeclaEscape = useCallback((evento) => {

        if (evento.key === "Escape") {
            setIdTarjetaActiva(null);
        }

    }, []);

    useEffect(() => {

        window.addEventListener("keydown", manejarTeclaEscape);

        return () =>
            window.removeEventListener("keydown", manejarTeclaEscape);

    }, [manejarTeclaEscape]);

    const alternarTarjetaActiva = (id) => {

        setIdTarjetaActiva((anterior) =>
            anterior === id ? null : id
        );

    };

    return (
        <>
            {cargando ? (

                <div className="text-center my-5">

                    <h5>Cargando productos...</h5>

                    <Spinner
                        animation="border"
                        variant="primary"
                        role="status"
                    />

                </div>

            ) : (

                <div>

                    {productos.map((prod) => {

                        const tarjetaActiva =
                            idTarjetaActiva === prod.id_producto;

                        return (

                            <Card
                                key={prod.id_producto}
                                className="mb-3 border-0 rounded-3 shadow-sm w-100"
                                onClick={() =>
                                    alternarTarjetaActiva(prod.id_producto)
                                }
                                tabIndex={0}
                            >

                                <Card.Body className="p-3">

                                    <Row className="align-items-center">

                                        {/* IMAGEN */}

                                        <Col xs={3} md={2}>

                                            <div
                                                className="bg-light rounded d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    overflow: "hidden"
                                                }}
                                            >

                                                {prod.imagen ? (

                                                    <img
                                                        src={prod.imagen}
                                                        alt={prod.nombre}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover"
                                                        }}
                                                    />

                                                ) : (

                                                    <i className="bi bi-box-seam text-muted fs-3"></i>

                                                )}

                                            </div>

                                        </Col>

                                        {/* INFORMACION */}

                                        <Col xs={6} md={7}>

                                            <h6 className="fw-bold mb-1">
                                                {prod.nombre}
                                            </h6>

                                            <p className="text-muted small mb-1">
                                                {prod.categoria}
                                            </p>

                                            <p className="small text-truncate mb-0">
                                                {prod.descripcion}
                                            </p>

                                        </Col>

                                        {/* PRECIO Y STOCK */}

                                        <Col
                                            xs={3}
                                            md={3}
                                            className="text-end"
                                        >

                                            <h6 className="text-success fw-bold">
                                                C$
                                                {parseFloat(
                                                    prod.precio || 0
                                                ).toFixed(2)}
                                            </h6>

                                            <small className="text-muted">
                                                Stock: {prod.stock}
                                            </small>

                                        </Col>

                                    </Row>

                                </Card.Body>

                                {/* BOTONES */}

                                {tarjetaActiva && (

                                    <div className="p-3 border-top d-flex gap-2 justify-content-end">

                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                abrirModalEdicion(prod);
                                            }}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Button>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                abrirModalEliminacion(prod);
                                            }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>

                                    </div>

                                )}

                            </Card>

                        );

                    })}

                </div>

            )}
        </>
    );
};

export default TarjetasProductos;