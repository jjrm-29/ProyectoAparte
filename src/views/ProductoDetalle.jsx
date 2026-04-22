import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const ProductoDetalle = () => {
    const { id } = useParams();        // Obtiene el ID desde la URL
    const navigate = useNavigate();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Aquí ponemos los mismos productos que tienes en Catálogo y Productos
        const productosEjemplo = [
            {
                id: 1,
                nombre: "Café Molido Premium",
                precio: 150,
                categoria: "Bebidas",
                imagen: "https://http2.mlstatic.com/D_NQ_NP_706638-MCO82270894377_022025-O.webp",
                descripcion: "Café 100% arábica tostado nicaragüense"
            },
            {
                id: 2,
                nombre: "Arroz Integral 1LB",
                precio: 35,
                categoria: "Alimentos",
                imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
                descripcion: "Arroz integral de larga duración"
            },
            {
                id: 3,
                nombre: "Aceite de Oliva Extra Virgen",
                precio: 120,
                categoria: "Despensa",
                imagen: "https://tse1.mm.bing.net/th/id/OIP.t4wQKuIzZDUUTERtSad8CAHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3",
                descripcion: "Aceite de oliva importado 500ml"
            },
            {
                id: 4,
                nombre: "Leche en Polvo",
                precio: 90,
                categoria: "Lácteos",
                imagen: "https://tse4.mm.bing.net/th/id/OIP.1VpIWsny8P0GKOOkNOcsCwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
                descripcion: "Leche en polvo fortificada"
            },
            {
                id: 5,
                nombre: "Frijoles Rojos 1LB",
                precio: 45,
                categoria: "Alimentos",
                imagen: "https://tse3.mm.bing.net/th/id/OIP.zU6-X-TSiz-KSO3oqE1auwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
                descripcion: "Frijoles rojos seleccionados"
            },
            {
                id: 6,
                nombre: "Coca Cola Lata",
                precio: 30,
                categoria: "Bebidas",
                imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop",
                descripcion: "Coca Cola Lata"
            },
            {
                id: 7,
                nombre: "Pasta Spaghetti 500g",
                precio: 40,
                categoria: "Despensa",
                imagen: "https://tse4.mm.bing.net/th/id/OIP.Wos-0g0qvUS2FV4bwKfGkQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                descripcion: "Pasta italiana de sémola"
            },
            {
                id: 8,
                nombre: "Jabón de baño",
                precio: 30,
                categoria: "Limpieza",
                imagen: "https://tse1.mm.bing.net/th/id/OIP.dHNpk8eVy0ADxiM-QfyE-QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                descripcion: "Jabón tradicional para ropa"
            },
            {
                id: 9,
                nombre: "Galletas María 400g",
                precio: 25,
                categoria: "Alimentos",
                imagen: "https://tse2.mm.bing.net/th/id/OIP.J5mDvU0Cim_lOm9ZHFsojQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                descripcion: "Galletas clásicas María"
            },
            {
                id: 10,
                nombre: "Detergente Líquido 1L",
                precio: 70,
                categoria: "Limpieza",
                imagen: "https://tse3.mm.bing.net/th/id/OIP.L7HL0QG64ucur-USA-FssgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                descripcion: "Detergente para lavadora"
            }
        ];

        const productoEncontrado = productosEjemplo.find(p => p.id === parseInt(id));

        setTimeout(() => {
            setProducto(productoEncontrado);
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando producto...</p>
            </Container>
        );
    }

    if (!producto) {
        return (
            <Container className="py-5 text-center">
                <h3>Producto no encontrado</h3>
                <Button variant="primary" onClick={() => navigate("/catalogo")}>
                    Volver al Catálogo
                </Button>
            </Container>
        );
    }

    return (
        <Container className="margen-superior-main py-5">
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
                ← Volver
            </Button>

            <Row className="justify-content-center">
                <Col lg={10}>
                    <Card className="shadow border-0">
                        <Row className="g-0">
                            <Col md={5}>
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="img-fluid w-100"
                                    style={{ height: "500px", objectFit: "cover" }}
                                />
                            </Col>
                            <Col md={7}>
                                <Card.Body className="p-5">
                                    <h1 className="fw-bold mb-3">{producto.nombre}</h1>
                                    <h2 className="text-success mb-4">C$ {producto.precio.toLocaleString()}</h2>

                                    <p className="lead text-muted mb-4">{producto.descripcion}</p>

                                    <div className="mb-4">
                                        <strong>Categoría:</strong> {producto.categoria}
                                    </div>

                                    <div className="d-grid gap-3">
                                        <Button variant="primary" size="lg" onClick={() => alert(`✅ ${producto.nombre} agregado al carrito`)}>
                                            Agregar al carrito
                                        </Button>
                                        <Button variant="outline-primary" size="lg" onClick={() => navigate("/catalogo")}>
                                            Seguir comprando
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductoDetalle;