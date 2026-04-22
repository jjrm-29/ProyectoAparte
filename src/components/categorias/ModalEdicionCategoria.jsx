import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Spinner, Alert, Row, Col, Image } from "react-bootstrap";

const ModalEdicionCategoria = ({
    show,
    onHide,
    categoria,
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

    useEffect(() => {
        if (categoria && show) {
            setFormData({
                nombre: categoria.nombre || "",
                descripcion: categoria.descripcion || "",
                color: categoria.color || "#8B6F47",
                imagen: categoria.imagen || ""
            });
            setPreviewImage(categoria.imagen || null);
        }
    }, [categoria, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

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

        onGuardar(formData);
    };

    const handleClose = () => {
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>✏️ Editar Categoría</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}

                    <div className="text-center mb-4">
                        <div className="mx-auto mb-3 rounded-3 overflow-hidden border" 
                             style={{ width: "180px", height: "180px" }}>
                            {previewImage ? (
                                <Image 
                                    src={previewImage} 
                                    alt="Vista previa" 
                                    fluid 
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                />
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                    <span style={{ fontSize: "3rem" }}>📷</span>
                                </div>
                            )}
                        </div>
                        <Button variant="outline-primary" size="sm" onClick={() => fileInputRef.current.click()}>
                            Cambiar Imagen
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
                                    style={{ height: "48px" }} 
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
                            rows={4} 
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalEdicionCategoria;