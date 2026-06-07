import React from "react";
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

    const loading = categorias == null;

    return (
        <>
            {loading ? (

                <div className="text-center py-5 fade-in">

                    <Spinner
                        animation="border"
                        variant="primary"
                        style={{
                            width: "3rem",
                            height: "3rem"
                        }}
                    />

                    <p className="mt-3 text-muted fw-semibold loading-pulse">
                        Cargando categorías...
                    </p>

                </div>

            ) : (

                <Card className="data-table-card border-0 overflow-hidden">

                    <div className="table-hero-bar">
                        <h4 className="fw-bold mb-0">
                            <i className="bi bi-folder2-open me-2" aria-hidden="true" />
                            Gestión de Categorías
                        </h4>
                        <span className="table-hero-count">
                            {categorias.length} {categorias.length === 1 ? "categoría" : "categorías"}
                        </span>
                    </div>

                    <div className="table-responsive">
                        <Table
                            hover
                            className="align-middle mb-0 data-table"
                        >

                            <thead>
                                <tr>
                                    <th className="col-id">ID</th>
                                    <th className="col-producto">Nombre</th>
                                    <th className="d-none d-md-table-cell">Descripción</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-center col-acciones">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {categorias.length > 0 ? (

                                    categorias.map((categoria, index) => (

                                        <tr
                                            key={categoria.id}
                                            className="table-row-animate"
                                            style={{ animationDelay: `${index * 0.04}s` }}
                                        >

                                            <td className="col-id fw-semibold text-muted">
                                                #{categoria.id}
                                            </td>

                                            <td className="col-producto">
                                                <div className="table-product-cell">
                                                    <div className="table-category-icon">
                                                        <i className="bi bi-tags-fill" aria-hidden="true" />
                                                    </div>
                                                    <span
                                                        className="table-product-name"
                                                        title={categoria.nombre}
                                                    >
                                                        {categoria.nombre}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="d-none d-md-table-cell table-desc-cell">
                                                <span title={categoria.descripcion}>
                                                    {categoria.descripcion?.length > 70
                                                        ? categoria.descripcion.substring(0, 70) + "…"
                                                        : categoria.descripcion || "—"}
                                                </span>
                                            </td>

                                            <td className="text-center">
                                                <Badge bg="success" pill className="table-badge">
                                                    Activa
                                                </Badge>
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="btn-action btn-interactive"
                                                        onClick={() => abrirModalEdicion(categoria)}
                                                        title="Editar categoría"
                                                    >
                                                        <i className="bi bi-pencil-square" aria-hidden="true" />
                                                        <span className="d-none d-xl-inline ms-1">Editar</span>
                                                    </Button>

                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="btn-action btn-interactive"
                                                        onClick={() => abrirModalEliminacion(categoria)}
                                                        title="Eliminar categoría"
                                                    >
                                                        <i className="bi bi-trash" aria-hidden="true" />
                                                        <span className="d-none d-xl-inline ms-1">Eliminar</span>
                                                    </Button>

                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        className="btn-action btn-action--outline btn-interactive"
                                                        onClick={() => generarPDFCategoria(categoria)}
                                                        title="Exportar PDF"
                                                    >
                                                        <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
                                                        <span className="d-none d-xl-inline ms-1">PDF</span>
                                                    </Button>
                                                </div>
                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="table-empty-state py-4">
                                                <i className="bi bi-folder2 table-empty-icon" aria-hidden="true" />
                                                <h5 className="fw-bold mt-3">No hay categorías registradas</h5>
                                                <p className="text-muted mb-0">
                                                    Agrega una categoría para comenzar
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </Table>
                    </div>

                </Card>

            )}
        </>
    );
};

export default TablaCategorias;
