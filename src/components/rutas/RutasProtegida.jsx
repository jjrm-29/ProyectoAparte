import { Navigate } from "react-router-dom";

function RutasProtegida({ children }) {
  const usuario = true;

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RutasProtegida;