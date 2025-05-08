import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { Mail, Lock, ArrowRight, LogIn, Coffee } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/LoginPage.scss";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState(null);
  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.login(
        formData.email,
        formData.password
      );
      const accessToken = response.accessToken;
      localStorage.setItem("accessToken", accessToken);

      let decoded;
      let userRole = null;
      try {
        decoded = jwtDecode(accessToken);
        userRole = decoded.role;
      } catch (decodeError) {
        console.error("Lỗi khi giải mã token:", decodeError);
      }

      toast.success("You have successfully logged in!");

      if (userRole === "Cosplayer" && decoded) {
        const userId = decoded.Id;
        navigate(`/my-task/${userId}`);
      } else if (userRole === "Manager" && decoded) {
        navigate(`/manage/request`);
      } else if (userRole === "Consultant" && decoded) {
        navigate(`/manage/contract`);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
      toast.error(
        "Đăng nhập thất bại: " + (err.message || "Something went wrong")
      );
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password submission
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError(null);

    if (!forgotEmail.trim()) {
      setForgotError("Email is required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(forgotEmail)) {
      setForgotError("Email is invalid.");
      return;
    }

    try {
      await AuthService.forgotPassword(forgotEmail);
      toast.success("Vui lòng kiểm tra email để đặt lại mật khẩu!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (err) {
      setForgotError(err.message || "Failed to send reset email.");
      toast.error(err.message || "Failed to send reset email.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const checkExistingToken = () => {
      if (AuthService.isAuthenticated()) {
        console.log("Existing token found");
        navigate("/");
      }
    };
    checkExistingToken();
  }, [navigate]);

  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

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

              {error && <div className="alert alert-danger">{error}</div>}

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
                      disabled={loading}
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
                      disabled={loading}
                    />
                  </Form.Group>
                </div>

                <div className="remember-me-container">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Remember me"
                    className="custom-checkbox"
                    disabled={loading}
                  />
                  <Button
                    variant="link"
                    className="forgot-password"
                    onClick={() => setShowForgotModal(true)} // Mở modal
                    disabled={loading}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3 login-button"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                  <LogIn size={18} className="ms-2" />
                </Button>

                <div className="separator">
                  <span>OR</span>
                </div>

                <Button
                  variant="outline-secondary"
                  className="w-100 mb-4 social-button"
                  onClick={() => console.log("Sign in with Google clicked")}
                  disabled={loading}
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

      {/* Modal Forgot Password */}
      <Modal
        show={showForgotModal}
        onHide={() => {
          setShowForgotModal(false);
          setForgotEmail("");
          setForgotError(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3" controlId="formForgotEmail">
              <Form.Label>Enter your email address</Form.Label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <Form.Control
                  type="email"
                  placeholder="E-mail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  isInvalid={!!forgotError}
                />
                <Form.Control.Feedback type="invalid">
                  {forgotError}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send Reset Link
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LoginPage;
