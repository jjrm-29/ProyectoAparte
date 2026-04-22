import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../src/database/supabaseconfig";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      // Guardar usuario en localStorage (como ya lo haces en otros lugares)
      localStorage.setItem("usuario-supabase", email);

      navigate("/");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="justify-content-center w-100">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="login-card shadow-lg border-0 overflow-hidden">

              <div className="login-header text-center py-4">
                <div className="display-1 mb-3">🛒</div>
                <h2 className="fw-bold text-white mb-1">Bienvenido de nuevo</h2>
                <p className="text-white-50">Inicia sesión para continuar</p>
              </div>

              <Card.Body className="p-4 p-md-5">
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Contraseña</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        size="lg"
                      />
                      <Button
                        variant="link"
                        className="position-absolute top-50 end-0 translate-middle-y text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 mt-3 fw-bold fs-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Iniciando sesión...
                      </>
                    ) : "Iniciar Sesión"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    ¿No tienes cuenta? Contacta al administrador
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Decoración inferior */}
            <div className="text-center mt-4 text-white-50">
              <small>Pulpería • Gestión 2026</small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;