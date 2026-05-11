import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Button,
    Row,
    Col
} from "react-bootstrap";

const ModalEdicionProducto = ({
    show,
    onHide,
    producto,
    onGuardar,
    loading
}) => {

    const [formData, setFormData] = useState({
        nombre: producto?.nombre || "",
        precio: producto?.precio || "",
        stock: producto?.stock || "",
        categoria: producto?.categoria || "",
        descripcion: producto?.descripcion || "",
        imagen: producto?.imagen || "",
        archivo: null
    });

    const categorias = [
        "Bebidas",
        "Alimentos",
        "Despensa",
        "Lácteos",
        "Limpieza"
    ];
    useEffect(() => {

        if (producto) {

            setFormData({
                nombre: producto.nombre || "",
                precio: producto.precio || "",
                stock: producto.stock || "",
                categoria: producto.categoria || "",
                descripcion: producto.descripcion || "",
                imagen: producto.imagen || "",
                archivo: null
            });

        }

    }, [producto]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArchivo = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            archivo: file
        }));
    };

    const handleActualizar = async () => {
        await onGuardar(formData);
    };

    return (

        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            centered
            size="lg"
        >

            <Modal.Header closeButton>

                <Modal.Title>
                    Editar Producto
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Row>

                        {/* CATEGORIA */}

                        <Col xs={12} md={4}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Categoría *
                                </Form.Label>

                                <Form.Select
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Seleccione...
                                    </option>

                                    {categorias.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}

                                </Form.Select>

                            </Form.Group>

                        </Col>

                        {/* NOMBRE */}

                        <Col xs={12} md={4}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Nombre *
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />

                            </Form.Group>

                        </Col>

                        {/* PRECIO */}

                        <Col xs={12} md={4}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Precio *
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    required
                                />

                            </Form.Group>

                        </Col>

                        {/* STOCK */}

                        <Col xs={12} md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Stock
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                />

                            </Form.Group>

                        </Col>

                        {/* IMAGEN ACTUAL */}

                        <Col xs={12} md={6}>

                            <Form.Group className="mb-3 text-center">

                                <Form.Label>
                                    Imagen actual
                                </Form.Label>

                                {formData.imagen ? (

                                    <div className="mb-2">

                                        <img
                                            src={formData.imagen}
                                            alt="Producto actual"
                                            style={{
                                                maxWidth: "120px",
                                                maxHeight: "120px",
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                            }}
                                        />

                                    </div>

                                ) : (

                                    <p className="text-muted">
                                        Sin imagen
                                    </p>

                                )}

                            </Form.Group>

                        </Col>

                        {/* NUEVA IMAGEN */}

                        <Col xs={12}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Nueva imagen (opcional)
                                </Form.Label>

                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleArchivo}
                                />

                            </Form.Group>

                            <Form.Text className="text-muted">
                                Si seleccionas una nueva imagen,
                                reemplazará la actual
                            </Form.Text>

                        </Col>

                        {/* DESCRIPCION */}

                        <Col xs={12}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Descripción
                                </Form.Label>

                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción del producto"
                                />

                            </Form.Group>

                        </Col>

                    </Row>

                </Form>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleActualizar}
                    disabled={loading}
                >
                    {loading ? "Actualizando..." : "Actualizar"}
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEdicionProducto;