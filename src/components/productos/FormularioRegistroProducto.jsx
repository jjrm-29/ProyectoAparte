import React, { useState, useRef, useEffect } from "react";
import {
    Modal,
    Button,
    Form,
    Spinner,
    Alert,
    Row,
    Col,
    Image,
    Card,
    InputGroup
} from "react-bootstrap";

const CATEGORIAS_DEFAULT = [
    "Bebidas",
    "Alimentos",
    "Despensa",
    "Lácteos",
    "Limpieza"
];

const FormularioRegistroProducto = ({
    show,
    onHide,
    onGuardar,
    loading = false,
    categorias = CATEGORIAS_DEFAULT,
}) => {

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        imagen: "",
        stock: "",
        archivo: null
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [formError, setFormError] = useState("");

    const fileInputRef = useRef(null);

    // =========================
    // RESET
    // =========================

    const resetForm = () => {

        setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            categoria: "",
            imagen: "",
            stock: "",
            archivo: null
        });

        setPreviewImage(null);
        setFormError("");
    };

    useEffect(() => {
        if (!show) {
            resetForm();
        }
    }, [show]);

    // =========================
    // INPUTS
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // IMAGEN
    // =========================

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const preview = URL.createObjectURL(file);

        setPreviewImage(preview);

        setFormData((prev) => ({
            ...prev,
            archivo: file
        }));
    };

    // =========================
    // VALIDACIONES
    // =========================

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

    // =========================
    // CERRAR
    // =========================

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

            {/* HEADER */}

            <Modal.Header
                closeButton
                className="border-0 pb-0 px-4 pt-4"
            >

                <div className="d-flex align-items-center gap-3">

                    <div
                        className="d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "22px",
                            background:
                                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            fontSize: "2rem",
                            color: "white"
                        }}
                    >
                        📦
                    </div>

                    <div>

                        <h2 className="fw-bold mb-1">
                            Registrar Producto
                        </h2>

                        <p className="text-muted mb-0">
                            Completa la información del nuevo producto
                        </p>

                    </div>

                </div>

            </Modal.Header>

            {/* FORM */}

            <Form onSubmit={handleSubmit}>

                <Modal.Body className="p-4">

                    {formError && (

                        <Alert
                            variant="danger"
                            className="rounded-4 border-0 shadow-sm"
                        >
                            ⚠️ {formError}
                        </Alert>

                    )}

                    <Row className="g-4">

                        {/* PANEL IMAGEN */}

                        <Col lg={4}>

                            <Card className="border-0 shadow-sm rounded-4 h-100">

                                <Card.Body className="text-center p-4">

                                    <div
                                        className="mx-auto mb-4 border overflow-hidden shadow-sm"
                                        style={{
                                            width: "100%",
                                            maxWidth: "280px",
                                            height: "280px",
                                            borderRadius: "24px",
                                            background: "#f8fafc"
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

                                            <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">

                                                <div
                                                    style={{
                                                        fontSize: "5rem",
                                                        opacity: 0.5
                                                    }}
                                                >
                                                    🖼️
                                                </div>

                                                <p className="mt-3 mb-0 fw-semibold">
                                                    Vista previa
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                    <Button
                                        variant="outline-primary"
                                        className="rounded-4 px-4 fw-semibold"
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                    >
                                        📸 Seleccionar Imagen
                                    </Button>

                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                    />

                                    <p className="text-muted small mt-3 mb-0">
                                        Formatos permitidos: JPG, PNG, WEBP
                                    </p>

                                </Card.Body>

                            </Card>

                        </Col>

                        {/* PANEL FORMULARIO */}

                        <Col lg={8}>

                            <Card className="border-0 shadow-sm rounded-4">

                                <Card.Body className="p-4">

                                    <Row className="g-4">

                                        {/* NOMBRE */}

                                        <Col md={12}>

                                            <Form.Group>

                                                <Form.Label className="fw-semibold">
                                                    Nombre del Producto *
                                                </Form.Label>

                                                <InputGroup>

                                                    <InputGroup.Text>
                                                        🛒
                                                    </InputGroup.Text>

                                                    <Form.Control
                                                        type="text"
                                                        name="nombre"
                                                        value={formData.nombre}
                                                        onChange={handleChange}
                                                        placeholder="Ej: Café Molido Premium 500g"
                                                        className="rounded-end-4 shadow-none"
                                                        size="lg"
                                                        required
                                                    />

                                                </InputGroup>

                                            </Form.Group>

                                        </Col>

                                        {/* PRECIO */}

                                        <Col md={6}>

                                            <Form.Group>

                                                <Form.Label className="fw-semibold">
                                                    Precio *
                                                </Form.Label>

                                                <InputGroup>

                                                    <InputGroup.Text>
                                                        C$
                                                    </InputGroup.Text>

                                                    <Form.Control
                                                        type="number"
                                                        name="precio"
                                                        value={formData.precio}
                                                        onChange={handleChange}
                                                        placeholder="0.00"
                                                        className="rounded-end-4 shadow-none"
                                                        size="lg"
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                    />

                                                </InputGroup>

                                            </Form.Group>

                                        </Col>

                                        {/* STOCK */}

                                        <Col md={6}>

                                            <Form.Group>

                                                <Form.Label className="fw-semibold">
                                                    Stock
                                                </Form.Label>

                                                <InputGroup>

                                                    <InputGroup.Text>
                                                        📦
                                                    </InputGroup.Text>

                                                    <Form.Control
                                                        type="number"
                                                        name="stock"
                                                        value={formData.stock}
                                                        onChange={handleChange}
                                                        placeholder="Cantidad disponible"
                                                        className="rounded-end-4 shadow-none"
                                                        size="lg"
                                                        min="0"
                                                    />

                                                </InputGroup>

                                            </Form.Group>

                                        </Col>

                                        {/* CATEGORÍA */}

                                        <Col md={12}>

                                            <Form.Group>

                                                <Form.Label className="fw-semibold">
                                                    Categoría *
                                                </Form.Label>

                                                <Form.Select
                                                    name="categoria"
                                                    value={formData.categoria}
                                                    onChange={handleChange}
                                                    className="rounded-4 shadow-none"
                                                    size="lg"
                                                    required
                                                >

                                                    <option value="">
                                                        Selecciona una categoría
                                                    </option>

                                                    {categorias.map((cat) => (

                                                        <option
                                                            key={cat}
                                                            value={cat}
                                                        >
                                                            {cat}
                                                        </option>

                                                    ))}

                                                </Form.Select>

                                            </Form.Group>

                                        </Col>

                                        {/* DESCRIPCIÓN */}

                                        <Col md={12}>

                                            <Form.Group>

                                                <Form.Label className="fw-semibold">
                                                    Descripción
                                                </Form.Label>

                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    name="descripcion"
                                                    value={formData.descripcion}
                                                    onChange={handleChange}
                                                    placeholder="Describe las características y detalles del producto..."
                                                    className="rounded-4 shadow-none"
                                                />

                                            </Form.Group>

                                        </Col>

                                    </Row>

                                </Card.Body>

                            </Card>

                        </Col>

                    </Row>

                </Modal.Body>

                {/* FOOTER */}

                <Modal.Footer className="border-0 px-4 pb-4">

                    <Button
                        variant="light"
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-4 px-4 fw-semibold"
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="rounded-4 px-5 fw-semibold shadow-sm"
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
                            "Guardar Producto"
                        )}

                    </Button>

                </Modal.Footer>

            </Form>

        </Modal>
    );
};

export default FormularioRegistroProducto;