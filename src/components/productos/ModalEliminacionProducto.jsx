import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const ModalEliminacion = ({
    show,
    onHide,
    item,               // El producto o categoría a eliminar
    onConfirmar,        // Función que se ejecuta al confirmar
    loading = false,
    tipo = "producto"   // "producto" o "categoria"
}) => {
    if (!item) return null;

    const titulo = tipo === "categoria" ? "Eliminar Categoría" : "Eliminar Producto";
    const mensaje = tipo === "categoria"
        ? "¿Estás seguro de que deseas eliminar esta categoría?"
        : "¿Estás seguro de que deseas eliminar este producto?";

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            size="md"
        >
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="text-danger fw-bold">
                    🗑️ {titulo}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center py-4">
                <div className="mb-4">
                    <span style={{ fontSize: "4.5rem" }}>⚠️</span>
                </div>

                <h5 className="mb-3">¿Estás seguro?</h5>

                <div className="bg-light p-4 rounded-3 mb-4">
                    <strong className="d-block mb-2">{item.nombre}</strong>
                    {item.descripcion && (
                        <small className="text-muted d-block">{item.descripcion}</small>
                    )}
                </div>

                <p className="text-danger fw-semibold">
                    Esta acción es irreversible.<br />
                    {tipo === "categoria"
                        ? "Se eliminará permanentemente la categoría y todos sus productos asociados."
                        : "El producto será eliminado del inventario."}
                </p>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-2">
                <Button
                    variant="secondary"
                    onClick={onHide}
                    disabled={loading}
                    className="px-4"
                >
                    Cancelar
                </Button>
                <Button
                    variant="danger"
                    onClick={onConfirmar}
                    disabled={loading}
                    className="px-5 shadow-sm"
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Eliminando...
                        </>
                    ) : (
                        "Sí, Eliminar"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacion;