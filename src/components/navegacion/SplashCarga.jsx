import { useEffect, useState } from "react";

const SplashCarga = () => {
  const [visible, setVisible] = useState(true);
  const [montado, setMontado] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    const remove = setTimeout(() => setMontado(false), 2400);
    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, []);

  if (!montado) return null;

  return (
    <div className={`app-splash${visible ? "" : " splash-out"}`} aria-hidden="true">
      <div className="splash-ripple splash-ripple-1" />
      <div className="splash-ripple splash-ripple-2" />
      <div className="splash-ripple splash-ripple-3" />

      <div className="splash-logo-wrap">
        <div className="splash-logo">
          <i className="bi bi-shop" />
        </div>
      </div>

      <p className="splash-title mb-0">
        <span className="splash-title-shimmer">Pulpería Chevez</span>
      </p>
      <p className="splash-subtitle">Cargando experiencia…</p>
      <div className="splash-bar" />
    </div>
  );
};

export default SplashCarga;
