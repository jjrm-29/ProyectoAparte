import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Pagina404() {
  const navigate = useNavigate();

  return (
    <div className="error-page min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card className="text-center border-0 animate-scale-in">
              <Card.Body className="p-5">
                <p className="error-code mb-2">404</p>
                <h2 className="h4 mb-3">Página no encontrada</h2>
                <p className="text-muted mb-4">
                  La ruta que buscas no existe o fue movida.
                </p>

                <div className="d-grid gap-2">
                  <Button variant="primary" className="btn-interactive" onClick={() => navigate("/")}>
                    Ir al inicio
                  </Button>
                  <Button variant="outline-secondary" className="btn-interactive" onClick={() => navigate(-1)}>
                    Volver atrás
                  </Button>
                </div>
              </Card.Body>

              <Card.Footer className="text-muted bg-transparent border-0 pb-4">
                <small>Pulpería Chevez</small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Pagina404;
