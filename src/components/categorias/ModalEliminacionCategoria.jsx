import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";

const ModalEliminacionCategoria = ({
    show,
    onHide,
    categoria,        // La categoría que se va a eliminar
    onConfirmar,      // Función que se ejecuta al confirmar la eliminación
    loading = false
}) => {
    const [error, setError] = useState("");

    const handleConfirmar = () => {
        if (!categoria) return;
        
        setError("");
        onConfirmar(categoria);
    };

    if (!categoria) return null;

    return (
        <Modal 
            show={show} 
            onHide={onHide}
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title className="text-danger">
                    🗑️ Eliminar Categoría
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <div className="text-center py-3">
                    <div className="mb-4">
                        <span style={{ fontSize: "3.5rem" }}>⚠️</span>
                    </div>
                    
                    <h5>¿Estás seguro de eliminar esta categoría?</h5>
                    
                    <div className="my-4 p-3 bg-light rounded">
                        <strong>{categoria.nombre}</strong>
                        <p className="text-muted mb-0 small mt-1">
                            {categoria.descripcion}
                        </p>
                    </div>

                    <p className="text-danger fw-semibold">
                        Esta acción es irreversible.<br />
                        La categoría será eliminada permanentemente.
                    </p>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button 
                    variant="secondary" 
                    onClick={onHide}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button 
                    variant="danger" 
                    onClick={handleConfirmar}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Eliminando...
                        </>
                    ) : (
                        "Sí, Eliminar Categoría"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionCategoria;