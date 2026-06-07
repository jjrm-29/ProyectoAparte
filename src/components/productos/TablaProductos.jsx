import React from "react";
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

    const loading = productos == null;

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
                        Cargando productos...
                    </p>

                </div>

            ) : (

                <Card className="data-table-card border-0 overflow-hidden">

                    <div className="table-hero-bar">
                        <h4 className="fw-bold mb-0">
                            <i className="bi bi-box-seam me-2" aria-hidden="true" />
                            Inventario de Productos
                        </h4>
                        <span className="table-hero-count">
                            {productos.length} {productos.length === 1 ? "producto" : "productos"}
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
                                    <th className="col-producto">Producto</th>
                                    <th className="d-none d-lg-table-cell">Descripción</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th className="text-center col-acciones">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {productos.length > 0 ? (

                                    productos.map((producto, index) => (

                                        <tr
                                            key={producto.id_producto}
                                            className="table-row-animate"
                                            style={{ animationDelay: `${index * 0.04}s` }}
                                        >

                                            <td className="col-id fw-semibold text-muted">
                                                #{producto.id_producto}
                                            </td>

                                            <td className="col-producto">
                                                <div className="table-product-cell">
                                                    {producto.imagen ? (
                                                        <Image
                                                            src={producto.imagen}
                                                            alt={producto.nombre}
                                                            rounded
                                                            className="table-product-thumb"
                                                        />
                                                    ) : (
                                                        <div className="table-product-thumb table-product-thumb--empty">
                                                            <i className="bi bi-box-seam" aria-hidden="true" />
                                                        </div>
                                                    )}

                                                    <span
                                                        className="table-product-name"
                                                        title={producto.nombre}
                                                    >
                                                        {producto.nombre}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="d-none d-lg-table-cell table-desc-cell">
                                                <span title={producto.descripcion}>
                                                    {producto.descripcion?.length > 60
                                                        ? producto.descripcion.substring(0, 60) + "…"
                                                        : producto.descripcion || "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <Badge bg="primary" pill className="table-badge">
                                                    {producto.categoria}
                                                </Badge>
                                            </td>

                                            <td>
                                                <span className="table-price">
                                                    C$ {parseFloat(producto.precio || 0).toFixed(2)}
                                                </span>
                                            </td>

                                            <td>
                                                <Badge
                                                    bg={parseInt(producto.stock) <= 5 ? "danger" : "success"}
                                                    className="table-badge"
                                                >
                                                    {producto.stock}
                                                </Badge>
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="btn-action btn-interactive"
                                                        onClick={() => abrirModalEdicion(producto)}
                                                        title="Editar producto"
                                                    >
                                                        <i className="bi bi-pencil-square" aria-hidden="true" />
                                                        <span className="d-none d-xl-inline ms-1">Editar</span>
                                                    </Button>

                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="btn-action btn-interactive"
                                                        onClick={() => abrirModalEliminacion(producto)}
                                                        title="Eliminar producto"
                                                    >
                                                        <i className="bi bi-trash" aria-hidden="true" />
                                                        <span className="d-none d-xl-inline ms-1">Eliminar</span>
                                                    </Button>
                                                </div>
                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="table-empty-state py-4">
                                                <i className="bi bi-inbox table-empty-icon" aria-hidden="true" />
                                                <h5 className="fw-bold mt-3">No hay productos registrados</h5>
                                                <p className="text-muted mb-0">
                                                    Agrega productos para comenzar
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

export default TablaProductos;
