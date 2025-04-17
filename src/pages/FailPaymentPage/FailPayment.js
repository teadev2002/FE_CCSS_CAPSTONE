import React, { useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/FailPayment.scss";

const FailPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy paymentSource từ state hoặc localStorage để biết người dùng đến từ đâu
  const paymentSource = location.state?.source || localStorage.getItem("paymentSource");

  // Xóa paymentSource khỏi localStorage sau khi sử dụng
  useEffect(() => {
    if (localStorage.getItem("paymentSource")) {
      localStorage.removeItem("paymentSource");
    }
  }, []);

  // Hàm quay về trang chủ
  const handleBackToHome = () => {
    navigate("/");
  };

  // Hàm thử thanh toán lại, quay lại trang trước đó dựa trên paymentSource
  const handleTryAgain = () => {
    if (paymentSource === "festivals") {
      navigate("/festivals");
    } else if (paymentSource === "souvenirs" || paymentSource === "cart") {
      navigate("/souvenirs-shop");
    } else {
      navigate("/");
    }
  };

  // Hiển thị các nút hành động
  const renderButtons = () => {
    return (
      <>
        <Button
          variant="primary"
          className="fail-btn flex-grow-1 d-flex align-items-center justify-content-center"
          onClick={handleTryAgain}
        >
          <i className="fas fa-redo-alt me-2"></i> Try Again
        </Button>
        <Button
          variant="outline-secondary"
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          onClick={handleBackToHome}
        >
          <i className="fas fa-home me-2"></i> Back to Home
        </Button>
      </>
    );
  };

  return (
    <Container fluid className="fail-page min-vh-100 py-5">
      <Container className="py-5" style={{ maxWidth: "960px" }}>
        <Card className="fail-card shadow-lg rounded-3 overflow-hidden">
          <div className="fail-header text-white text-center py-5 px-4">
            <div className="cross-circle d-inline-block p-4 rounded-circle bg-white shadow animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="cross-icon h-16 w-16 text-danger"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold">Payment Failed!</h1>
            <p className="mt-2 lead">An error occurred during the payment process.</p>
          </div>
          <Card.Body className="p-5 text-center">
            <p className="text-muted mb-4">
              Please check your payment information or try again later. If you need assistance, contact us.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              {renderButtons()}
            </div>
          </Card.Body>
        </Card>
        <div className="text-center mt-5">
          <p className="text-muted">
            Need help?{" "}
            <a href="#" className="text-link">
              Contact us
            </a>
          </p>
          <div className="mt-3 d-flex justify-content-center gap-3">
            <a href="#" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </Container>
    </Container>
  );
};

export default FailPayment;