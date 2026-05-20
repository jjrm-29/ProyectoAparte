import React, { useEffect, useState } from "react";
import {
    Table,
    Spinner,
    Button,
    Image,
    Badge,
    Card
} from "react-bootstrap";

import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({
    productos,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (productos) {
            setLoading(false);
        } else {
            setLoading(true);
        }

    }, [productos]);

    return (
        <>
            {loading ? (

                <div className="text-center py-5">

                    <Spinner
                        animation="border"
                        variant="primary"
                        style={{
                            width: "3rem",
                            height: "3rem"
                        }}
                    />

                    <p className="mt-3 text-muted fw-semibold">
                        Cargando productos...
                    </p>

                </div>

            ) : (

                <Card
                    className="border-0 shadow-lg rounded-4 overflow-hidden"
                    style={{
                        background: "#ffffff"
                    }}
                >

                    <div
                        className="px-4 py-3"
                        style={{
                            background:
                                "linear-gradient(90deg, #0f172a, #1e3a8a)"
                        }}
                    >

                        <h4 className="text-white fw-bold mb-0">
                            📦 Inventario de Productos
                        </h4>

                    </div>

                    <Table
                        hover
                        responsive
                        className="align-middle mb-0"
                    >

                        <thead
                            style={{
                                backgroundColor: "#f8fafc"
                            }}
                        >

                            <tr>

                                <th className="py-3 px-3 text-secondary">
                                    ID
                                </th>

                                <th className="py-3 text-secondary">
                                    Producto
                                </th>

                                <th className="d-none d-md-table-cell py-3 text-secondary">
                                    Descripción
                                </th>

                                <th className="py-3 text-secondary">
                                    Categoría
                                </th>

                                <th className="py-3 text-secondary">
                                    Precio
                                </th>

                                <th className="py-3 text-secondary">
                                    Stock
                                </th>

                                <th className="py-3 text-center text-secondary">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {productos.length > 0 ? (

                                productos.map((producto) => (

                                    <tr
                                        key={producto.id_producto}
                                        style={{
                                            transition: "0.2s ease"
                                        }}
                                    >

                                        {/* ID */}
                                        <td className="fw-semibold px-3">
                                            #{producto.id_producto}
                                        </td>

                                        {/* PRODUCTO */}
                                        <td>

                                            <div className="d-flex align-items-center gap-3">

                                                {producto.imagen ? (

                                                    <Image
                                                        src={producto.imagen}
                                                        alt={producto.nombre}
                                                        roundedCircle
                                                        width={55}
                                                        height={55}
                                                        style={{
                                                            objectFit: "cover",
                                                            border:
                                                                "3px solid #e2e8f0"
                                                        }}
                                                    />

                                                ) : (

                                                    <div
                                                        className="d-flex align-items-center justify-content-center bg-light rounded-circle"
                                                        style={{
                                                            width: "55px",
                                                            height: "55px",
                                                            fontSize: "1.3rem"
                                                        }}
                                                    >
                                                        📦
                                                    </div>

                                                )}

                                                <div>

                                                    <h6 className="fw-bold mb-1">
                                                        {producto.nombre}
                                                    </h6>

                                                    <small className="text-muted">
                                                        Producto disponible
                                                    </small>

                                                </div>

                                            </div>

                                        </td>

                                        {/* DESCRIPCIÓN */}
                                        <td className="d-none d-md-table-cell text-muted">

                                            {producto.descripcion?.length > 70
                                                ? producto.descripcion.substring(0, 70) + "..."
                                                : producto.descripcion}

                                        </td>

                                        {/* CATEGORÍA */}
                                        <td>

                                            <Badge
                                                bg="primary"
                                                pill
                                                className="px-3 py-2"
                                            >
                                                {producto.categoria}
                                            </Badge>

                                        </td>

                                        {/* PRECIO */}
                                        <td>

                                            <span
                                                className="fw-bold"
                                                style={{
                                                    color: "#16a34a",
                                                    fontSize: "1rem"
                                                }}
                                            >
                                                C$ {parseFloat(producto.precio || 0).toFixed(2)}
                                            </span>

                                        </td>

                                        {/* STOCK */}
                                        <td>

                                            <Badge
                                                bg={
                                                    parseInt(producto.stock) <= 5
                                                        ? "danger"
                                                        : "success"
                                                }
                                                className="px-3 py-2"
                                            >
                                                {producto.stock} unidades
                                            </Badge>

                                        </td>

                                        {/* ACCIONES */}
                                        <td>

                                            <div className="d-flex justify-content-center gap-2">

                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="rounded-pill px-3 shadow-sm"
                                                    onClick={() =>
                                                        abrirModalEdicion(producto)
                                                    }
                                                >

                                                    <i className="bi bi-pencil-square me-1"></i>
                                                    Editar

                                                </Button>

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="rounded-pill px-3 shadow-sm"
                                                    onClick={() =>
                                                        abrirModalEliminacion(producto)
                                                    }
                                                >

                                                    <i className="bi bi-trash me-1"></i>
                                                    Eliminar

                                                </Button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center py-5"
                                    >

                                        <div className="py-4">

                                            <div
                                                style={{
                                                    fontSize: "4rem"
                                                }}
                                            >
                                                📦
                                            </div>

                                            <h5 className="fw-bold mt-3">
                                                No hay productos registrados
                                            </h5>

                                            <p className="text-muted mb-0">
                                                Agrega productos para comenzar
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </Table>

                </Card>

            )}
        </>
    );
};

export default TablaProductos;