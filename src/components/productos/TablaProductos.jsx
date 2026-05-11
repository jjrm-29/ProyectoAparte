import React, { useEffect, useState } from "react";
import { Table, Spinner, Button, Image } from "react-bootstrap";
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

                <div className="text-center">

                    <h4>Cargando productos...</h4>

                    <Spinner
                        animation="border"
                        variant="success"
                    />

                </div>

            ) : (

                <Table
                    striped
                    borderless
                    hover
                    responsive
                    size="sm"
                >

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Nombre</th>

                            <th className="d-none d-md-table-cell">
                                Descripción
                            </th>

                            <th>Categoría</th>

                            <th>Precio</th>

                            <th>Stock</th>

                            <th>Imagen</th>

                            <th className="text-center">
                                Acciones
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {productos.map((producto) => (

                            <tr key={producto.id_producto}>

                                <td>{producto.id_producto}</td>

                                <td>{producto.nombre}</td>

                                <td className="d-none d-md-table-cell">
                                    {producto.descripcion}
                                </td>

                                <td>{producto.categoria}</td>

                                <td>
                                    C${parseFloat(producto.precio || 0).toFixed(2)}
                                </td>

                                <td>{producto.stock}</td>

                                <td>

                                    {producto.imagen ? (

                                        <Image
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                            width={40}
                                            height={40}
                                            rounded
                                            style={{
                                                objectFit: "cover"
                                            }}
                                        />

                                    ) : (

                                        <span className="text-muted">
                                            Sin imagen
                                        </span>

                                    )}

                                </td>

                                <td className="text-center">

                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() =>
                                            abrirModalEdicion(producto)
                                        }
                                    >

                                        <i className="bi bi-pencil"></i>

                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() =>
                                            abrirModalEliminacion(producto)
                                        }
                                    >

                                        <i className="bi bi-trash"></i>

                                    </Button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </Table>

            )}
        </>
    );
};

export default TablaProductos;