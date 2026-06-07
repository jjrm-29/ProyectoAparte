import { Navigate } from "react-router-dom";
import { useAuth } from "../../views/AuthContext";

const RutasProtegida = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-5 fade-in">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
        <p className="mt-3 text-muted loading-pulse">Verificando sesión…</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default RutasProtegida;