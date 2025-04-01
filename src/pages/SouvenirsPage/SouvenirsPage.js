// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Modal, Button, Form, Carousel } from "react-bootstrap";
// import "../../styles/SouvenirsPage.scss";
// import ProductService from "../../services/ProductService/ProductService";
// import CartService from "../../services/CartService/CartService";
// import PaymentService from "../../services/PaymentService/PaymentService";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { jwtDecode } from "jwt-decode";

// const SouvenirsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showSouvenirModal, setShowSouvenirModal] = useState(false);
//   const [selectedSouvenir, setSelectedSouvenir] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [accountId, setAccountId] = useState(null);
//   const [cartId, setCartId] = useState(null);

//   const getAccountIdFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         console.log("Decoded token in SouvenirsPage:", decoded);
//         return decoded?.Id;
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchedAccountId = getAccountIdFromToken();
//         setAccountId(fetchedAccountId);

//         if (fetchedAccountId) {
//           const cartData = await CartService.getCartByAccountId(fetchedAccountId);
//           setCartId(cartData.cartId);
//         }

//         const combinedData = await ProductService.getCombinedProductData();
//         setProducts(combinedData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSouvenirShow = (souvenir) => {
//     setSelectedSouvenir(souvenir);
//     setShowSouvenirModal(true);
//   };

//   const handleSouvenirClose = () => {
//     setShowSouvenirModal(false);
//     setSelectedSouvenir(null);
//     setQuantity(1);
//     setShowPaymentModal(false);
//     setShowConfirmModal(false);
//     setPaymentMethod(null);
//   };

//   const handleIncrease = () => {
//     if (selectedSouvenir && quantity < selectedSouvenir.quantity) {
//       setQuantity((prev) => prev + 1);
//     } else {
//       toast.error("Quantity exceeds available stock!");
//     }
//   };

//   const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleBuyNow = () => {
//     setShowPaymentModal(true);
//   };

//   const handleAddToCart = async () => {
//     if (!accountId || !cartId) {
//       toast.error("Please log in to add items to your cart!");
//       return;
//     }
//     try {
//       const productData = [{ productId: selectedSouvenir.id, quantity }];
//       await CartService.addProductToCart(cartId, productData);
//       toast.success(`${selectedSouvenir.name} has been added to your cart!`);
//       window.dispatchEvent(new Event("storage"));
//       handleSouvenirClose();
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleConfirmPurchase = () => {
//     if (!paymentMethod) {
//       toast.error("Please select a payment method!");
//       return;
//     }
//     setShowPaymentModal(false);
//     setShowConfirmModal(true);
//   };

//   const handleFinalConfirm = async () => {
//     const totalAmount = selectedSouvenir.price * quantity;

//     if (paymentMethod === "Momo") {
//       try {
//         const paymentData = {
//           fullName: "string", // Mặc định
//           orderId: "string", // Mặc định
//           orderInfo: "string", // Mặc định
//           amount: totalAmount, // Tổng tiền
//           purpose: 3, // Mua hàng
//           accountId: accountId, // Từ token
//           accountCouponId: null, // Luôn là null
//           ticketId: "string", // Mặc định
//           ticketQuantity: "string", // Mặc định
//           contractId: "string", // Mặc định
//           orderpaymentId: `PAY_${Date.now()}`, // Giá trị ngẫu nhiên
//         };

//         const paymentUrl = await PaymentService.createMomoPayment(paymentData);
//         toast.success("Redirecting to MoMo payment...");
//         window.location.href = paymentUrl; // Chuyển hướng đến URL thanh toán
//       } catch (error) {
//         toast.error(error.message);
//         setShowConfirmModal(false);
//         return;
//       }
//     } else {
//       toast.success(
//         `Purchase confirmed with ${paymentMethod} for ${quantity} ${selectedSouvenir.name}(s)!`
//       );
//       handleSouvenirClose();
//     }
//   };

//   const handleBackToPayment = () => {
//     setShowConfirmModal(false);
//     setShowPaymentModal(true);
//   };

//   const filteredSouvenirs = products.filter((souvenir) =>
//     souvenir.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-5 text-danger">
//         {error}
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   }

//   return (
//     <div className="costume-rental-page min-vh-100">
//       <div className="hero-section text-white py-5">
//         <div className="container">
//           <h1 className="display-4 fw-bold text-center">Souvenir Store</h1>
//           <p className="lead text-center mt-3">
//             Find and buy the perfect souvenirs
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="search-container mb-5">
//           <div className="search-bar mx-auto">
//             <div className="input-group">
//               <span className="input-group-text">
//                 <Search size={20} />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search souvenirs..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="costume-grid">
//           {filteredSouvenirs.map((souvenir) => (
//             <div className="costume-card" key={souvenir.id}>
//               <div className="card-image">
//                 <img
//                   src={souvenir.image}
//                   alt={souvenir.name}
//                   className="img-fluid"
//                 />
//               </div>
//               <div className="card-content">
//                 <h5 className="costume-name">{souvenir.name}</h5>
//                 <div className="price-and-button">
//                   <p className="costume-category">${souvenir.price}</p>
//                   <button
//                     className="rent-button"
//                     onClick={() => handleSouvenirShow(souvenir)}
//                   >
//                     Buy Now!
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {filteredSouvenirs.length === 0 && (
//             <p className="text-center mt-4">No souvenirs found.</p>
//           )}
//         </div>
//       </div>

//       <Modal
//         show={showSouvenirModal}
//         onHide={handleSouvenirClose}
//         size="lg"
//         centered
//         className="gallery-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedSouvenir?.name} Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedSouvenir && (
//             <div className="costume-gallery">
//               <Carousel className="gallery-carousel">
//                 <Carousel.Item>
//                   <div className="carousel-image-container">
//                     <img
//                       className="d-block w-100"
//                       src={selectedSouvenir.image}
//                       alt={selectedSouvenir.name}
//                     />
//                   </div>
//                   <Carousel.Caption>
//                     <h3>{selectedSouvenir.name}</h3>
//                     <p>Image 1 of 1</p>
//                   </Carousel.Caption>
//                 </Carousel.Item>
//               </Carousel>

//               <div className="fest-details mt-4">
//                 <h4>About {selectedSouvenir.name}</h4>
//                 <p>{selectedSouvenir.description}</p>
//                 <div className="fest-info">
//                   <div className="fest-info-item">
//                     <strong>Price:</strong> ${selectedSouvenir.price}
//                   </div>
//                   <div className="fest-info-item">
//                     <strong>In Stock:</strong> {selectedSouvenir.quantity}
//                   </div>
//                 </div>

//                 <div className="fest-ticket-section mt-4">
//                   <h5>Purchase Item</h5>
//                   <div className="fest-ticket-quantity mb-3">
//                     <Form.Label>Quantity</Form.Label>
//                     <div className="d-flex align-items-center">
//                       <Button
//                         variant="outline-secondary"
//                         onClick={handleDecrease}
//                         disabled={quantity === 1}
//                       >
//                         -
//                       </Button>
//                       <span className="mx-3">{quantity}</span>
//                       <Button
//                         variant="outline-secondary"
//                         onClick={handleIncrease}
//                         disabled={quantity >= selectedSouvenir.quantity}
//                       >
//                         +
//                       </Button>
//                     </div>
//                   </div>
//                   <div>
//                     <Button
//                       className="fest-buy-ticket-btn me-2"
//                       onClick={handleBuyNow}
//                     >
//                       Buy Now - ${selectedSouvenir.price * quantity}
//                     </Button>
//                     <Button
//                       className="fest-buy-ticket-btn"
//                       style={{ background: "linear-gradient(135deg,rgb(131, 34, 82),rgb(128, 81, 170))" }}
//                       onClick={handleAddToCart}
//                     >
//                       Add to Cart
//                     </Button>
//                   </div>
//                 </div>

//                 {showPaymentModal && (
//                   <div className="fest-purchase-form mt-4">
//                     <h5>Select Payment Method</h5>
//                     <Form>
//                       <Form.Check
//                         type="radio"
//                         label="Momo"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("Momo")}
//                         className="mb-2"
//                       />
//                       <Form.Check
//                         type="radio"
//                         label="VNPay"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("VNPay")}
//                         className="mb-2"
//                       />
//                       <Button
//                         variant="primary"
//                         onClick={handleConfirmPurchase}
//                         className="mt-3"
//                       >
//                         Confirm Purchase
//                       </Button>
//                     </Form>
//                   </div>
//                 )}

//                 {showConfirmModal && (
//                   <div className="fest-purchase-form mt-4">
//                     <h5>Confirm Payment</h5>
//                     <p>
//                       Are you sure you want to pay $
//                       {selectedSouvenir.price * quantity} for {quantity}{" "}
//                       {selectedSouvenir.name}(s) with {paymentMethod}?
//                     </p>
//                     <Button
//                       variant="success"
//                       onClick={handleFinalConfirm}
//                       className="me-2"
//                     >
//                       Yes
//                     </Button>
//                     <Button variant="secondary" onClick={handleBackToPayment}>
//                       No
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default SouvenirsPage;

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import "../../styles/SouvenirsPage.scss";
import ProductService from "../../services/ProductService/ProductService";
import CartService from "../../services/CartService/CartService";
import PaymentService from "../../services/PaymentService/PaymentService";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const SouvenirsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSouvenirModal, setShowSouvenirModal] = useState(false);
  const [selectedSouvenir, setSelectedSouvenir] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [cartId, setCartId] = useState(null);

  const getAccountIdFromToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        console.log("Decoded token in SouvenirsPage:", decoded);
        return decoded?.Id;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAccountId = getAccountIdFromToken();
        setAccountId(fetchedAccountId);

        if (fetchedAccountId) {
          const cartData = await CartService.getCartByAccountId(fetchedAccountId);
          setCartId(cartData.cartId);
        }

        const combinedData = await ProductService.getCombinedProductData();
        setProducts(combinedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSouvenirShow = (souvenir) => {
    setSelectedSouvenir(souvenir);
    setShowSouvenirModal(true);
  };

  const handleSouvenirClose = () => {
    setShowSouvenirModal(false);
    setSelectedSouvenir(null);
    setQuantity(1);
    setShowPaymentModal(false);
    setShowConfirmModal(false);
    setPaymentMethod(null);
  };

  const handleIncrease = () => {
    if (selectedSouvenir && quantity < selectedSouvenir.quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Quantity exceeds available stock!");
    }
  };

  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleBuyNow = () => {
    setShowPaymentModal(true);
  };

  const handleAddToCart = async () => {
    if (!accountId || !cartId) {
      toast.error("Please log in to add items to your cart!");
      return;
    }
    try {
      const productData = [{ productId: selectedSouvenir.id, quantity }];
      await CartService.addProductToCart(cartId, productData);
      toast.success(`${selectedSouvenir.name} has been added to your cart!`);
      window.dispatchEvent(new Event("storage"));
      handleSouvenirClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConfirmPurchase = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }
    setShowPaymentModal(false);
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = async () => {
    const totalAmount = selectedSouvenir.price * quantity;

    if (paymentMethod === "Momo") {
      try {
        const paymentData = {
          fullName: "string", // Mặc định
          orderId: "string", // Mặc định
          orderInfo: "string", // Mặc định
          amount: totalAmount, // Tổng tiền
          purpose: 3, // Mua hàng
          accountId: accountId, // Từ token
          accountCouponId: null, // Luôn là null
          ticketId: "string", // Mặc định
          ticketQuantity: "string", // Mặc định
          contractId: "string", // Mặc định
          orderpaymentId: `PAY_${Date.now()}`, // Giá trị ngẫu nhiên
        };

        const paymentUrl = await PaymentService.createMomoPayment(paymentData);
        toast.success("Redirecting to MoMo payment...");
        window.location.href = paymentUrl; // Chuyển hướng đến URL thanh toán
      } catch (error) {
        toast.error(error.message);
        setShowConfirmModal(false);
        return;
      }
    } else {
      toast.success(
        `Purchase confirmed with ${paymentMethod} for ${quantity} ${selectedSouvenir.name}(s)!`
      );
      handleSouvenirClose();
    }
  };

  const handleBackToPayment = () => {
    setShowConfirmModal(false);
    setShowPaymentModal(true);
  };

  const filteredSouvenirs = products.filter((souvenir) =>
    souvenir.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        {error}
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="costume-rental-page min-vh-100">
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Souvenir Store</h1>
          <p className="lead text-center mt-3">
            Find and buy the perfect souvenirs
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="search-container mb-5">
          <div className="search-bar mx-auto">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={20} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search souvenirs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="costume-grid">
          {filteredSouvenirs.map((souvenir) => (
            <div className="costume-card" key={souvenir.id}>
              <div className="card-image">
                <img
                  src={souvenir.image}
                  alt={souvenir.name}
                  className="img-fluid"
                />
              </div>
              <div className="card-content">
                <h5 className="costume-name">{souvenir.name}</h5>
                <div className="price-and-button">
                  <p className="costume-category">${souvenir.price}</p>
                  <button
                    className="rent-button"
                    onClick={() => handleSouvenirShow(souvenir)}
                  >
                    Buy Now!
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredSouvenirs.length === 0 && (
            <p className="text-center mt-4">No souvenirs found.</p>
          )}
        </div>
      </div>

      <Modal
        show={showSouvenirModal}
        onHide={handleSouvenirClose}
        size="lg"
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedSouvenir?.name} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSouvenir && (
            <div className="costume-gallery">
              <Carousel className="gallery-carousel">
                <Carousel.Item>
                  <div className="carousel-image-container">
                    <img
                      className="d-block w-100"
                      src={selectedSouvenir.image}
                      alt={selectedSouvenir.name}
                    />
                  </div>
                  <Carousel.Caption>
                    <h3>{selectedSouvenir.name}</h3>
                    <p>Image 1 of 1</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              <div className="fest-details mt-4">
                <h4>About {selectedSouvenir.name}</h4>
                <p>{selectedSouvenir.description}</p>
                <div className="fest-info">
                  <div className="fest-info-item">
                    <strong>Price:</strong> ${selectedSouvenir.price}
                  </div>
                  <div className="fest-info-item">
                    <strong>In Stock:</strong> {selectedSouvenir.quantity}
                  </div>
                </div>

                <div className="fest-ticket-section mt-4">
                  <h5>Purchase Item</h5>
                  <div className="fest-ticket-quantity mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        onClick={handleDecrease}
                        disabled={quantity === 1}
                      >
                        -
                      </Button>
                      <span className="mx-3">{quantity}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={handleIncrease}
                        disabled={quantity >= selectedSouvenir.quantity}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="fest-buy-ticket-btn me-2"
                      onClick={handleBuyNow}
                    >
                      Buy Now - ${selectedSouvenir.price * quantity}
                    </Button>
                    <Button
                      className="fest-buy-ticket-btn"
                      style={{ background: "linear-gradient(135deg,rgb(131, 34, 82),rgb(128, 81, 170))" }}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {showPaymentModal && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Select Payment Method</h5>
                    <Form>
                      <Form.Check
                        type="radio"
                        label="Momo"
                        name="paymentMethod"
                        onChange={() => setPaymentMethod("Momo")}
                        className="mb-2"
                      />
                      <Form.Check
                        type="radio"
                        label="VNPay"
                        name="paymentMethod"
                        onChange={() => setPaymentMethod("VNPay")}
                        className="mb-2"
                      />
                      <Button
                        variant="primary"
                        onClick={handleConfirmPurchase}
                        className="mt-3"
                      >
                        Confirm Purchase
                      </Button>
                    </Form>
                  </div>
                )}

                {showConfirmModal && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Confirm Payment</h5>
                    <p>
                      Are you sure you want to pay $
                      {selectedSouvenir.price * quantity} for {quantity}{" "}
                      {selectedSouvenir.name}(s) with {paymentMethod}?
                    </p>
                    <Button
                      variant="success"
                      onClick={handleFinalConfirm}
                      className="me-2"
                    >
                      Yes
                    </Button>
                    <Button variant="secondary" onClick={handleBackToPayment}>
                      No
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SouvenirsPage;