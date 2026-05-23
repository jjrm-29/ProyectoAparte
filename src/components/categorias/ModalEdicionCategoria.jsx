import React, { useState, useEffect, useRef } from "react";
import {
    Modal,
    Button,
    Form,
    Spinner,
    Alert,
    Row,
    Col,
    Image
} from "react-bootstrap";

const ModalEdicionCategoria = ({
    show,
    onHide,
    categoria,
    onGuardar,
    loading = false
}) => {

    const [formData, setFormData] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        imagen: ""
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [formError, setFormError] = useState("");

    const fileInputRef = useRef(null);

    // =========================
    // CARGAR DATOS
    // =========================

    useEffect(() => {

        if (categoria && show) {

            setFormData({
                id: categoria.id || "",
                nombre: categoria.nombre || "",
                descripcion: categoria.descripcion || "",
                imagen: categoria.imagen || ""
            });

            setPreviewImage(categoria.imagen || null);
        }

    }, [categoria, show]);

    // =========================
    // CAMBIOS INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // CAMBIAR IMAGEN
    // =========================

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            setFormError("Selecciona una imagen válida");
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {

            setPreviewImage(event.target.result);

            setFormData((prev) => ({
                ...prev,
                imagen: event.target.result
            }));
        };

        reader.readAsDataURL(file);
    };

    // =========================
    // GUARDAR
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setFormError("");

        if (!formData.nombre.trim()) {

            setFormError("El nombre es obligatorio");
            return;
        }

        try {

            await onGuardar(formData);

        } catch (error) {

            console.error(error);

            setFormError("Error al actualizar categoría");
        }
    };

    // =========================
    // CERRAR
    // =========================

    const handleClose = () => {

        setFormError("");

        onHide();
    };

    return (

        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            backdrop="static"
        >

            <Modal.Header closeButton className="border-0">

                <Modal.Title className="fw-bold">
                    ✏️ Editar Categoría
                </Modal.Title>

            </Modal.Header>

            <Form onSubmit={handleSubmit}>

                <Modal.Body>

                    {formError && (

                        <Alert variant="danger">
                            {formError}
                        </Alert>

                    )}

                    {/* IMAGEN */}

                    <div className="text-center mb-4">

                        <div
                            className="mx-auto mb-3 rounded-4 overflow-hidden border shadow-sm"
                            style={{
                                width: "180px",
                                height: "180px",
                                backgroundColor: "#f8f9fa"
                            }}
                        >

                            {previewImage ? (

                                <Image
                                    src={previewImage}
                                    alt="Vista previa"
                                    fluid
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div className="d-flex align-items-center justify-content-center h-100 text-muted">

                                    <span style={{ fontSize: "3rem" }}>
                                        📷
                                    </span>

                                </div>

                            )}

                        </div>

                        <Button
                            variant="outline-primary"
                            onClick={() => fileInputRef.current.click()}
                        >
                            📸 Cambiar Imagen
                        </Button>

                        <Form.Control
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />

                    </div>

                    {/* FORMULARIO */}

                    <Row>

                        <Col md={12}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Nombre de la Categoría *
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Snacks, Bebidas..."
                                    required
                                    size="lg"
                                />

                            </Form.Group>

                        </Col>

                    </Row>

                    <Form.Group className="mb-4">

                        <Form.Label className="fw-semibold">
                            Descripción
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Describe la categoría..."
                        />

                    </Form.Group>

                </Modal.Body>

                <Modal.Footer className="border-0">

                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                Guardando...
                            </>

                        ) : (

                            "Guardar Cambios"

                        )}

                    </Button>

                </Modal.Footer>

            </Form>

        </Modal>
    );
};

export default ModalEdicionCategoria;