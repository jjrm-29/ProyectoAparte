import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Badge
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroVenta from "../components/Venta/ModalRegistroVenta";
import ModalEditarVenta from "../components/Venta/ModalEditarVenta";
import ModalEliminarVenta from "../components/Venta/ModalEliminarVenta";
import TablaVenta from "../components/Venta/TablaVenta";

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

    <Container fluid="lg" className="px-0">

      <div className="page-hero animate-fade-left mb-4">

        <Row className="align-items-center">

          <Col lg={8}>

            <Badge
              bg="light"
              text="dark"
              className="rounded-pill px-3 py-2 fw-semibold mb-3"
            >
              PANEL ADMINISTRATIVO
            </Badge>

            <h1 className="fw-bold display-5">
              Gestión de Ventas
            </h1>

            <p className="fs-5">
              Administra todas las ventas de manera rápida y moderna
            </p>

          </Col>

          <Col lg={4} className="text-lg-end mt-4 mt-lg-0">

            <Button
              type="button"
              size="lg"
              onClick={() => setShowRegistro(true)}
              className="btn-hero-cta rounded-pill px-4 btn-interactive"
            >
              ➕ Registrar Venta
            </Button>

          </Col>

        </Row>

      </div>

      {/* TABLA */}

      <TablaVenta
        abrirEditar={abrirEditar}
        abrirEliminar={abrirEliminar}
      />

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