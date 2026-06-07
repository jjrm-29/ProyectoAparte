import React, { useState } from "react";
import {
    Card,
    Badge,
    Modal,
    Button
} from "react-bootstrap";

const TarjetaCatalogo = ({ producto }) => {

    const [mostrarModal, setMostrarModal] = useState(false);

    const descripcion = producto.descripcion || "";

    const previsualizacionTexto =
        descripcion.length > 70
            ? descripcion.substring(0, 70) + "..."
            : descripcion;

    const tieneMasTexto = descripcion.length > 70;

    return (
        <>

            {/* TARJETA */}

            <Card
                className="h-100 overflow-hidden tarjeta-catalogo"
                style={{ cursor: "pointer" }}
                onClick={() => setMostrarModal(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setMostrarModal(true);
                    }
                }}
            >

                {/* IMAGEN */}

                <div
                    className="position-relative tarjeta-imagen-placeholder"
                    style={{
                        height: "260px",
                        overflow: "hidden"
                    }}
                >

                    {producto.imagen ? (

                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            loading="lazy"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.4s ease"
                            }}
                            className="imagen-producto"
                        />

                    ) : (

                        <div className="d-flex align-items-center justify-content-center h-100 tarjeta-imagen-placeholder">

                            <i className="bi bi-image text-secondary fs-1"></i>

                        </div>

                    )}

                    {/* BADGE */}

                    <div className="position-absolute top-0 start-0 p-3">

                        <Badge
                            bg="light"
                            text="dark"
                            className="rounded-pill px-3 py-2 shadow-sm fw-semibold"
                        >
                            {producto.categoria || "Sin categoría"}
                        </Badge>

                    </div>

                </div>

                {/* CONTENIDO */}

                <Card.Body className="d-flex flex-column p-4">

                    <Card.Title className="fw-bold mb-2">

                        {producto.nombre}

                    </Card.Title>

                    <Card.Text
                        className="text-muted small flex-grow-1"
                        style={{
                            minHeight: "55px",
                            lineHeight: "1.6"
                        }}
                    >

                        {previsualizacionTexto}

                        {tieneMasTexto && (

                            <span className="text-primary fw-semibold ms-1">
                                Ver más
                            </span>

                        )}

                    </Card.Text>

                    <div className="mt-3">

                        <h4 className="fw-bold mb-1" style={{ color: "var(--color-brand)" }}>

                            C$ {parseFloat(producto.precio || 0).toFixed(2)}

                        </h4>

                        <small className="text-muted">

                            Stock disponible: {producto.stock}

                        </small>

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

                <Modal.Header closeButton className="border-0 pb-0">

                    <Modal.Title className="fw-bold">
                        {producto.nombre}
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body className="p-4">

                    <div className="row g-4 align-items-center">

                        {/* IMAGEN */}

                        <div className="col-md-5">

                            {producto.imagen ? (

                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="img-fluid rounded-4 shadow-sm"
                                    style={{
                                        width: "100%",
                                        maxHeight: "350px",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div
                                    className="bg-light rounded-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        height: "300px"
                                    }}
                                >

                                    <i className="bi bi-image text-secondary fs-1"></i>

                                </div>

                            )}

                        </div>

                        {/* INFORMACIÓN */}

                        <div className="col-md-7">

                            <Badge
                                bg="primary"
                                className="mb-3 px-3 py-2 rounded-pill"
                            >
                                {producto.categoria}
                            </Badge>

                            <h2 className="fw-bold mb-3" style={{ color: "var(--color-brand)" }}>

                                C$ {parseFloat(producto.precio || 0).toFixed(2)}

                            </h2>

                            <p
                                className="text-muted"
                                style={{
                                    lineHeight: "1.8"
                                }}
                            >
                                {producto.descripcion}
                            </p>

                            <div
                                className="bg-light rounded-4 p-3 mt-4"
                            >

                                <div className="d-flex justify-content-between align-items-center">

                                    <span className="fw-semibold">
                                        Disponibilidad
                                    </span>

                                    <Badge
                                        bg={
                                            producto.stock > 0
                                                ? "success"
                                                : "danger"
                                        }
                                        className="px-3 py-2 rounded-pill"
                                    >
                                        {producto.stock > 0
                                            ? `${producto.stock} en stock`
                                            : "Agotado"}
                                    </Badge>

                                </div>

                            </div>

                        </div>

                    </div>

                </Modal.Body>

                <Modal.Footer className="border-0 pt-0">

                    <Button
                        variant="dark"
                        className="rounded-4 px-4"
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