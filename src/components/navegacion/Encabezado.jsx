import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas, Badge } from "react-bootstrap";

import logo from "../../assets/logo_tpo.webp";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const esLogin = location.pathname === "/login";
    const usuario = localStorage.getItem("usuario-supabase");

    const esActivo = (ruta) => location.pathname === ruta;

    const manejarNavegacion = (ruta) => {
        navigate(ruta);
        setShowOffcanvas(false);
    };

    const cerrarSesion = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem("usuario-supabase");
            navigate("/login");
        } catch (err) {
            console.error("Error al cerrar sesión:", err.message);
        }
    };

    return (
        <Navbar expand="md" fixed="top" className="navbar-pro shadow" variant="dark">
            <Container>

                {/* Logo */}
                <Navbar.Brand
                    onClick={() => manejarNavegacion("/")}
                    className="d-flex align-items-center gap-2"
                    style={{ cursor: "pointer" }}
                >
                    <img src={logo} width="42" height="42" alt="logo" />
                    <span className="fw-bold fs-5">Pulpería</span>
                </Navbar.Brand>

                {/* Toggle Móvil */}
                {!esLogin && (
                    <Navbar.Toggle onClick={() => setShowOffcanvas(true)} />
                )}

                {/* Offcanvas - Menú Móvil */}
                <Navbar.Offcanvas
                    placement="end"
                    show={showOffcanvas}
                    onHide={() => setShowOffcanvas(false)}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Menú</Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        {!esLogin && (
                            <Nav className="ms-auto align-items-md-center gap-md-3">

                                <Nav.Link
                                    onClick={() => manejarNavegacion("/")}
                                    className={esActivo("/") ? "active-link" : ""}
                                >
                                    Inicio
                                </Nav.Link>

                                <Nav.Link
                                    onClick={() => manejarNavegacion("/categorias")}
                                    className={esActivo("/categorias") ? "active-link" : ""}
                                >
                                    Categorías
                                </Nav.Link>

                                <Nav.Link
                                    onClick={() => manejarNavegacion("/productos")}
                                    className={esActivo("/productos") ? "active-link" : ""}
                                >
                                    Productos
                                </Nav.Link>

                                <Nav.Link
                                    onClick={() => manejarNavegacion("/catalogo")}
                                    className={esActivo("/catalogo") ? "active-link" : ""}
                                >
                                    Catálogo
                                </Nav.Link>

                                <Nav.Link
                                    onClick={() => manejarNavegacion("/ventas")}
                                    className={esActivo("/ventas") ? "active-link" : ""}
                                >
                                    🧾 Ventas
                                </Nav.Link>

                                <Nav.Link
                                    onClick={() => manejarNavegacion("/dashboard")}
                                    className={esActivo("/dashboard") ? "active-link" : ""}
                                >
                                    📊 Dashboard
                                </Nav.Link>

                                {/* Usuario y Acciones */}
                                {usuario && (
                                    <div className="d-flex align-items-center gap-2 ms-md-3 mt-3 mt-md-0">
                                        <Badge bg="light" text="dark" className="px-3 py-2">
                                            {usuario}
                                        </Badge>

                                        <Nav.Link
                                            onClick={cerrarSesion}
                                            className="text-danger fw-semibold"
                                        >
                                            Salir
                                        </Nav.Link>
                                    </div>
                                )}
                            </Nav>
                        )}
                    </Offcanvas.Body>
                </Navbar.Offcanvas>

            </Container>

            {/* Estilos internos */}
            <style>
                {`
                .navbar-pro {
                    background: linear-gradient(90deg, #1e3c72, #2a5298);
                    backdrop-filter: blur(10px);
                }

                .active-link {
                    font-weight: bold;
                    border-bottom: 2px solid #fff;
                }

                .navbar-pro .nav-link {
                    color: rgba(255,255,255,0.85);
                    transition: all 0.3s ease;
                }

                .navbar-pro .nav-link:hover {
                    color: #fff;
                    transform: translateY(-1px);
                }
                `}
            </style>
        </Navbar>
    );
};

export default Encabezado;