import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Pagina404() {
  const navigate = useNavigate();

  return (
    <div className="error-page bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 overflow-hidden text-center">
              {/* Header decorativo */}
              <div className="bg-danger text-white py-5">
                <div className="display-1 fw-bold mb-2">404</div>
                <h2 className="mb-0">¡Página no encontrada!</h2>
              </div>

              <Card.Body className="p-5">
                <div className="mb-4">
                  <span className="display-1">🛒</span>
                </div>

                <p className="lead text-muted mb-4">
                  Lo sentimos, la página que estás buscando no existe
                  o ha sido movida.
                </p>

                <div className="d-grid gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/")}
                    className="py-3 fw-semibold"
                  >
                    ← Volver al Inicio
                  </Button>

                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate(-1)}
                    className="py-3"
                  >
                    ← Ir a la página anterior
                  </Button>
                </div>
              </Card.Body>

              <Card.Footer className="text-muted py-3">
                <small>Pulpería • Gestión 2026</small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Pagina404;