import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert, Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUserAuth();

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(email === 'admin@gmail.com' && password === 'admin789' ? '/adminhomepage' : '/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <br />
      <br />
      <Row>
        <Col></Col>
        <Col>
          <Row>
            <Col>
              <br />
              <center><h2 className="mb-3">Login</h2></center>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="mb-3 d-flex justify-content-center"
                  controlId="formBasicEmail"
                >
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-small"
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3 d-flex justify-content-center"
                  controlId="formBasicPassword"
                >
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <div className="d-grid gap-2 justify-content-center">
                  <Button className="custom-button-style" type="submit">
                    Sign in
                  </Button>
                </div>
              </Form>

              <div className="p-4 box mt-3 text-center">
                Don't have an account? <Link to="/register">Sign up</Link>
              </div>
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default Login;