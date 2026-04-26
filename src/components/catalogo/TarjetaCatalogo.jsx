// src/components/TarjetaCatalogo.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TarjetaCatalogo = ({ producto, onEditar, onEliminar }) => {
    const navigate = useNavigate();

    const agregarAlCarrito = () => {
        alert(`✅ ${producto.nombre} agregado al carrito`);
    };

    const verDetalle = () => {
        navigate(`/producto/${producto.id}`);
    };

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/600x600/8B6F47/ffffff?text=Sin+Imagen";
    };

    return (
        <Card className="h-100 shadow-sm border-0 product-card overflow-hidden">
            <Card.Img 
                variant="top" 
                src={producto.imagen}
                className="img-fluid"
                style={{ 
                    height: "260px", 
                    objectFit: "cover" 
                }}
                alt={producto.nombre}
                onError={handleImageError}
            />
            
            <Card.Body className="d-flex flex-column p-4">
                <Card.Title className="fw-bold mb-2 fs-5">
                    {producto.nombre}
                </Card.Title>
                
                <Card.Text className="text-muted small flex-grow-1">
                    {producto.descripcion}
                </Card.Text>

                <div className="mt-auto pt-3">
                    <h4 className="text-success fw-bold mb-3">
                        C$ {producto.precio.toLocaleString()}
                    </h4>
                    
                    <div className="d-grid gap-2">
                        <Button 
                            variant="primary"
                            onClick={agregarAlCarrito}
                        >
                            Agregar al carrito
                        </Button>

                        <Button 
                            variant="outline-secondary"
                            onClick={verDetalle}
                        >
                            Ver detalles
                        </Button>

                        <Button 
                            variant="outline-warning"
                            size="sm"
                            onClick={() => onEditar && onEditar(producto)}
                        >
                            ✏️ Editar
                        </Button>

                        <Button 
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onEliminar && onEliminar(producto)}
                        >
                            🗑️ Eliminar
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TarjetaCatalogo;