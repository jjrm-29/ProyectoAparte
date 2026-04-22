import React from "react";
import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";



const TarjetaCategoria = ({
    categoria,
    onVerProductos,
    onEditar,
    onEliminar
}) => {
    const { id, nombre, descripcion, imagen, color, count } = categoria;

    return (
        <Card
            className="h-100 shadow-sm border-0 categoria-card overflow-hidden"
            onClick={() => onVerProductos(nombre)}
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
        >
            {/* Imagen con overlay sutil */}
            <div className="position-relative">
                <Card.Img
                    variant="top"
                    src={imagen}
                    style={{
                        height: "235px",
                        objectFit: "cover"
                    }}
                    alt={nombre}
                />

                {/* Overlay con número de productos */}
                <div
                    className="position-absolute top-0 end-0 m-3"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                    }}
                >
                    {count}
                </div>
            </div>

            <Card.Body className="d-flex flex-column p-4">
                {/* Icono circular */}
                <div
                    className="rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                        width: "78px",
                        height: "78px",
                        backgroundColor: `${color}15`,
                        color: color,
                        fontSize: "2.8rem",
                        border: `3px solid ${color}30`,
                        boxShadow: `0 0 15px ${color}40`
                    }}
                >
                    🛒
                </div>

                {/* Nombre de la categoría */}
                <Card.Title className="text-center fw-bold fs-4 mb-3 text-dark">
                    {nombre}
                </Card.Title>

                {/* Descripción */}
                <Card.Text className="text-center text-muted flex-grow-1 mb-4" style={{ fontSize: "0.97rem" }}>
                    {descripcion}
                </Card.Text>

                {/* Botones de acción */}
                <div className="d-flex gap-2 mt-auto">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Editar categoría</Tooltip>}
                    >
                        <Button
                            variant="outline-primary"
                            className="flex-fill"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditar(categoria);
                            }}
                        >
                            <PencilSquare className="me-1" /> Editar
                        </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Eliminar categoría</Tooltip>}
                    >
                        <Button
                            variant="outline-danger"
                            className="flex-fill"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEliminar(categoria);
                            }}
                        >
                            <Trash3 className="me-1" /> Eliminar
                        </Button>
                    </OverlayTrigger>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TarjetaCategoria;