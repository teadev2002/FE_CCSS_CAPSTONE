import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/SouvenirsPage.scss";
import ProductService from "../../services/ProductService/ProductService";
import CartService from "../../services/CartService/CartService";
import PaymentService from "../../services/PaymentService/PaymentService";
import { apiClient } from "../../api/apiClient.js";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { Pagination } from "antd";

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
  const [accountName, setAccountName] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  const getAccountInfoFromToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        return {
          id: decoded?.Id,
          accountName: decoded?.AccountName,
        };
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  const fetchProducts = async () => {
    try {
      const combinedData = await ProductService.getCombinedProductData();
      setProducts(combinedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const accountInfo = getAccountInfoFromToken();
    if (accountInfo) {
      setAccountId(accountInfo.id);
      setAccountName(accountInfo.accountName);
    }

    if (accountInfo?.id) {
      CartService.getCartByAccountId(accountInfo.id).then((cartData) => {
        setCartId(cartData.cartId);
      });
    }

    fetchProducts();

    // Lắng nghe sự kiện storage để cập nhật danh sách sản phẩm
    window.addEventListener("storageUpdate", fetchProducts);
    return () => {
      window.removeEventListener("storageUpdate", fetchProducts);
    };
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
      window.dispatchEvent(new Event("storageUpdate")); // Cập nhật giao diện
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

  const createOrder = async () => {
    try {
      const orderData = {
        accountId: accountId,
        orderProducts: [
          {
            productId: selectedSouvenir.id,
            quantity: quantity,
            createDate: new Date().toISOString(),
          },
        ],
      };
      const response = await apiClient.post("/api/Order", orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create order");
    }
  };

  const checkOrderStatus = async (orderId) => {
    try {
      const response = await apiClient.get(`/api/Order/${orderId}`);
      return response.data.orderStatus;
    } catch (error) {
      throw new Error("Failed to check order status");
    }
  };

  const handleFinalConfirm = async () => {
    const totalAmount = selectedSouvenir.price * quantity;

    if (!accountId) {
      toast.error("Please log in to proceed with payment!");
      return;
    }

    try {
      const orderpaymentId = await createOrder();

      if (paymentMethod === "Momo") {
        const paymentData = {
          fullName: accountName || "Unknown",
          orderInfo: `Purchase ${selectedSouvenir.name}`,
          amount: totalAmount,
          purpose: 3,
          accountId: accountId,
          accountCouponId: null,
          ticketId: "string",
          ticketQuantity: "string",
          contractId: "string",
          orderpaymentId: orderpaymentId,
        };

        const paymentUrl = await PaymentService.createMomoPayment(paymentData);
        toast.success("Redirecting to MoMo payment...");
        localStorage.setItem("paymentSource", "souvenirs");
        window.location.href = paymentUrl;

        const intervalId = setInterval(async () => {
          try {
            const status = await checkOrderStatus(orderpaymentId);
            if (status === 1) { // Complete
              clearInterval(intervalId);
              const newQuantity = selectedSouvenir.quantity - quantity;
              await ProductService.updateProductQuantity(selectedSouvenir.id, newQuantity);
              toast.success("Payment successful!");
              setProducts((prevProducts) =>
                prevProducts.map((product) =>
                  product.id === selectedSouvenir.id
                    ? { ...product, quantity: newQuantity }
                    : product
                )
              );
              window.dispatchEvent(new Event("storageUpdate")); // Thông báo cập nhật
              handleSouvenirClose();
              navigate("/success-payment", { state: { source: "souvenirs" } });
            } else if (status === 2) { // Cancel
              clearInterval(intervalId);
              toast.error("Payment was canceled!");
              handleSouvenirClose();
            } else if (status === 0) { // Pending
              // Continue waiting
            }
          } catch (error) {
            clearInterval(intervalId);
            toast.error("Error checking payment status");
            handleSouvenirClose();
          }
        }, 5000);

        setTimeout(() => {
          clearInterval(intervalId);
          toast.error("Payment timeout. Please try again.");
          handleSouvenirClose();
        }, 120000); // 2 minutes timeout
      } else if (paymentMethod === "VNPay") {
        const paymentData = {
          fullName: accountName || "Unknown",
          orderInfo: `Purchase ${selectedSouvenir.name}`,
          amount: totalAmount,
          purpose: 3,
          accountId: accountId,
          accountCouponId: null,
          orderpaymentId: orderpaymentId,
        };

        const paymentUrl = await PaymentService.createVnpayPayment(paymentData);
        toast.success("Redirecting to VNPay payment...");
        localStorage.setItem("paymentSource", "souvenirs");
        window.location.href = paymentUrl;

        const intervalId = setInterval(async () => {
          try {
            const status = await checkOrderStatus(orderpaymentId);
            if (status === 1) { // Complete
              clearInterval(intervalId);
              const newQuantity = selectedSouvenir.quantity - quantity;
              await ProductService.updateProductQuantity(selectedSouvenir.id, newQuantity);
              toast.success("Payment successful with VNPay!");
              setProducts((prevProducts) =>
                prevProducts.map((product) =>
                  product.id === selectedSouvenir.id
                    ? { ...product, quantity: newQuantity }
                    : product
                )
              );
              window.dispatchEvent(new Event("storageUpdate")); // Thông báo cập nhật
              handleSouvenirClose();
              navigate("/success-payment", { state: { source: "souvenirs" } });
            } else if (status === 2) { // Cancel
              clearInterval(intervalId);
              toast.error("Payment with VNPay was canceled!");
              handleSouvenirClose();
            } else if (status === 0) { // Pending
              // Continue waiting
            }
          } catch (error) {
            clearInterval(intervalId);
            toast.error("Error checking payment status");
            handleSouvenirClose();
          }
        }, 5000);

        setTimeout(() => {
          clearInterval(intervalId);
          toast.error("Payment timeout. Please try again.");
          handleSouvenirClose();
        }, 120000); // 2 minutes timeout
      }
    } catch (error) {
      toast.error(error.message);
      setShowConfirmModal(false);
    }
  };

  const handleBackToPayment = () => {
    setShowConfirmModal(false);
    setShowPaymentModal(true);
  };

  const filteredSouvenirs = products.filter((souvenir) =>
    souvenir.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSouvenirs = filteredSouvenirs.slice(startIndex, endIndex);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

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
          {paginatedSouvenirs.map((souvenir) => (
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
                  <p className="costume-category">{formatPrice(souvenir.price)}</p>
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
        </div>

        {filteredSouvenirs.length === 0 ? (
          <p className="text-center mt-4">No souvenirs found.</p>
        ) : (
          <div className="pagination-container mt-5">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredSouvenirs.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["4", "8", "12", "16"]}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
            />
          </div>
        )}
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
                    <strong>Price:</strong> {formatPrice(selectedSouvenir.price)}
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
                      Buy Now - {formatPrice(selectedSouvenir.price * quantity)}
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
                      Are you sure you want to pay{" "}
                      {formatPrice(selectedSouvenir.price * quantity)} for {quantity}{" "}
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