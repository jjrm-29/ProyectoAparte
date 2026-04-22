import React, { useState, useRef } from "react";
import { Modal, Button, Form, Spinner, Alert, Row, Col, Image } from "react-bootstrap";

const ModalRegistroCategoria = ({
    show,
    onHide,
    onGuardar,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        color: "#8B6F47",
        imagen: ""
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [formError, setFormError] = useState("");
    const fileInputRef = useRef(null);

    const resetForm = () => {
        setFormData({
            nombre: "",
            descripcion: "",
            color: "#8B6F47",
            imagen: ""
        });
        setPreviewImage(null);
        setFormError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setFormError("Por favor selecciona un archivo de imagen");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target.result);
            setFormData(prev => ({ ...prev, imagen: event.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.nombre.trim()) {
            setFormError("El nombre de la categoría es obligatorio");
            return;
        }

        const datosFinales = {
            ...formData,
            imagen: formData.imagen || `https://via.placeholder.com/600x400/8B6F47/ffffff?text=${encodeURIComponent(formData.nombre)}`
        };

        onGuardar(datosFinales);
    };

    const handleClose = () => {
        resetForm();
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton className="border-0">
                <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "52px", height: "52px", backgroundColor: "#f8f9fa", fontSize: "1.9rem" }}>
                        🛒
                    </div>
                    <div>
                        <Modal.Title>Nueva Categoría</Modal.Title>
                        <small className="text-muted">Crea una nueva categoría para tus productos</small>
                    </div>
                </div>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}

                    {/* Vista previa de imagen */}
                    <div className="text-center mb-4">
                        <div className="mx-auto mb-3 rounded-3 overflow-hidden border shadow-sm"
                            style={{ width: "180px", height: "180px", backgroundColor: "#f8f9fa" }}>
                            {previewImage ? (
                                <Image src={previewImage} alt="Vista previa" fluid style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                    <span style={{ fontSize: "3.5rem" }}>📷</span>
                                    <small className="mt-2">Sin imagen seleccionada</small>
                                </div>
                            )}
                        </div>
                        <Button variant="outline-primary" onClick={() => fileInputRef.current.click()}>
                            📸 Subir Imagen de la Categoría
                        </Button>
                        <Form.Control
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                    </div>

                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Nombre de la Categoría *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Snacks, Congelados, Higiene..."
                                    required
                                    size="lg"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Color</Form.Label>
                                <Form.Control
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    style={{ height: "48px", borderRadius: "8px" }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Describe qué productos pertenecen a esta categoría..."
                            rows={4}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Creando..." : "Crear Categoría"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalRegistroCategoria;