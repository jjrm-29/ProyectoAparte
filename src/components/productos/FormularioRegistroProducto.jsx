import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert, Row, Col, Image } from "react-bootstrap";

const FormularioRegistroProducto = ({
    show,
    onHide,
    onGuardar,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        imagen: "",
        stock: ""
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [formError, setFormError] = useState("");
    const fileInputRef = React.useRef(null);

    const categorias = ["Bebidas", "Alimentos", "Despensa", "Lácteos", "Limpieza"];

    const resetForm = () => {
        setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            categoria: "",
            imagen: "",
            stock: ""
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
            setFormError("El nombre del producto es obligatorio");
            return;
        }
        if (!formData.precio || parseFloat(formData.precio) <= 0) {
            setFormError("El precio debe ser mayor a 0");
            return;
        }
        if (!formData.categoria) {
            setFormError("Debes seleccionar una categoría");
            return;
        }

        onGuardar(formData);
    };

    const handleClose = () => {
        resetForm();
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton className="border-0 pb-2">
                <div className="d-flex align-items-center gap-3 w-100">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                            width: "60px",
                            height: "60px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            fontSize: "2rem"
                        }}
                    >
                        📦
                    </div>
                    <div className="flex-grow-1">
                        <Modal.Title className="mb-1">Nuevo Producto</Modal.Title>
                        <small className="text-muted">Ingresa los detalles del nuevo producto</small>
                    </div>
                </div>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body className="pt-3">
                    {formError && <Alert variant="danger" className="mb-4">{formError}</Alert>}

                    <Row>
                        {/* Vista previa de imagen */}
                        <Col md={5} className="text-center mb-4 mb-md-0">
                            <div
                                className="mx-auto rounded-4 overflow-hidden border shadow-sm"
                                style={{
                                    width: "220px",
                                    height: "220px",
                                    backgroundColor: "#f8f9fa"
                                }}
                            >
                                {previewImage ? (
                                    <Image
                                        src={previewImage}
                                        alt="Vista previa"
                                        fluid
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                        <span style={{ fontSize: "4.5rem", opacity: 0.6 }}>📷</span>
                                        <small className="mt-3">Sin imagen</small>
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="outline-primary"
                                className="mt-3"
                                onClick={() => fileInputRef.current.click()}
                            >
                                📸 Subir Imagen del Producto
                            </Button>
                            <Form.Control
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: "none" }}
                            />
                        </Col>

                        {/* Formulario */}
                        <Col md={7}>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Nombre del Producto *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ej: Café Molido Premium 500g"
                                            required
                                            size="lg"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Precio (C$)*</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="precio"
                                            value={formData.precio}
                                            onChange={handleChange}
                                            placeholder="150"
                                            required
                                            size="lg"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Stock</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            placeholder="50"
                                            size="lg"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Categoría *</Form.Label>
                                        <Form.Select
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleChange}
                                            required
                                            size="lg"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categorias.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Descripción</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            placeholder="Describe las características del producto..."
                                            rows={4}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer className="border-0 pt-2">
                    <Button
                        variant="light"
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="success"
                        type="submit"
                        disabled={loading}
                        className="px-5 shadow"
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Guardando Producto...
                            </>
                        ) : (
                            "Guardar Producto"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default FormularioRegistroProducto;