import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";
import SplashCarga from "./components/navegacion/SplashCarga";

import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";       
import Catalogo from "./views/Catalogo";
import Productos from "./views/Productos";
import Login from "./views/Login";
import RutasProtegida from "./components/rutas/RutasProtegida";
import Pagina404 from "./views/Pagina404";
import ProductoDetalle from "./views/ProductoDetalle";   
import DashboardVentas from "./views/DashboardVentas";
import Ventas from "./views/Ventas";


import "./App.css";

const AppRoutes = () => {
  const location = useLocation();
  const esLogin = location.pathname === "/login";

  return (
    <>
      <SplashCarga />
      <Encabezado />

      <main className={esLogin ? "" : "margen-superior-main"}>
        <div key={location.pathname} className="page-enter">
          <Routes location={location}>

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<RutasProtegida><Inicio /></RutasProtegida>} />
            <Route path="/categorias" element={<RutasProtegida><Categorias /></RutasProtegida>} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/productos" element={<RutasProtegida><Productos /></RutasProtegida>} />
            <Route path="/dashboard" element={<DashboardVentas />} />
            <Route path="/ventas" element={<Ventas />} />

            <Route
              path="/producto/:id"
              element={<RutasProtegida><ProductoDetalle /></RutasProtegida>}
            />

            <Route path="*" element={<Pagina404 />} />

          </Routes>
        </div>
      </main>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;