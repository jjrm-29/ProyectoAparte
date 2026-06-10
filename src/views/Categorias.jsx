import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Card
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";

import NotificacionOperacion from "../components/NotificacionOperacion";

import TablaCategorias from "../components/categorias/TablaCategoria";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import PageHero from "../components/navegacion/PageHero";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Categorias = () => {

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [categoriaEditar, setCategoriaEditar] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    imagen: ""
  });

  // ============================
  // PDF
  // ============================

  const generarPDFCategoria = (categoria) => {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Categoría", 14, 20);

    doc.line(14, 25, 195, 25);

    autoTable(doc, {
      startY: 35,
      head: [["Campo", "Valor"]],
      body: [
        ["ID", categoria.id],
        ["Nombre", categoria.nombre],
        ["Descripción", categoria.descripcion],
      ],
    });

    doc.save(`categoria_${categoria.id}.pdf`);
  };

  // ============================
  // CARGAR CATEGORIAS
  // ============================

  const cargarCategorias = async () => {

    try {

      setCargando(true);

      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      setCategorias(data || []);
      setCategoriasFiltradas(data || []);

    } catch (err) {

      console.error(err);

      setToast({
        mostrar: true,
        mensaje: "Error al cargar categorías",
        tipo: "error",
      });

    } finally {

      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // ============================
  // BUSQUEDA
  // ============================

  useEffect(() => {

    if (!textoBusqueda.trim()) {

      setCategoriasFiltradas(categorias);

    } else {

      const textoLower = textoBusqueda.toLowerCase();

      const filtradas = categorias.filter((cat) =>
        cat.nombre?.toLowerCase().includes(textoLower) ||
        cat.descripcion?.toLowerCase().includes(textoLower)
      );

      setCategoriasFiltradas(filtradas);
    }

  }, [textoBusqueda, categorias]);

  // ============================
  // PAGINACION
  // ============================

  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // ============================
  // MODALES
  // ============================

  const abrirModalEdicion = (categoria) => {

    setCategoriaEditar(categoria);

    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {

    setCategoriaAEliminar(categoria);

    setMostrarModalEliminacion(true);
  };

  // ============================
  // ELIMINAR
  // ============================

  const eliminarCategoria = async () => {

    if (!categoriaAEliminar) return;

    try {

      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", categoriaAEliminar.id);

      if (error) throw error;

      await cargarCategorias();

      setToast({
        mostrar: true,
        mensaje: "Categoría eliminada correctamente",
        tipo: "exito",
      });

      setMostrarModalEliminacion(false);

    } catch (err) {

      console.error(err);

      setToast({
        mostrar: true,
        mensaje: "Error al eliminar categoría",
        tipo: "error",
      });
    }
  };

  return (

    <Container fluid="lg" className="px-0 view-page">

      <PageHero
        kicker="Organización"
        title="Gestión de Categorías"
        subtitle="Administra todas las categorías registradas en tu catálogo."
        action={
          <Button
            variant="light"
            size="lg"
            className="btn-hero-cta rounded-pill px-4 btn-interactive"
            onClick={() => setMostrarModal(true)}
          >
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Nueva categoría
          </Button>
        }
      />

      <Card className="view-filter-card animate-scale-in mb-4">

        <Card.Body>

          <Row>

            <Col md={6}>

              <CuadroBusquedas
                categorias={categorias}
                onBuscar={(texto) => setTextoBusqueda(texto)}
              />

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {cargando ? (

        <div className="text-center py-5">

          <Spinner animation="border" variant="primary" />

          <p className="mt-3 text-muted">
            Cargando categorías...
          </p>

        </div>

      ) : (

        <>

          {textoBusqueda.trim() &&
            categoriasFiltradas.length === 0 && (

              <Alert variant="info" className="text-center rounded-4">

                No se encontraron categorías para:
                <strong> {textoBusqueda}</strong>

              </Alert>

            )}

          <div className="d-block d-lg-none">

            <TarjetaCategoria
              categorias={categoriasPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />

          </div>

          <div className="d-none d-lg-block">

            <TablaCategorias
              categorias={categoriasPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              generarPDFCategoria={generarPDFCategoria}
              abrirModalEliminacion={abrirModalEliminacion}
            />

          </div>

          {categoriasFiltradas.length > 0 && (

            <div className="mt-4">

              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={categoriasFiltradas.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />

            </div>

          )}

        </>

      )}

      {/* MODAL REGISTRO */}

      <ModalRegistroCategoria
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        loading={cargando}
        onGuardar={async (datos) => {

          try {

            const { error } = await supabase
              .from("categorias")
              .insert([
                {
                  nombre: datos.nombre,
                  descripcion: datos.descripcion,
                  imagen: datos.imagen
                }
              ]);

            if (error) throw error;

            await cargarCategorias();

            setToast({
              mostrar: true,
              mensaje: "Categoría registrada correctamente",
              tipo: "exito",
            });

            setMostrarModal(false);

          } catch (err) {

            console.error(err);

            setToast({
              mostrar: true,
              mensaje: "Error al registrar categoría",
              tipo: "error",
            });
          }
        }}
      />

      {/* MODAL EDITAR */}

      <ModalEdicionCategoria
        key={categoriaEditar?.id ?? "edicion"}
        show={mostrarModalEdicion}
        onHide={() => setMostrarModalEdicion(false)}
        categoria={categoriaEditar}
        onGuardar={async (datosActualizados) => {

          try {

            const { error } = await supabase
              .from("categorias")
              .update({
                nombre: datosActualizados.nombre,
                descripcion: datosActualizados.descripcion,
                imagen: datosActualizados.imagen
              })
              .eq("id", categoriaEditar.id);

            if (error) throw error;

            await cargarCategorias();

            setToast({
              mostrar: true,
              mensaje: "Categoría actualizada correctamente",
              tipo: "exito",
            });

            setMostrarModalEdicion(false);

          } catch (err) {

            console.error(err);

            setToast({
              mostrar: true,
              mensaje: "Error al actualizar categoría",
              tipo: "error",
            });
          }
        }}
      />

      {/* MODAL ELIMINAR */}

      <ModalEliminacionCategoria
        show={mostrarModalEliminacion}
        onHide={() => setMostrarModalEliminacion(false)}
        categoria={categoriaAEliminar}
        onConfirmar={eliminarCategoria}
        loading={cargando}
      />

      <NotificacionOperacion
        {...toast}
        onCerrar={() =>
          setToast({
            ...toast,
            mostrar: false,
          })
        }
      />

    </Container>
  );
};

export default Categorias;