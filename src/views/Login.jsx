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
    setError("");

    // 🔐 VALIDACIÓN BÁSICA
    if (!email.includes("@")) {
      setError("Ingresa un correo válido");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña es muy corta");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      localStorage.setItem("usuario-supabase", email);

      navigate("/");
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col md={5} lg={4}>

            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">

              {/* HEADER */}
              <div className="bg-dark text-white text-center p-4">
                <h3 className="fw-bold mb-1">Pulpería Chevez</h3>
                <small className="text-white-50">Acceso al sistema</small>
              </div>

              <Card.Body className="p-4">

                {error && (
                  <Alert variant="danger" className="text-center">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleLogin}>

                  {/* EMAIL */}
                  <Form.Group className="mb-3">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  {/* PASSWORD */}
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <Button
                        type="button"
                        variant="link"
                        className="position-absolute top-50 end-0 translate-middle-y text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </Button>
                    </div>
                  </Form.Group>

                  {/* BOTÓN */}
                  <Button
                    type="submit"
                    className="w-100 fw-bold mt-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Entrando...
                      </>
                    ) : "Iniciar sesión"}
                  </Button>

                </Form>

              </Card.Body>
            </Card>

            {/* FOOTER */}
            <div className="text-center mt-3 text-muted">
              <small>Sistema de ventas • 2026</small>
            </div>

          </Col>
        </Row>
      </Container>

      {/* ESTILO */}
      <style>{`
        .login-bg {
          background: linear-gradient(135deg, #0f172a, #1e293b);
        }
      `}</style>
    </div>
  );
};

export default Login;