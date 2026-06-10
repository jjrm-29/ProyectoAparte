import { useState } from "react";
import {
  Container,
  Button,
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroVenta from "../components/Venta/ModalRegistroVenta";
import ModalEditarVenta from "../components/Venta/ModalEditarVenta";
import ModalEliminarVenta from "../components/Venta/ModalEliminarVenta";
import TablaVenta from "../components/Venta/TablaVenta";
import PageHero from "../components/navegacion/PageHero";

const Ventas = () => {

  const [showRegistro, setShowRegistro] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);

  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  // =====================================
  // RECARGAR TABLA
  // =====================================

  const cargarVentas = () => {
    window.location.reload();
  };

  // =====================================
  // ABRIR MODAL EDITAR
  // =====================================

  const abrirEditar = (venta) => {

    setVentaSeleccionada(venta);
    setShowEditar(true);

  };

  // =====================================
  // ABRIR MODAL ELIMINAR
  // =====================================

  const abrirEliminar = (venta) => {

    setVentaSeleccionada(venta);
    setShowEliminar(true);

  };

  // =====================================
  // ELIMINAR
  // =====================================

  const eliminarVenta = async () => {

    try {

      if (!ventaSeleccionada) return;

      await supabase
        .from("detalle_venta")
        .delete()
        .eq("id_detalle", ventaSeleccionada.id_detalle);

      setShowEliminar(false);

      cargarVentas();

    } catch (error) {

      console.error("Error al eliminar:", error);

    }
  };

  return (

    <Container fluid="lg" className="px-0 view-page">

      <PageHero
        kicker="Panel administrativo"
        title="Gestión de Ventas"
        subtitle="Administra todas las ventas de manera rápida y moderna."
        action={
          <Button
            type="button"
            size="lg"
            onClick={() => setShowRegistro(true)}
            className="btn-hero-cta rounded-pill px-4 btn-interactive"
          >
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Registrar venta
          </Button>
        }
      />

      <div className="animate-fade-right">

      <TablaVenta
        abrirEditar={abrirEditar}
        abrirEliminar={abrirEliminar}
      />
      </div>

      {/* MODAL REGISTRO */}

      <ModalRegistroVenta
        show={showRegistro}
        handleClose={() => setShowRegistro(false)}
        cargarVentas={cargarVentas}
      />

      {/* MODAL EDITAR */}

      <ModalEditarVenta
        show={showEditar}
        onHide={() => setShowEditar(false)}
        venta={ventaSeleccionada}
        onSuccess={cargarVentas}
      />

      {/* MODAL ELIMINAR */}

      <ModalEliminarVenta
        show={showEliminar}
        onHide={() => setShowEliminar(false)}
        onConfirmar={eliminarVenta}
        venta={ventaSeleccionada}
      />

    </Container>
  );
};

export default Ventas;