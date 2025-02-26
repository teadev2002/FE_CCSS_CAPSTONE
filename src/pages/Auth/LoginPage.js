import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Mail, Lock, ArrowRight, LogIn, Coffee } from "lucide-react";
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

  // Get current time
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return (
    <div className="gradient-bg">
      <Container>
        <Row className="align-items-center justify-content-center content">
          <Col md={6} className="text-white p-4 left-panel">
            <div className="welcome-badge">
              <Coffee size={18} />
              <span>Welcome Back</span>
            </div>
            <h1 className="display-4 fw-bold mb-4">
              The best offer
              <br />
              <span className="text-accent">for your business</span>
            </h1>
            <p className="lead">
              Welcome to our cosplay rental service! We provide high-quality
              costumes, accessories, and props for conventions, parties, or
              content creation. Featuring popular characters from anime, games,
              and movies, we offer affordable rates, flexible rentals, and great
              support for all sizes. Make your cosplay experience unforgettable
              with us!
            </p>
            <div className="brand-badges">
              <div className="badge-item">Trusted by 500+ customers</div>
              <div className="badge-item">Premium Quality</div>
              <div className="badge-item">24/7 Support</div>
            </div>
          </Col>

          <Col md={6}>
            <div className="login-form">
              <div className="greeting-text">{greeting}!</div>
              <h2 className="text-center mb-4 ui-title">SIGN IN</h2>

              <Form onSubmit={handleSubmit}>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
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
                </div>

                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
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
                </div>

                <div className="remember-me-container">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Remember me"
                    className="custom-checkbox"
                  />
                  <Button
                    variant="link"
                    className="forgot-password"
                    onClick={() => console.log("Forgot Password clicked")}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3 login-button"
                >
                  Log in <LogIn size={18} className="ms-2" />
                </Button>

                <div className="separator">
                  <span>OR</span>
                </div>

                <Button
                  variant="outline-secondary"
                  className="w-100 mb-4 social-button"
                  onClick={() => console.log("Sign in with Google clicked")}
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    width="20"
                    height="20"
                    className="me-2"
                  />
                  Sign in with Google
                </Button>

                <div className="text-center signup-text">
                  Don't have an account?
                  <Link to="/sign-up" className="signup-link">
                    Sign up <ArrowRight size={16} />
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
