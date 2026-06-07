import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

import logo from "../../assets/logo_tpo.webp";
import { supabase } from "../../database/supabaseconfig";
import BotonTema from "./BotonTema";

const RUTAS = [
  { ruta: "/", etiqueta: "Inicio" },
  { ruta: "/categorias", etiqueta: "Categorías" },
  { ruta: "/productos", etiqueta: "Productos" },
  { ruta: "/catalogo", etiqueta: "Catálogo" },
  { ruta: "/ventas", etiqueta: "Ventas" },
  { ruta: "/dashboard", etiqueta: "Resumen" },
];

const Encabezado = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const esLogin = location.pathname === "/login";
  const usuario = localStorage.getItem("usuario-supabase");

  const esActivo = (ruta) => location.pathname === ruta;

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
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

  if (esLogin) {
    return null;
  }

  const enlacesNav = (
    <>
      {RUTAS.map(({ ruta, etiqueta }) => (
        <Nav.Link
          key={ruta}
          onClick={() => manejarNavegacion(ruta)}
          className={esActivo(ruta) ? "active-link" : ""}
        >
          {etiqueta}
        </Nav.Link>
      ))}

      <div className="d-flex align-items-center ms-md-2 mt-3 mt-md-0">
        <BotonTema />
      </div>

      {usuario && (
        <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 ms-md-2 mt-3 mt-md-0 pt-3 pt-md-0 border-top border-md-0">
          <span className="user-pill badge px-3 py-2">{usuario}</span>
          <Nav.Link onClick={cerrarSesion} className="nav-logout">
            Cerrar sesión
          </Nav.Link>
        </div>
      )}
    </>
  );

  return (
    <Navbar expand="md" fixed="top" className="site-navbar animate-slide-down" variant="light">
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion("/")}
          className="d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
        >
          <img src={logo} width="36" height="36" alt="Pulpería Chevez" />
          Pulpería Chevez
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Offcanvas
          id="menu-principal"
          placement="end"
          aria-labelledby="menu-principal"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="fw-semibold">Menú</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="ms-auto align-items-md-center gap-md-1">
              {enlacesNav}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
