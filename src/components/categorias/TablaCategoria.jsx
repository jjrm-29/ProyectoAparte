import React, { useEffect, useState } from "react";
import {
    Table,
    Spinner,
    Button,
    Badge,
    Card
} from "react-bootstrap";

import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCategorias = ({
    categorias,
    abrirModalEdicion,
    abrirModalEliminacion,
    generarPDFCategoria
}) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (categorias) {
            setLoading(false);
        } else {
            setLoading(true);
        }

    }, [categorias]);

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
                        Cargando categorías...
                    </p>

                </div>

            ) : (

                <Card className="border-0 shadow-lg rounded-4 overflow-hidden">

                    {/* HEADER */}
                    <div
                        className="px-4 py-3"
                        style={{
                            background:
                                "linear-gradient(90deg, #0f172a, #1e3a8a)"
                        }}
                    >

                        <h4 className="text-white fw-bold mb-0">
                            📂 Gestión de Categorías
                        </h4>

                    </div>

                    {/* TABLA */}
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
                                    Nombre
                                </th>

                                <th className="py-3 text-secondary">
                                    Descripción
                                </th>

                                <th className="py-3 text-center text-secondary">
                                    Estado
                                </th>

                                <th className="py-3 text-center text-secondary">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {categorias.length > 0 ? (

                                categorias.map((categoria) => (

                                    <tr
                                        key={categoria.id}
                                        style={{
                                            transition: "0.2s ease"
                                        }}
                                    >

                                        {/* ID */}
                                        <td className="fw-semibold px-3">
                                            #{categoria.id}
                                        </td>

                                        {/* NOMBRE */}
                                        <td>

                                            <div className="d-flex align-items-center gap-2">

                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: "45px",
                                                        height: "45px",
                                                        background:
                                                            "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                                                        color: "white",
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    <i className="bi bi-tags-fill"></i>
                                                </div>

                                                <div>

                                                    <h6 className="fw-bold mb-0">
                                                        {categoria.nombre}
                                                    </h6>

                                                    <small className="text-muted">
                                                        Categoría registrada
                                                    </small>

                                                </div>

                                            </div>

                                        </td>

                                        {/* DESCRIPCIÓN */}
                                        <td className="text-muted">

                                            {categoria.descripcion?.length > 80
                                                ? categoria.descripcion.substring(0, 80) + "..."
                                                : categoria.descripcion}

                                        </td>

                                        {/* ESTADO */}
                                        <td className="text-center">

                                            <Badge
                                                bg="success"
                                                pill
                                                className="px-3 py-2"
                                            >
                                                Activa
                                            </Badge>

                                        </td>

                                        {/* ACCIONES */}
                                        <td>

                                            <div className="d-flex justify-content-center gap-2 flex-wrap">

                                                {/* EDITAR */}
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="rounded-pill px-3 shadow-sm"
                                                    onClick={() =>
                                                        abrirModalEdicion(categoria)
                                                    }
                                                >

                                                    <i className="bi bi-pencil-square me-1"></i>
                                                    Editar

                                                </Button>

                                                {/* ELIMINAR */}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="rounded-pill px-3 shadow-sm"
                                                    onClick={() =>
                                                        abrirModalEliminacion(categoria)
                                                    }
                                                >

                                                    <i className="bi bi-trash me-1"></i>
                                                    Eliminar

                                                </Button>

                                                {/* PDF */}
                                                <Button
                                                    variant="outline-dark"
                                                    size="sm"
                                                    className="rounded-pill px-3 shadow-sm"
                                                    onClick={() =>
                                                        generarPDFCategoria(categoria)
                                                    }
                                                >

                                                    <i className="bi bi-file-earmark-pdf me-1"></i>
                                                    PDF

                                                </Button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-5"
                                    >

                                        <div className="py-4">

                                            <div
                                                style={{
                                                    fontSize: "4rem"
                                                }}
                                            >
                                                📂
                                            </div>

                                            <h5 className="fw-bold mt-3">
                                                No hay categorías registradas
                                            </h5>

                                            <p className="text-muted mb-0">
                                                Agrega una categoría para comenzar
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

export default TablaCategorias;