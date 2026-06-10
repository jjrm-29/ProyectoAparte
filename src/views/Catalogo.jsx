import { useState, useEffect } from "react";
import {
  Container,
  Form,
  Spinner,
  Card,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";

import { useSearchParams } from "react-router-dom";

import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import PageHero from "../components/navegacion/PageHero";

const Catalogo = () => {
  const [searchParams] = useSearchParams();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  useEffect(() => {
    const categoriaDesdeURL = searchParams.get("categoria");
    if (categoriaDesdeURL) {
      setCategoriaFiltro(categoriaDesdeURL);
    }
  }, [searchParams]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);

      const { data: productosData, error: productosError } = await supabase
        .from("productos")
        .select("*")
        .order("id_producto", { ascending: false });

      if (productosError) throw productosError;

      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("*")
        .order("nombre", { ascending: true });

      if (categoriasError) throw categoriasError;

      setProductos(productosData || []);
      setCategorias(categoriasData || []);
    } catch (error) {
      console.error("Error al cargar catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaFiltro === "Todas" || producto.categoria === categoriaFiltro;

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <Container fluid="lg" className="px-0 view-page">
      <PageHero
        kicker="Catálogo digital"
        title={
          categoriaFiltro !== "Todas"
            ? `Categoría: ${categoriaFiltro}`
            : "Explora nuestro catálogo"
        }
        subtitle="Productos organizados por categorías con precios y disponibilidad actualizada."
        aside={
          <i
            className="bi bi-basket3 view-hero-aside-icon"
            aria-hidden="true"
          />
        }
      />

      <Card className="view-filter-card animate-fade-right mb-4">
        <Card.Body className="p-4">
          <Row className="g-3 align-items-center">
            <Col lg={8}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search" aria-hidden="true" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar productos…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col lg={4}>
              <Form.Select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="Todas">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4 stagger-children view-stats-row">
        <Col md={4}>
          <Card className="view-stat-card h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1 small fw-semibold text-uppercase">
                  Productos
                </p>
                <h3 className="fw-bold mb-0">{productos.length}</h3>
              </div>
              <div className="catalog-stat-icon">
                <i className="bi bi-box-seam" aria-hidden="true" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="view-stat-card h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1 small fw-semibold text-uppercase">
                  Categorías
                </p>
                <h3 className="fw-bold mb-0">{categorias.length}</h3>
              </div>
              <div className="catalog-stat-icon">
                <i className="bi bi-tags" aria-hidden="true" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="view-stat-card h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1 small fw-semibold text-uppercase">
                  Resultados
                </p>
                <h3 className="fw-bold mb-0">{productosFiltrados.length}</h3>
              </div>
              <div className="catalog-stat-icon">
                <i className="bi bi-funnel" aria-hidden="true" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5 fade-in">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted loading-pulse">Cargando productos…</p>
        </div>
      ) : productosFiltrados.length > 0 ? (
        <Row
          xs={1}
          sm={2}
          md={2}
          lg={3}
          xl={4}
          className="g-4 catalog-grid"
        >
          {productosFiltrados.map((producto) => (
            <Col key={producto.id_producto}>
              <TarjetaCatalogo producto={producto} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="animate-scale-in">
          <Card.Body className="text-center py-5">
            <i
              className="bi bi-search text-muted"
              style={{ fontSize: "3.5rem" }}
              aria-hidden="true"
            />
            <h3 className="fw-bold mt-3">No encontramos productos</h3>
            <p className="text-muted mb-0">
              {categoriaFiltro !== "Todas"
                ? `No existen productos en la categoría "${categoriaFiltro}"`
                : "Intenta con otra búsqueda o filtro"}
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Catalogo;
