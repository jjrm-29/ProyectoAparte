import React, { useState } from "react";
import { Card, Badge, Modal, Button } from "react-bootstrap";

const TarjetaCatalogo = ({
    producto,
    onEditar,
    onEliminar
}) => {

    const [mostrarModal, setMostrarModal] = useState(false);

    const descripcion = producto.descripcion || "";

    const previsualizacionTexto =
        descripcion.length > 50
            ? descripcion.substring(0, 50) + "..."
            : descripcion;

    const tieneMasTexto = descripcion.length > 50;

    return (
        <>
            <Card
                className="h-100 border-0 shadow-lg overflow-hidden"
                style={{
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer"
                }}
                onClick={() => setMostrarModal(true)}
            >

                {/* IMAGEN */}
                <div
                    className="ratio ratio-1x1 bg-light"
                    style={{ overflow: "hidden" }}
                >

                    {producto.imagen ? (

                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="card-img-top object-fit-cover"
                            loading="lazy"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />

                    ) : (

                        <div className="d-flex align-items-center justify-content-center h-100 bg-secondary-subtle">
                            <i className="bi bi-image text-muted fs-1"></i>
                        </div>

                    )}

                </div>

                {/* CONTENIDO */}
                <Card.Body className="d-flex flex-column p-3">

                    <Card.Title className="h6 fw-bold text-dark mb-2">
                        {producto.nombre}
                    </Card.Title>

                    <Card.Text className="text-muted small flex-grow-1">

                        {previsualizacionTexto}

                        {tieneMasTexto && (
                            <span className="text-primary ms-1">
                                Leer más
                            </span>
                        )}

                    </Card.Text>

                    <div className="mb-3">

                        <Badge bg="secondary" pill>
                            {producto.categoria || "Sin categoría"}
                        </Badge>

                    </div>

                    <hr />

                    <div className="mt-auto pt-2">

                        <h4 className="text-success fw-bold mb-1">
                            C${parseFloat(producto.precio || 0).toFixed(2)}
                        </h4>

                        <small className="text-muted">
                            Stock: {producto.stock}
                        </small>

                        {/* BOTONES */}
                        <div className="d-flex gap-2 mt-3">

                            <Button
                                variant="warning"
                                size="sm"
                                className="w-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditar(producto);
                                }}
                            >
                                Editar
                            </Button>

                            <Button
                                variant="danger"
                                size="sm"
                                className="w-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEliminar(producto);
                                }}
                            >
                                Eliminar
                            </Button>

                        </div>

                    </div>

                </Card.Body>

            </Card>

            {/* MODAL */}
            <Modal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                centered
                size="lg"
            >

                <Modal.Header closeButton>
                    <Modal.Title>
                        {producto.nombre}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="row g-4">

                        <div className="col-md-5">

                            {producto.imagen ? (

                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="img-fluid rounded"
                                    style={{
                                        width: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div className="bg-light rounded d-flex align-items-center justify-content-center p-5">
                                    <i className="bi bi-image fs-1 text-muted"></i>
                                </div>

                            )}

                        </div>

                        <div className="col-md-7">

                            <Badge bg="secondary" className="mb-3">
                                {producto.categoria}
                            </Badge>

                            <h3 className="text-success fw-bold">
                                C${parseFloat(producto.precio || 0).toFixed(2)}
                            </h3>

                            <p className="mt-3">
                                {producto.descripcion}
                            </p>

                            <p>
                                <strong>Stock:</strong> {producto.stock}
                            </p>

                        </div>

                    </div>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => setMostrarModal(false)}
                    >
                        Cerrar
                    </Button>

                </Modal.Footer>

            </Modal>
        </>
    );
};

export default TarjetaCatalogo;