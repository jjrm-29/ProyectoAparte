import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";

const ModalEliminacionCategoria = ({
    show,
    onHide,
    categoria,
    onConfirmar,
    loading = false
}) => {

    const [error, setError] = useState("");

    const handleConfirmar = async () => {

        try {

            setError("");

            if (!categoria) {
                setError("No se encontró la categoría");
                return;
            }

            await onConfirmar(categoria);

        } catch (err) {

            console.error(err);

            setError("Error al eliminar categoría");
        }
    };

    if (!categoria) return null;

    return (

        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
        >

            <Modal.Header closeButton className="border-0">

                <Modal.Title className="text-danger fw-bold">
                    🗑️ Eliminar Categoría
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                {error && (

                    <Alert variant="danger">
                        {error}
                    </Alert>

                )}

                <div className="text-center py-3">

                    <div className="mb-4">

                        <span style={{ fontSize: "4rem" }}>
                            ⚠️
                        </span>

                    </div>

                    <h4 className="fw-bold mb-3">
                        ¿Deseas eliminar esta categoría?
                    </h4>

                    <div className="bg-light rounded-4 p-4 shadow-sm">

                        <h5 className="fw-bold text-dark mb-2">
                            {categoria.nombre}
                        </h5>

                        <p className="text-muted mb-0">
                            {categoria.descripcion || "Sin descripción"}
                        </p>

                    </div>

                    <p className="text-danger fw-semibold mt-4 mb-0">
                        Esta acción no se puede deshacer.
                    </p>

                </div>

            </Modal.Body>

            <Modal.Footer className="border-0">

                <Button
                    variant="secondary"
                    className="rounded-3"
                    onClick={onHide}
                    disabled={loading}
                >
                    Cancelar
                </Button>

                <Button
                    variant="danger"
                    className="rounded-3"
                    onClick={handleConfirmar}
                    disabled={loading}
                >

                    {loading ? (

                        <>
                            <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                            />
                            Eliminando...
                        </>

                    ) : (

                        "Eliminar"

                    )}

                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEliminacionCategoria;