import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TarjetaCategoria from "../../src/components/categorias/TarjetaCategoria";
import ModalRegistroCategoria from "../../src/components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../../src/components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../../src/components/categorias/ModalEliminacionCategoria";

const Categorias = () => {
    const navigate = useNavigate();

    const [categorias, setCategorias] = useState([
        {
            id: 1,
            nombre: "Bebidas",
            descripcion: "Refrescos y gaseosas",
            imagen: "https://tse3.mm.bing.net/th/id/OIP.4ICLLZXctA3uDUaFpFT5xwHaDw?rs=1&pid=ImgDetMain&o=7&rm=3",
            color: "#6c5ce7",
            count: "8 productos"
        },
        {
            id: 2,
            nombre: "Alimentos",
            descripcion: "Arroz, frijoles, galletas y básicos",
            imagen: "https://guerirlagoutte.com/wp-content/uploads/2023/03/different-vegetables-seeds-fruits-table-flat-lay-top-view_600x600.jpg?v=1675933695",
            color: "#8B6F47",
            count: "15 productos"
        },
        {
            id: 3,
            nombre: "Despensa",
            descripcion: "Aceite, pasta y conservas",
            imagen: "https://tse2.mm.bing.net/th/id/OIP.JQObc1ZdS0cN3qmQpAbmjwHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3",
            color: "#2697cc",
            count: "12 productos"
        },
        {
            id: 4,
            nombre: "Lácteos",
            descripcion: "Leche en polvo y derivados",
            imagen: "https://th.bing.com/th?id=OIF.GZUGLA64BNE7%2bqZ%2fNlTQkg&rs=1&pid=ImgDetMain&o=7&rm=3",
            color: "#c44569",
            count: "6 productos"
        },
        {
            id: 5,
            nombre: "Limpieza",
            descripcion: "Detergentes, jabones y productos de limpieza",
            imagen: "https://3.bp.blogspot.com/-T0CFVvujgPc/VxVRwaY0uWI/AAAAAAAAAIg/XN3Vpt5tAsczpS9N1b5SFdpqJ6eZQ4JFQCLcB/s1600/utensilios.jpg",
            color: "#121b96",
            count: "9 productos"
        }
    ]);

    // Estados para modales
    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [categoriaEditar, setCategoriaEditar] = useState(null);
    const [categoriaEliminar, setCategoriaEliminar] = useState(null);
    const [loading, setLoading] = useState(false);

    // ==================== FUNCIONES ====================

    const handleVerProductos = (categoriaNombre) => {
        navigate(`/catalogo?categoria=${categoriaNombre}`);
    };

    const handleNuevaCategoria = () => {
        setShowRegistroModal(true);
    };

    const handleEditar = (categoria) => {
        setCategoriaEditar(categoria);
        setShowEditModal(true);
    };

    const handleEliminar = (categoria) => {
        setCategoriaEliminar(categoria);
        setShowDeleteModal(true);
    };

    const handleGuardarNueva = (datos) => {
        setLoading(true);
        setTimeout(() => {
            const nuevaCategoria = {
                id: Date.now(),
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                color: datos.color || "#8B6F47",
                imagen: datos.imagen || `https://via.placeholder.com/600x400/8B6F47/ffffff?text=${encodeURIComponent(datos.nombre)}`,
                count: "0 productos"
            };

            setCategorias(prev => [...prev, nuevaCategoria]);
            alert("✅ Nueva categoría creada correctamente");
            setShowRegistroModal(false);
            setLoading(false);
        }, 700);
    };

    const handleGuardarEdicion = (datos) => {
        setLoading(true);
        setTimeout(() => {
            setCategorias(prev =>
                prev.map(cat =>
                    cat.id === categoriaEditar.id
                        ? {
                            ...cat,
                            nombre: datos.nombre,
                            descripcion: datos.descripcion,
                            color: datos.color,
                            imagen: datos.imagen || cat.imagen
                        }
                        : cat
                )
            );
            alert("✅ Categoría actualizada correctamente");
            setShowEditModal(false);
            setCategoriaEditar(null);
            setLoading(false);
        }, 700);
    };

    const handleConfirmarEliminacion = () => {
        setLoading(true);
        setTimeout(() => {
            setCategorias(prev => prev.filter(cat => cat.id !== categoriaEliminar.id));
            alert("✅ Categoría eliminada correctamente");
            setShowDeleteModal(false);
            setCategoriaEliminar(null);
            setLoading(false);
        }, 600);
    };

    return (
        <Container className="margen-superior-main py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="display-5 fw-bold mb-2">Categorías</h1>
                    <p className="lead text-muted mb-0">Gestiona las categorías de productos</p>
                </div>
                <Button variant="primary" size="lg" onClick={handleNuevaCategoria}>
                    + Nueva Categoría
                </Button>
            </div>

            {/* Grid de Tarjetas */}
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {categorias.map((categoria) => (
                    <Col key={categoria.id}>
                        <TarjetaCategoria
                            categoria={categoria}
                            onVerProductos={handleVerProductos}
                            onEditar={handleEditar}
                            onEliminar={handleEliminar}
                        />
                    </Col>
                ))}
            </Row>

            {/* ==================== MODALES ==================== */}
            <ModalRegistroCategoria
                show={showRegistroModal}
                onHide={() => setShowRegistroModal(false)}
                onGuardar={handleGuardarNueva}
                loading={loading}
            />

            <ModalEdicionCategoria
                show={showEditModal}
                onHide={() => {
                    setShowEditModal(false);
                    setCategoriaEditar(null);
                }}
                categoria={categoriaEditar}
                onGuardar={handleGuardarEdicion}
                loading={loading}
            />

            <ModalEliminacionCategoria
                show={showDeleteModal}
                onHide={() => {
                    setShowDeleteModal(false);
                    setCategoriaEliminar(null);
                }}
                categoria={categoriaEliminar}
                onConfirmar={handleConfirmarEliminacion}
                loading={loading}
            />
        </Container>
    );
};

export default Categorias;