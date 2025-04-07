// import React, { useEffect } from "react";
// import { Container, Card, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "../../styles/SuccessPayment.scss";

// const SuccessPayment = () => {
//   const navigate = useNavigate(); // Initialize useNavigate hook

//   useEffect(() => {
//     const colors = [
//       "#f87171",
//       "#60a5fa",
//       "#34d399",
//       "#fbbf24",
//       "#a78bfa",
//       "#f472b6",
//     ];

//     // Create confetti effect
//     // for (let i = 0; i < 50; i++) {
//     //   const confetti = document.createElement("div");
//     //   confetti.className = "confetti";
//     //   confetti.style.backgroundColor =
//     //     colors[Math.floor(Math.random() * colors.length)];
//     //   confetti.style.left = Math.random() * 100 + "vw";
//     //   confetti.style.top = Math.random() * 100 + "vh";
//     //   confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)";
//     //   confetti.style.width = Math.random() * 8 + 5 + "px";
//     //   confetti.style.height = Math.random() * 8 + 5 + "px";
//     //   document.body.appendChild(confetti);

//     //   animateConfetti(confetti);
//     // }

//     function animateConfetti(element) {
//       const speed = 1 + Math.random() * 3;
//       const angle = Math.random() * 6;
//       let position = parseFloat(element.style.top);

//       function move() {
//         position += speed;
//         const left =
//           parseFloat(element.style.left) +
//           Math.sin((angle * position) / 20) * 2;

//         element.style.top = position + "px";
//         element.style.left = left + "px";

//         if (position < window.innerHeight) {
//           requestAnimationFrame(move);
//         } else {
//           position = -10;
//           element.style.left = Math.random() * 100 + "vw";
//           move();
//         }
//       }

//       move();
//     }
//   }, []);

//   // Define the handleBackToHome function to navigate to the home page
//   const handleBackToHome = () => {
//     navigate("/"); // Navigate to the home route
//   };

//   return (
//     <Container fluid className="bg-light min-vh-100 py-5">
//       <Container className="py-5" style={{ maxWidth: "960px" }}>
//         <Card className="shadow-lg rounded-3 overflow-hidden">
//           {/* Green Top Banner */}
//           <div className="bg-success text-white text-center py-5 px-4">
//             <div className="d-inline-block p-4 rounded-circle bg-white shadow animate-float">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-16 w-16 text-success"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h1 className="mt-4 text-3xl font-bold">Thanh toán thành công!</h1>
//           </div>

//           {/* Order Details */}
//           <Card.Body className="p-5">
//             {/* Buttons */}
//             <div className="d-flex flex-column flex-sm-row gap-3">
//               <Button
//                 variant="success"
//                 className="flex-grow-1 d-flex align-items-center justify-content-center"
//                 onClick={handleBackToHome} // Attach the handler to the button
//               >
//                 <i className="fas fa-truck me-2"></i> Back to Home
//               </Button>
//             </div>
//           </Card.Body>
//         </Card>

//         {/* Bottom Info */}
//         <div className="text-center mt-5">
//           <p className="text-muted">
//             Bạn cần hỗ trợ?{" "}
//             <a href="#" className="text-success">
//               Liên hệ chúng tôi
//             </a>
//           </p>
//           <div className="mt-3 d-flex justify-content-center gap-3">
//             <a href="#" className="text-muted">
//               <i className="fab fa-facebook-f"></i>
//             </a>
//             <a href="#" className="text-muted">
//               <i className="fab fa-instagram"></i>
//             </a>
//             <a href="#" className="text-muted">
//               <i className="fab fa-twitter"></i>
//             </a>
//             <a href="#" className="text-muted">
//               <i className="fab fa-youtube"></i>
//             </a>
//           </div>
//         </div>
//       </Container>
//     </Container>
//   );
// };

// export default SuccessPayment;

import React, { useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/SuccessPayment.scss";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy paymentSource từ state hoặc localStorage
  const paymentSource = location.state?.source || localStorage.getItem("paymentSource");

  // Xóa paymentSource từ localStorage sau khi sử dụng
  useEffect(() => {
    if (localStorage.getItem("paymentSource")) {
      localStorage.removeItem("paymentSource");
    }
  }, []);

  useEffect(() => {
    const colors = [
      "#f85caa",
      "#60a5fa",
      "#a3e635",
      "#fb923c",
      "#c084fc",
      "#f472b6",
    ];

    const confettiElements = [];
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
      confettiElements.push(confetti);
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

    return () => {
      confettiElements.forEach((confetti) => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      });
    };
  }, []);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleContinueShopping = () => {
    navigate("/souvenirs-shop");
  };

  const handleContinueBuyingTickets = () => {
    navigate("/festivals");
  };

  const renderButtons = () => {
    switch (paymentSource) {
      case "festivals":
        return (
          <>
            <Button
              variant="primary"
              className="success-btn flex-grow-1 d-flex align-items-center justify-content-center"
              onClick={handleBackToHome}
            >
              <i className="fas fa-home me-2"></i> Back to Home
            </Button>
            <Button
              variant="outline-secondary"
              className="flex-grow-1 d-flex align-items-center justify-content-center"
              onClick={handleContinueBuyingTickets}
            >
              <i className="fas fa-ticket-alt me-2"></i> Continue Buying Tickets
            </Button>
          </>
        );
      case "souvenirs":
      case "cart":
        return (
          <>
            <Button
              variant="primary"
              className="success-btn flex-grow-1 d-flex align-items-center justify-content-center"
              onClick={handleBackToHome}
            >
              <i className="fas fa-home me-2"></i> Back to Home
            </Button>
            <Button
              variant="outline-secondary"
              className="flex-grow-1 d-flex align-items-center justify-content-center"
              onClick={handleContinueShopping}
            >
              <i className="fas fa-shopping-bag me-2"></i> Continue Shopping
            </Button>
          </>
        );
      default:
        return (
          <Button
            variant="primary"
            className="success-btn flex-grow-1 d-flex align-items-center justify-content-center"
            onClick={handleBackToHome}
          >
            <i className="fas fa-home me-2"></i> Back to Home
          </Button>
        );
    }
  };

  return (
    <Container fluid className="success-page min-vh-100 py-5">
      <Container className="py-5" style={{ maxWidth: "960px" }}>
        <Card className="success-card shadow-lg rounded-3 overflow-hidden">
          <div className="success-header text-white text-center py-5 px-4">
            <div className="check-circle d-inline-block p-4 rounded-circle bg-white shadow animate-float">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="check-icon h-16 w-16 text-success"
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
            <h1 className="mt-4 text-3xl font-bold">Payment Successful!</h1>
            <p className="mt-2 lead">Thank you for your purchase!</p>
          </div>
          <Card.Body className="p-5 text-center">
            <p className="text-muted mb-4">
              Your order has been processed successfully. We'll send you a confirmation soon.
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

export default SuccessPayment;