import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Button,
    Row,
    Col,
    Card,
    Image,
    Spinner,
    InputGroup
} from "react-bootstrap";

const CATEGORIAS_DEFAULT = [
    "Bebidas",
    "Alimentos",
    "Despensa",
    "Lácteos",
    "Limpieza"
];

const ModalEdicionProducto = ({
    show,
    onHide,
    producto,
    onGuardar,
    loading,
    categorias = CATEGORIAS_DEFAULT,
}) => {

    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        stock: "",
        categoria: "",
        descripcion: "",
        imagen: "",
        archivo: null
    });

    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (show && producto) {
            setFormData({
                nombre: producto.nombre || "",
                precio: producto.precio ?? "",
                stock: producto.stock ?? "",
                categoria: producto.categoria || "",
                descripcion: producto.descripcion || "",
                imagen: producto.imagen || "",
                archivo: null,
            });
            setFormError("");
        }
    }, [show, producto]);

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

    const handleArchivo = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const preview = URL.createObjectURL(file);

        setFormData((prev) => ({
            ...prev,
            archivo: file,
            imagen: preview
        }));
    };

    // =========================
    // GUARDAR
    // =========================

    const handleActualizar = async () => {
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

        await onGuardar(formData);
    };

    return (

        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            centered
            size="xl"
        >

            {/* HEADER */}

            <Modal.Header
                closeButton
                className="border-0 pb-0"
            >

                <div>

                    <h3 className="fw-bold mb-1">
                        ✏️ Editar Producto
                    </h3>

                    <p className="text-muted mb-0">
                        Actualiza la información del producto seleccionado
                    </p>

                </div>

            </Modal.Header>

            {/* BODY */}

            <Modal.Body className="pt-4">

                {formError && (
                    <div className="alert alert-danger rounded-4 border-0 mb-4">
                        {formError}
                    </div>
                )}

                <Row className="g-4">

                    {/* PANEL IZQUIERDO */}

                    <Col lg={4}>

                        <Card className="border-0 shadow-sm rounded-4 h-100">

                            <Card.Body className="text-center p-4">

                                <div className="mb-4">

                                    {formData.imagen ? (

                                        <Image
                                            src={formData.imagen}
                                            rounded
                                            fluid
                                            className="shadow-sm border"
                                            style={{
                                                width: "100%",
                                                maxWidth: "250px",
                                                height: "250px",
                                                objectFit: "cover",
                                                borderRadius: "20px"
                                            }}
                                        />

                                    ) : (

                                        <div
                                            className="bg-light d-flex align-items-center justify-content-center mx-auto shadow-sm"
                                            style={{
                                                width: "250px",
                                                height: "250px",
                                                borderRadius: "20px",
                                                fontSize: "5rem"
                                            }}
                                        >
                                            📦
                                        </div>

                                    )}

                                </div>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Cambiar Imagen
                                    </Form.Label>

                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleArchivo}
                                        className="rounded-4"
                                    />

                                    <Form.Text className="text-muted">
                                        Selecciona una nueva imagen para el producto
                                    </Form.Text>

                                </Form.Group>

                            </Card.Body>

                        </Card>

                    </Col>

                    {/* PANEL DERECHO */}

                    <Col lg={8}>

                        <Card className="border-0 shadow-sm rounded-4">

                            <Card.Body className="p-4">

                                <Row className="g-4">

                                    {/* NOMBRE */}

                                    <Col md={6}>

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
                                                    placeholder="Ej: Coca Cola 2L"
                                                    className="rounded-end-4"
                                                    required
                                                />

                                            </InputGroup>

                                        </Form.Group>

                                    </Col>

                                    {/* CATEGORÍA */}

                                    <Col md={6}>

                                        <Form.Group>

                                            <Form.Label className="fw-semibold">
                                                Categoría *
                                            </Form.Label>

                                            <Form.Select
                                                name="categoria"
                                                value={formData.categoria}
                                                onChange={handleChange}
                                                className="rounded-4"
                                                required
                                            >

                                                <option value="">
                                                    Seleccione una categoría
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
                                                    step="0.01"
                                                    min="0"
                                                    name="precio"
                                                    value={formData.precio}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                    className="rounded-end-4"
                                                    required
                                                />

                                            </InputGroup>

                                        </Form.Group>

                                    </Col>

                                    {/* STOCK */}

                                    <Col md={6}>

                                        <Form.Group>

                                            <Form.Label className="fw-semibold">
                                                Stock Disponible
                                            </Form.Label>

                                            <InputGroup>

                                                <InputGroup.Text>
                                                    📦
                                                </InputGroup.Text>

                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleChange}
                                                    placeholder="Cantidad disponible"
                                                    className="rounded-end-4"
                                                />

                                            </InputGroup>

                                        </Form.Group>

                                    </Col>

                                    {/* DESCRIPCIÓN */}

                                    <Col xs={12}>

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
                                                placeholder="Describe las características del producto..."
                                                className="rounded-4"
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

            <Modal.Footer className="border-0 pt-0 px-4 pb-4">

                <Button
                    variant="light"
                    onClick={onHide}
                    className="rounded-4 px-4 fw-semibold"
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleActualizar}
                    disabled={loading}
                    className="rounded-4 px-4 fw-semibold shadow-sm"
                >

                    {loading ? (
                        <>
                            <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                            />
                            Actualizando...
                        </>
                    ) : (
                        "Guardar Cambios"
                    )}

                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEdicionProducto;