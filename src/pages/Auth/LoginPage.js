import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Mail } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/LoginPage.scss";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="gradient-bg">
      <Container>
        <Row className="align-items-center justify-content-center content">
          <Col md={6} className="text-white p-4">
            <h1 className="display-4 fw-bold mb-4">
              The best offer
              <br />
              <span className="text-info">for your business</span>
            </h1>
            <p className="lead opacity-75">
              Welcome to our cosplay rental service! We provide high-quality
              costumes, accessories, and props for conventions, parties, or
              content creation. Featuring popular characters from anime, games,
              and movies, we offer affordable rates, flexible rentals, and great
              support for all sizes. Make your cosplay experience unforgettable
              with us!
            </p>
          </Col>

          <Col md={6}>
            <div className="login-form">
              <h2 className="text-center mb-4 ui-title">SIGN IN</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3 login-button"
                >
                  Log in
                </Button>

                <div className="text-center mb-3">
                  <Button
                    variant="link"
                    className="text-muted p-0 forgot-password"
                    onClick={() => console.log("Forgot Password clicked")}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  variant="outline-secondary"
                  className="w-100 mb-2 social-button"
                  onClick={() => console.log("Sign in with Google clicked")}
                >
                  Sign in with Google
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    width="20"
                    height="20"
                    className="ms-2" // Thêm khoảng cách bên phải icon
                  />
                </Button>

                <div className="text-center or-signup">
                  <Link to="/signup" className="text-muted">
                    OR SIGN UP
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
