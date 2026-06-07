import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  InputGroup
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { supabase } from "../database/supabaseconfig";
import BotonTema from "../components/navegacion/BotonTema";

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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (authError) throw authError;

      localStorage.setItem("usuario-supabase", email);
      navigate("/");
    } catch {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <BotonTema className="theme-toggle-floating" />
      <div className="login-orb login-orb-1" aria-hidden="true" />
      <div className="login-orb login-orb-2" aria-hidden="true" />
      <div className="login-orb login-orb-3" aria-hidden="true" />
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center position-relative px-3 py-4"
      >
        <Row className="w-100 justify-content-center align-items-center g-4 g-lg-5">
          <Col lg={6} className="d-none d-lg-block">
            <div className="login-hero animate-fade-left">
              <span className="login-hero-kicker">Gestión interna</span>
              <h1 className="login-hero-title">
                Pulpería
                <br />
                Chevez
              </h1>
              <p className="login-hero-text">
                Accede para registrar ventas, revisar inventario y mantener
                el catálogo al día.
              </p>
            </div>
          </Col>

          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="login-panel border-0 animate-scale-in">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="logo-mark mb-3">
                    <i className="bi bi-shop" aria-hidden="true" />
                  </div>
                  <h2 className="h4 fw-semibold mb-1">Iniciar sesión</h2>
                  <p className="text-muted small mb-0">
                    Usa tu cuenta de administrador
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="py-2 small">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-envelope" aria-hidden="true" />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-lock" aria-hidden="true" />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                      <Button
                        type="button"
                        variant="light"
                        className="show-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                        }
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                          aria-hidden="true"
                        />
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="login-submit w-100"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Ingresando…
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </Form>

                <p className="text-center text-muted small mt-4 mb-0">
                  Pulpería Chevez · 2026
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
