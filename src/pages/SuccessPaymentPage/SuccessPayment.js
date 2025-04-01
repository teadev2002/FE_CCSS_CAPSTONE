import React, { useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  ProgressBar,
} from "react-bootstrap";
import "../../styles/SuccessPayment.scss";

const SuccessPayment = () => {
  useEffect(() => {
    const colors = [
      "#f87171",
      "#60a5fa",
      "#34d399",
      "#fbbf24",
      "#a78bfa",
      "#f472b6",
    ];

    // Create confetti effect
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = Math.random() * 100 + "vh";
      confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      confetti.style.width = Math.random() * 8 + 5 + "px";
      confetti.style.height = Math.random() * 8 + 5 + "px";
      document.body.appendChild(confetti);

      animateConfetti(confetti);
    }

    function animateConfetti(element) {
      const speed = 1 + Math.random() * 3;
      const angle = Math.random() * 6;
      let position = parseFloat(element.style.top);

      function move() {
        position += speed;
        const left =
          parseFloat(element.style.left) +
          Math.sin((angle * position) / 20) * 2;

        element.style.top = position + "px";
        element.style.left = left + "px";

        if (position < window.innerHeight) {
          requestAnimationFrame(move);
        } else {
          position = -10;
          element.style.left = Math.random() * 100 + "vw";
          move();
        }
      }

      move();
    }
  }, []);

  return (
    <Container fluid className="bg-light min-vh-100 py-5">
      <Container className="py-5" style={{ maxWidth: "960px" }}>
        <Card className="shadow-lg rounded-3 overflow-hidden">
          {/* Green Top Banner */}
          <div className="bg-success text-white text-center py-5 px-4">
            <div className="d-inline-block p-4 rounded-circle bg-white shadow animate-float">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold">Thanh toán thành công!</h1>
            <p className="mt-2">Cảm ơn bạn đã mua hàng tại YourBrand</p>
          </div>

          {/* Order Details */}
          <Card.Body className="p-5">
            {/* Order Summary */}
            <div className="mb-5">
              <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
              <Row>
                <Col md={6} className="mb-3">
                  <Card className="p-3">
                    <p className="text-muted small mb-2">Mã đơn hàng</p>
                    <p className="font-medium">#ORD-2023-45678</p>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card className="p-3">
                    <p className="text-muted small mb-2">Ngày thanh toán</p>
                    <p className="font-medium">15/06/2023 - 10:45</p>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card className="p-3">
                    <p className="text-muted small mb-2">
                      Phương thức thanh toán
                    </p>
                    <p className="font-medium d-flex align-items-center">
                      <i className="fab fa-cc-visa text-primary text-xl me-2"></i>
                      Visa •••• 6543
                    </p>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card className="p-3">
                    <p className="text-muted small mb-2">Tổng thanh toán</p>
                    <p className="font-bold text-success text-xl">2.450.000₫</p>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Items List */}
            <div className="mb-5">
              <h2 className="text-xl font-semibold mb-4">Sản phẩm đã mua</h2>
              <Card>
                <div className="p-4 border-bottom">
                  <div className="d-flex">
                    <div className="flex-shrink-0 h-20 w-20 rounded overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                        alt="Product"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ms-4 flex-grow-1">
                      <h3 className="font-medium">Apple Watch Series 7</h3>
                      <p className="text-muted small mt-1">
                        Phiên bản: GPS + Cellular, 45mm
                      </p>
                      <div className="d-flex justify-content-between mt-2">
                        <p className="font-medium">15.000.000₫</p>
                        <p className="text-muted small">Số lượng: 1</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="d-flex">
                    <div className="flex-shrink-0 h-20 w-20 rounded overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                        alt="Product"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ms-4 flex-grow-1">
                      <h3 className="font-medium">AirPods Pro 2</h3>
                      <p className="text-muted small mt-1">Phiên bản: 2023</p>
                      <div className="d-flex justify-content-between mt-2">
                        <p className="font-medium">5.000.000₫</p>
                        <p className="text-muted small">Số lượng: 1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Delivery Info */}
            <div className="mb-5">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin giao hàng
              </h2>
              <Row>
                <Col md={6} className="mb-3">
                  <Card className="p-3">
                    <p className="text-muted small mb-2">Người nhận</p>
                    <p className="font-medium">Nguyễn Văn A</p>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card className="p-3">
                    <p className="text-muted small mb-2">Số điện thoại</p>
                    <p className="font-medium">0987 654 321</p>
                  </Card>
                </Col>
                <Col md={12} className="mb-3">
                  <Card className="p-3">
                    <p className="text-muted small mb-2">Địa chỉ giao hàng</p>
                    <p className="font-medium">
                      Số 123, đường ABC, phường XYZ, quận 1, TP. Hồ Chí Minh
                    </p>
                  </Card>
                </Col>
              </Row>
              <Card className="bg-light p-4 position-relative">
                <div className="progress-gradient"></div>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-circle bg-white border border-success d-flex align-items-center justify-content-center">
                    <i className="fas fa-truck text-success"></i>
                  </div>
                  <div className="ms-4">
                    <h3 className="font-medium">Đang chuẩn bị hàng</h3>
                    <p className="text-muted small mt-1">
                      Đơn hàng của bạn sẽ được giao trong vòng 2-3 ngày làm việc
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar now={25} className="bg-success" />
                  <div className="d-flex justify-content-between text-muted small mt-2">
                    <span>Đã đặt hàng</span>
                    <span>Đang chuẩn bị</span>
                    <span>Đang vận chuyển</span>
                    <span>Đã giao hàng</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Button
                variant="success"
                className="flex-grow-1 d-flex align-items-center justify-content-center"
              >
                <i className="fas fa-truck me-2"></i> Theo dõi đơn hàng
              </Button>
              <Button
                variant="outline-secondary"
                className="flex-grow-1 d-flex align-items-center justify-content-center"
              >
                <i className="fas fa-shopping-bag me-2"></i> Tiếp tục mua sắm
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Bottom Info */}
        <div className="text-center mt-5">
          <p className="text-muted">
            Bạn cần hỗ trợ?{" "}
            <a href="#" className="text-success">
              Liên hệ chúng tôi
            </a>
          </p>
          <div className="mt-3 d-flex justify-content-center gap-3">
            <a href="#" className="text-muted">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-muted">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-muted">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-muted">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </Container>
    </Container>
  );
};

export default SuccessPayment;
