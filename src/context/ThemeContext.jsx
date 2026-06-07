import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const CLAVE_TEMA = "pulperia-tema";

const obtenerTemaInicial = () => {
  const guardado = localStorage.getItem(CLAVE_TEMA);
  if (guardado === "light" || guardado === "dark") return guardado;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeProvider = ({ children }) => {
  const [tema, setTema] = useState(obtenerTemaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(CLAVE_TEMA, tema);
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === "light" ? "dark" : "light"));
  };

  const esOscuro = tema === "dark";

  return (
    <ThemeContext.Provider value={{ tema, esOscuro, alternarTema, setTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook compartido con ThemeProvider
export const useTema = () => useContext(ThemeContext);
