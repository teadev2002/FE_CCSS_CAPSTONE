import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/SouvenirsPage.scss";
import ProductService from "../../services/ProductService/ProductService";
import ProductDeliveryService from "../../services/ProductDeliveryService/ProductDeliveryService";
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
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [toDistrictId, setToDistrictId] = useState("");
  const [toWardCode, setToWardCode] = useState("");

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

  const fetchProvinces = async () => {
    try {
      const provincesData = await ProductDeliveryService.getProvinces();
      setProvinces(provincesData);
      console.log("Provinces fetched:", provincesData); // Debug
    } catch (error) {
      toast.error(error.message);
      console.error("Fetch provinces error:", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const districtsData = await ProductDeliveryService.getDistricts(provinceId);
      setDistricts(districtsData);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
      setToDistrictId("");
      setToWardCode("");
      console.log("Districts fetched for provinceId", provinceId, ":", districtsData); // Debug
    } catch (error) {
      toast.error(error.message);
      console.error("Fetch districts error:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const wardsData = await ProductDeliveryService.getWards(districtId);
      setWards(wardsData);
      setSelectedWard("");
      setToWardCode("");
      console.log("Wards fetched for districtId", districtId, ":", wardsData); // Debug
    } catch (error) {
      toast.error(error.message);
      console.error("Fetch wards error:", error);
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
    fetchProvinces();

    window.addEventListener("storageUpdate", fetchProducts);
    return () => {
      window.removeEventListener("storageUpdate", fetchProducts);
    };
  }, []);

  const handleSouvenirShow = (souvenir) => {
    setSelectedSouvenir(souvenir);
    setShowSouvenirModal(true);
    console.log("Opening souvenir modal for:", souvenir.name); // Debug
  };

  const handleSouvenirClose = () => {
    setShowSouvenirModal(false);
    setSelectedSouvenir(null);
    setQuantity(1);
    setShowDeliveryModal(false);
    setShowPaymentModal(false);
    setShowSummaryModal(false);
    setPaymentMethod(null);
    setPhone("");
    setAddress("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setToDistrictId("");
    setToWardCode("");
    setDistricts([]);
    setWards([]);
    console.log("Closing souvenir modal"); // Debug
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
    setShowDeliveryModal(true);
    console.log("Opening delivery modal"); // Debug
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
      window.dispatchEvent(new Event("storageUpdate"));
      handleSouvenirClose();
    } catch (error) {
      toast.error(error.message);
      console.error("Add to cart error:", error);
    }
  };

  const handleDeliveryConfirm = () => {
    console.log("Delivery info check:", {
      phone,
      address,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      toDistrictId,
      toWardCode,
    });

    if (!phone || !address || !selectedProvince || !selectedDistrict || !selectedWard || !toWardCode) {
      toast.error("Please fill in all delivery information, including ward!");
      console.error("Missing fields:", {
        phone: !phone,
        address: !address,
        selectedProvince: !selectedProvince,
        selectedDistrict: !selectedDistrict,
        selectedWard: !selectedWard,
        toWardCode: !toWardCode,
      });
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits!");
      console.error("Invalid phone:", phone);
      return;
    }

    console.log("Delivery confirmed:", {
      phone,
      address,
      toDistrictId,
      toWardCode,
    });
    setShowPaymentModal(true);
    // Cuộn đến modal thanh toán
    setTimeout(() => {
      const paymentModal = document.getElementById("payment-modal");
      if (paymentModal) {
        paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleConfirmPurchase = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }
    console.log("Payment method selected:", paymentMethod); // Debug
    setShowPaymentModal(false);
    setShowSummaryModal(true);
    // Cuộn đến pop-up tóm tắt
    setTimeout(() => {
      const summaryModal = document.getElementById("summary-modal");
      if (summaryModal) {
        summaryModal.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const createOrder = async () => {
    try {
      const orderData = {
        accountId: accountId,
        address: address,
        phone: phone,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        orderProducts: [
          {
            productId: selectedSouvenir.id,
            quantity: quantity,
            createDate: new Date().toISOString(),
          },
        ],
      };
      console.log("Order payload:", orderData); // Debug
      const response = await apiClient.post("/api/Order", orderData);
      console.log("Order response:", response.data); // Debug
      return response.data;
    } catch (error) {
      console.error("Create order error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create order");
      throw error;
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
      console.log("OrderpaymentId:", orderpaymentId); // Debug

      const paymentData = {
        fullName: accountName || "Unknown",
        orderInfo: `Purchase ${quantity} ${selectedSouvenir.name}(s)`,
        amount: totalAmount,
        purpose: 3,
        accountId: accountId,
        accountCouponId: null,
        ticketId: null,
        ticketQuantity: null,
        contractId: null,
        orderpaymentId: orderpaymentId,
        isWeb: true,
      };
      console.log("Payment payload:", paymentData); // Debug

      let paymentUrl;
      if (paymentMethod === "Momo") {
        paymentUrl = await PaymentService.createMomoPayment(paymentData);
        console.log("Momo payment URL:", paymentUrl); // Debug
      } else if (paymentMethod === "VNPay") {
        paymentUrl = await PaymentService.createVnpayPayment(paymentData);
        console.log("VNPay payment URL:", paymentUrl); // Debug
      }

      toast.success(`Redirecting to ${paymentMethod} payment...`);
      setTimeout(() => {
        localStorage.setItem("paymentSource", "souvenirs");
        window.location.href = paymentUrl;
      }, 3000); // Chờ 3 giây để xem log
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      toast.error(error.message);
      setShowSummaryModal(false);
    }
  };

  const handleBackToPayment = () => {
    setShowSummaryModal(false);
    setShowPaymentModal(true);
    console.log("Back to payment modal"); // Debug
    setTimeout(() => {
      const paymentModal = document.getElementById("payment-modal");
      if (paymentModal) {
        paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleBackToDelivery = () => {
    setShowPaymentModal(false);
    console.log("Back to delivery modal"); // Debug
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

  // Hàm lấy tên tỉnh, quận, phường
  const getProvinceName = (provinceId) => {
    const province = provinces.find((p) => String(p.provinceId) === String(provinceId));
    console.log("getProvinceName:", { provinceId, provinceIdType: typeof provinceId, province }); // Debug
    return province ? province.provinceName : "N/A";
  };

  const getDistrictName = (districtId) => {
    const district = districts.find((d) => String(d.districtId) === String(districtId));
    console.log("getDistrictName:", { districtId, districtIdType: typeof districtId, district }); // Debug
    return district ? district.districtName : "N/A";
  };

  const getWardName = (wardCode) => {
    const ward = wards.find((w) => String(w.wardCode) === String(wardCode));
    console.log("getWardName:", { wardCode, wardCodeType: typeof wardCode, ward }); // Debug
    return ward ? ward.wardName : "N/A";
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
                      style={{
                        background:
                          "linear-gradient(135deg,rgb(131, 34, 82),rgb(128, 81, 170))",
                      }}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {showDeliveryModal && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Delivery Information</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter phone number (10 digits)"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            console.log("Phone updated:", e.target.value); // Debug
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Address (Street, House Number)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter street and house number"
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            console.log("Address updated:", e.target.value); // Debug
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Province/City</Form.Label>
                        <Form.Select
                          value={selectedProvince}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedProvince(value);
                            if (value) {
                              fetchDistricts(value);
                            } else {
                              setDistricts([]);
                              setWards([]);
                              setSelectedDistrict("");
                              setSelectedWard("");
                              setToDistrictId("");
                              setToWardCode("");
                            }
                            console.log("Selected province:", value); // Debug
                          }}
                        >
                          <option value="">Select Province/City</option>
                          {provinces.map((province) => (
                            <option
                              key={province.provinceId}
                              value={province.provinceId}
                            >
                              {province.provinceName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>District</Form.Label>
                        <Form.Select
                          value={selectedDistrict}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedDistrict(value);
                            const selected = districts.find(
                              (d) => d.districtId === parseInt(value)
                            );
                            const districtId = selected
                              ? selected.districtId.toString()
                              : "";
                            setToDistrictId(districtId);
                            if (value) {
                              fetchWards(value);
                            } else {
                              setWards([]);
                              setSelectedWard("");
                              setToWardCode("");
                            }
                            console.log("Selected district:", {
                              districtId: value,
                              toDistrictId: districtId,
                            }); // Debug
                          }}
                          disabled={!selectedProvince}
                        >
                          <option value="">Select District</option>
                          {districts.map((district) => (
                            <option
                              key={district.districtId}
                              value={district.districtId}
                            >
                              {district.districtName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Ward</Form.Label>
                        <Form.Select
                          value={selectedWard}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedWard(value);
                            const selected = wards.find(
                              (w) => String(w.wardCode) === String(value)
                            );
                            const wardCode = selected ? String(selected.wardCode) : String(value);
                            setToWardCode(wardCode);
                            console.log("Selected ward:", {
                              value,
                              valueType: typeof value,
                              wards: wards.map((w) => ({
                                wardCode: w.wardCode,
                                wardCodeType: typeof w.wardCode,
                              })),
                              selected,
                              selectedWard: value,
                              toWardCode: wardCode,
                            }); // Debug
                          }}
                          disabled={!selectedDistrict}
                        >
                          <option value="">Select Ward</option>
                          {wards.map((ward) => (
                            <option key={ward.wardCode} value={ward.wardCode}>
                              {ward.wardName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={handleDeliveryConfirm}
                        className="mt-3 fest-buy-ticket-btn"
                      >
                        Proceed to Payment
                      </Button>
                    </Form>
                  </div>
                )}

                {showPaymentModal && (
                  <div className="fest-purchase-form mt-4" id="payment-modal">
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
                        className="me-2 mt-3 fest-buy-ticket-btn"
                      >
                        Review Order
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleBackToDelivery}
                        className="mt-3"
                      >
                        Back
                      </Button>
                    </Form>
                  </div>
                )}

                {showSummaryModal && (
                  <div className="fest-purchase-form mt-4 summary-modal" id="summary-modal">
                    <h5>Order Summary</h5>
                    <div className="summary-details">
                      <p>
                        <strong>Product:</strong> {selectedSouvenir.name} x {quantity}
                      </p>
                      <p>
                        <strong>Total:</strong> {formatPrice(selectedSouvenir.price * quantity)}
                      </p>
                      <p>
                        <strong>Phone:</strong> {phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {address}
                      </p>
                      <p>
                        <strong>Province:</strong> {getProvinceName(selectedProvince)}
                      </p>
                      <p>
                        <strong>District:</strong> {getDistrictName(selectedDistrict)}
                      </p>
                      <p>
                        <strong>Ward:</strong> {getWardName(selectedWard)}
                      </p>
                      <p>
                        <strong>Payment Method:</strong> {paymentMethod}
                      </p>
                    </div>
                    <div className="summary-actions">
                      <Button
                        variant="success"
                        onClick={handleFinalConfirm}
                        className="me-2 fest-buy-ticket-btn"
                      >
                        Confirm Purchase
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleBackToPayment}
                        className="me-2"
                      >
                        Back
                      </Button>
                    </div>
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