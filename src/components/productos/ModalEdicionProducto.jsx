import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Spinner, Alert, Row, Col, Image } from "react-bootstrap";

const ModalEdicionProducto = ({
    show,
    onHide,
    producto,
    onGuardar,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        stock: "",
        imagen: ""
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [formError, setFormError] = useState("");
    const fileInputRef = useRef(null);

    const categorias = ["Bebidas", "Alimentos", "Despensa", "Lácteos", "Limpieza"];

    useEffect(() => {
        if (producto && show) {
            setFormData({
                nombre: producto.nombre || "",
                descripcion: producto.descripcion || "",
                precio: producto.precio || "",
                categoria: producto.categoria || "",
                stock: producto.stock || "",
                imagen: producto.imagen || ""
            });
            setPreviewImage(producto.imagen || null);
        }
    }, [producto, show]);

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
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered backdrop="static">
            <Modal.Header closeButton className="border-0 pb-2">
                <div className="d-flex align-items-center gap-3">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "60px",
                            height: "60px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            fontSize: "2rem"
                        }}
                    >
                        ✏️
                    </div>
                    <div>
                        <Modal.Title>Editar Producto</Modal.Title>
                        <small className="text-muted">Modifica los datos del producto</small>
                    </div>
                </div>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}

                    <Row>
                        <Col lg={5} className="text-center mb-4 mb-lg-0">
                            <div className="mx-auto mb-3 rounded-4 overflow-hidden border shadow-sm"
                                style={{ width: "240px", height: "240px", backgroundColor: "#f8f9fa" }}>
                                {previewImage ? (
                                    <Image src={previewImage} alt="Vista previa" fluid style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                        <span style={{ fontSize: "4.5rem", opacity: 0.5 }}>📷</span>
                                    </div>
                                )}
                            </div>
                            <Button variant="outline-primary" onClick={() => fileInputRef.current.click()}>
                                📸 Cambiar Imagen
                            </Button>
                            <Form.Control type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />
                        </Col>

                        <Col lg={7}>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Nombre del Producto *</Form.Label>
                                        <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required size="lg" />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Precio (C$) *</Form.Label>
                                        <Form.Control type="number" name="precio" value={formData.precio} onChange={handleChange} required size="lg" />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Stock</Form.Label>
                                        <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} size="lg" />
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Categoría *</Form.Label>
                                        <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} required size="lg">
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
                                        <Form.Control as="textarea" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={handleClose} disabled={loading}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Guardando cambios..." : "Guardar Cambios"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalEdicionProducto;