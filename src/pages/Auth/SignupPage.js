import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { User, Mail, Lock, Calendar, Phone, ArrowRight } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/SignUpPage.scss";
import AuthService from "../../services/AuthService";
import ModalConfirmSignUp from "./ModalConfirmSignUp";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "", // Giá trị từ input type="date" (YYYY-MM-DD)
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Hàm định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0, nên +1)
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Trả về định dạng DD/MM/YYYY
  };

  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra tên
    if (!formData.name.trim()) newErrors.name = "Name is required.";

    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Kiểm tra số điện thoại
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?\d{10,}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid (e.g., +1234567890).";
    }

    // Kiểm tra ngày sinh
    if (!formData.birthday) {
      newErrors.birthday = "Birthday is required.";
    } else {
      // So sánh ngày sinh với ngày hiện tại
      const today = new Date();
      const birthday = new Date(formData.birthday);

      // Kiểm tra ngày không trong tương lai
      if (birthday > today) {
        newErrors.birthday = "Birthday cannot be in the future.";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Định dạng birthday từ YYYY-MM-DD sang DD/MM/YYYY
        const birthdayFormatted = formatDateToDDMMYYYY(formData.birthday);

        // Gửi dữ liệu đến API với birthday đã được định dạng
        const response = await AuthService.signup(
          formData.name,
          formData.email,
          formData.password,
          birthdayFormatted, // Gửi định dạng DD/MM/YYYY
          formData.phone
        );

        console.log("Signup Response:", response);

        if (response === "Email existed!!!") {
          toast.error(
            "This email is already registered. Please use a different email.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            }
          );
          return;
        } else {
          setShowModal(true);
          toast.info("Please check your email for a verification code.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        }
      } catch (error) {
        toast.error(error.message || "Sign up failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  };

  return (
    <div className="gradient-bg min-vh-100">
      <Container>
        <Row className="align-items-center justify-content-center content">
          <Col md={6} className="text-white p-4 left-panel">
            <div className="welcome-badge">
              <User size={18} />
              <span>Create Your Account</span>
            </div>
            <h1 className="display-4 fw-bold mb-4">
              Join the Cosplay
              <br />
              <span className="text-accent">Community Today</span>
            </h1>
            <p className="lead">
              Become part of our vibrant cosplay community! Enjoy exclusive
              access to premium costumes, events, and resources. Sign up now to
              start your cosplay journey!
            </p>
            <div className="brand-badges">
              <div className="badge-item">Trusted by 500+ users</div>
              <div className="badge-item">High-Quality Costumes</div>
              <div className="badge-item">Community Support</div>
            </div>
          </Col>

          <Col md={6}>
            <div className="login-form">
              <h2 className="text-center mb-4 ui-title">SIGN UP</h2>

              {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger">
                  {Object.values(errors).map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                    />
                  </Form.Group>
                </div>

                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="E-mail"
                    />
                  </Form.Group>
                </div>

                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                    />
                  </Form.Group>
                </div>

                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                    />
                  </Form.Group>
                </div>

                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <Form.Group className="mb-3" controlId="formBirthday">
                    <Form.Control
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      placeholder="Select Birthday"
                    />
                  </Form.Group>
                </div>

                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                    />
                  </Form.Group>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3 login-button"
                >
                  Sign Up
                  <ArrowRight size={18} className="ms-2" />
                </Button>

                <div className="separator">
                  <span>OR</span>
                </div>

                <Button
                  variant="outline-secondary"
                  className="w-100 mb-4 social-button"
                  onClick={() => console.log("Sign up with Google clicked")}
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    width="20"
                    height="20"
                    className="me-2"
                  />
                  Sign up with Google
                </Button>

                <div className="text-center signup-text">
                  Already have an account?
                  <Link to="/login" className="signup-link">
                    Log in <ArrowRight size={16} />
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      <ModalConfirmSignUp
        show={showModal}
        onHide={() => setShowModal(false)}
        email={formData.email}
      />

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

export default SignupPage;
