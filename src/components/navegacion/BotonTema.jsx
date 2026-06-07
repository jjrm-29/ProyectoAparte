import { useTema } from "../../context/ThemeContext";

const BotonTema = ({ className = "" }) => {
  const { esOscuro, alternarTema } = useTema();

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={alternarTema}
      aria-label={esOscuro ? "Activar modo claro" : "Activar modo oscuro"}
      title={esOscuro ? "Modo claro" : "Modo oscuro"}
    >
      <span className="theme-toggle-track">
        <span className={`theme-toggle-thumb ${esOscuro ? "is-dark" : ""}`}>
          <i
            className={`bi ${esOscuro ? "bi-moon-stars-fill" : "bi-sun-fill"}`}
            aria-hidden="true"
          />
        </span>
      </span>
      <span className="theme-toggle-label">
        {esOscuro ? "Oscuro" : "Claro"}
      </span>
    </button>
  );
};

export default BotonTema;
