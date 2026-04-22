import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const FormularioLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulación de login (puedes conectar con Supabase después)
        setTimeout(() => {
            if (email && password) {
                localStorage.setItem("usuario-supabase", email);
                navigate("/");
            } else {
                setError("Por favor completa todos los campos");
            }
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="login-background">
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <Row className="justify-content-center w-100">
                    <Col xs={12} sm={11} md={8} lg={5} xl={4}>
                        <Card className="login-card border-0 shadow-xl overflow-hidden">
                            {/* Header llamativo */}
                            <div className="login-header text-center py-5">
                                <div className="mx-auto mb-4" style={{ fontSize: "4.5rem" }}>
                                    🛒
                                </div>
                                <h2 className="fw-bold text-white mb-2">Bienvenido de nuevo</h2>
                                <p className="text-white-50 fs-5">Inicia sesión para continuar</p>
                            </div>

                            <Card.Body className="p-5">
                                {error && (
                                    <Alert variant="danger" className="text-center mb-4">
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="ejemplo@correo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            size="lg"
                                            className="input-custom"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="input-custom"
                                            />
                                            <Button
                                                variant="light"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 py-3 mt-4 fw-bold fs-5 shadow-sm"
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
                                        ¿No tienes cuenta? • Contacta al administrador del sistema
                                    </small>
                                </div>
                            </Card.Body>

                            {/* Footer decorativo */}
                            <div className="text-center py-4 bg-light">
                                <small className="text-muted">Pulpería • Sistema de Gestión 2026</small>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FormularioLogin;