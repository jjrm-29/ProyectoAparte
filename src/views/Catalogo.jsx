import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";   // ← Importante agregar esto
import TarjetaCatalogo from "../../src/components/catalogo/TarjetaCatalogo";

const Catalogo = () => {
    const [searchParams] = useSearchParams();   // ← Para leer ?categoria=...

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

    // ==================== LEER FILTRO DESDE LA URL ====================
    useEffect(() => {
        const categoriaDesdeURL = searchParams.get("categoria");
        
        if (categoriaDesdeURL) {
            setCategoriaFiltro(categoriaDesdeURL);
        }
    }, [searchParams]);

    // ==================== CARGAR PRODUCTOS ====================
    useEffect(() => {
        const productosConImagenes = [
            {
                id: 1,
                nombre: "Café Molido Premium",
                precio: 150,
                categoria: "Bebidas",           // ← Corregí aquí (estaba en Despensa)
                imagen: "https://http2.mlstatic.com/D_NQ_NP_706638-MCO82270894377_022025-O.webp",
                descripcion: "Café 100% arábica tostado nicaragüense"
            },
            {
                id: 2,
                nombre: "Arroz Integral 1LB",
                precio: 27,
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
                precio: 20,
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
                precio: 30,
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

        setTimeout(() => {
            setProductos(productosConImagenes);
            setLoading(false);
        }, 800);
    }, []);

    // ==================== FILTRADO ====================
    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda =
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());

        const coincideCategoria = categoriaFiltro === "Todas" ||
            producto.categoria === categoriaFiltro;

        return coincideBusqueda && coincideCategoria;
    });

    return (
        <Container className="margen-superior-main py-4">
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold">
                    {categoriaFiltro !== "Todas" 
                        ? `Categoría: ${categoriaFiltro}` 
                        : "Nuestro Catálogo"}
                </h1>
                <p className="lead text-muted">
                    {categoriaFiltro !== "Todas" 
                        ? `Mostrando productos de ${categoriaFiltro}` 
                        : "Encuentra todo lo que necesitas en la pulpería"}
                </p>
            </div>

            {/* Buscador y Filtro */}
            <Row className="mb-4 g-3 justify-content-center">
                <Col md={7}>
                    <Form.Control
                        type="text"
                        placeholder="¿Qué estás buscando?"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        size="lg"
                    />
                </Col>
                <Col md={3}>
                    <Form.Select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        size="lg"
                    >
                        <option value="Todas">Todas las categorías</option>
                        <option value="Alimentos">Alimentos</option>
                        <option value="Despensa">Despensa</option>
                        <option value="Lácteos">Lácteos</option>
                        <option value="Limpieza">Limpieza</option>
                        <option value="Bebidas">Bebidas</option>
                    </Form.Select>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="lg" />
                    <p className="mt-3 text-muted">Cargando productos...</p>
                </div>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto) => (
                            <Col key={producto.id}>
                                <TarjetaCatalogo producto={producto} />
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <div className="text-center py-5">
                                <h4>No encontramos productos</h4>
                                <p className="text-muted">
                                    {categoriaFiltro !== "Todas" 
                                        ? `No hay productos en la categoría "${categoriaFiltro}"` 
                                        : "Intenta con otra búsqueda o filtro"}
                                </p>
                            </div>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default Catalogo;