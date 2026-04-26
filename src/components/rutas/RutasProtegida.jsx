import { Navigate } from "react-router-dom";
import { useAuth } from "../../views/AuthContext";

const RutasProtegida = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-5">Cargando...</p>;

  return user ? children : <Navigate to="/login" />;
};

export default RutasProtegida;