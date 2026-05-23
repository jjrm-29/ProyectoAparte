import {
  Modal,
  Button,
  Card,
  Badge
} from "react-bootstrap";

const ModalEliminarVenta = ({
  show,
  onHide,
  onConfirmar,
  venta
}) => {

  if (!venta) return null;

  return (

    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
    >

      <Modal.Body className="p-0 rounded-5 overflow-hidden border-0">

        {/* HEADER */}

        <div
          className="text-center text-white py-5 px-4 position-relative"
          style={{
            background:
              "linear-gradient(135deg,#991b1b,#dc2626,#ef4444)"
          }}
        >

          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center shadow-lg"
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "30px",
              background: "rgba(255,255,255,.15)",
              backdropFilter: "blur(10px)",
              fontSize: "3.5rem"
            }}
          >
            ⚠️
          </div>

          <Badge
            bg="light"
            text="danger"
            className="px-3 py-2 rounded-pill fw-bold mb-3"
          >
            ACCIÓN IMPORTANTE
          </Badge>

          <h2 className="fw-bold mb-2">
            Eliminar Venta
          </h2>

          <p className="opacity-75 mb-0 fs-5">
            La venta será eliminada del sistema
          </p>

        </div>

        {/* CONTENIDO */}

        <div className="bg-white p-4">

          <Card className="border-0 shadow-sm rounded-5 mb-4">

            <Card.Body className="text-center p-4">

              <div
                className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "24px",
                  background: "#fee2e2",
                  fontSize: "2.8rem"
                }}
              >
                🧾
              </div>

              <small className="text-muted fw-bold d-block mb-2">
                IDENTIFICADOR
              </small>

              <h1 className="fw-bold text-danger mb-3">
                #{venta.id_venta}
              </h1>

              <div
                className="rounded-4 p-3"
                style={{
                  background: "#f8fafc"
                }}
              >

                <p className="fw-semibold text-dark mb-2">
                  Esta acción no podrá deshacerse
                </p>

                <small className="text-muted">
                  Todos los datos relacionados con esta venta serán eliminados.
                </small>

              </div>

            </Card.Body>

          </Card>

          {/* BOTONES */}

          <div className="d-flex gap-3">

            <Button
              variant="light"
              onClick={onHide}
              className="w-50 rounded-4 py-3 fw-semibold border shadow-sm"
            >
              Cancelar
            </Button>

            <Button
              onClick={onConfirmar}
              className="w-50 rounded-4 py-3 fw-bold border-0 shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg,#dc2626,#ef4444)"
              }}
            >
              🗑️ Eliminar
            </Button>

          </div>

        </div>

      </Modal.Body>

    </Modal>

  );
};

export default ModalEliminarVenta;