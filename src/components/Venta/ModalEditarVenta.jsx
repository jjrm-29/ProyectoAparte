import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEditarVenta = ({ show, onHide, venta, onSuccess }) => {

  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(venta || {});
  }, [venta]);

  const handleCantidad = (e) => {
    const cantidad = parseInt(e.target.value) || 1;

    setForm({
      ...form,
      cantidad,
      total: cantidad * (venta.total / venta.cantidad)
    });
  };

  const actualizar = async () => {
    await supabase
      .from("Hecho_Ventas")
      .update({
        cantidad: form.cantidad,
        total: form.total
      })
      .eq("id_venta", venta.id_venta);

    onHide();
    onSuccess();
  };

  if (!venta) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Control
            type="number"
            value={form.cantidad || ""}
            onChange={handleCantidad}
          />
          <Form.Control
            value={`C$ ${form.total}`}
            disabled
            className="mt-2"
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={actualizar}>Actualizar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditarVenta;