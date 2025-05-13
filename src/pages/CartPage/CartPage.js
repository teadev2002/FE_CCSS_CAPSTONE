import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/CartPage.scss";
import CartService from "../../services/CartService/CartService";
import PaymentService from "../../services/PaymentService/PaymentService";
import ProductDeliveryService from "../../services/ProductDeliveryService/ProductDeliveryService";
import { apiClient } from "../../api/apiClient.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { jwtDecode } from "jwt-decode";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(""); // Lỗi cho trường hợp không bắt đầu bằng 0
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(""); // Lỗi cho address
  const [provinceError, setProvinceError] = useState(""); // Lỗi cho province
  const [districtError, setDistrictError] = useState(""); // Lỗi cho district
  const [wardError, setWardError] = useState(""); // Lỗi cho ward
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
        console.log("Decoded token in CartPage:", decoded);
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

  const fetchCart = async () => {
    const accountInfo = getAccountInfoFromToken();
    if (accountInfo) {
      setAccountId(accountInfo.id);
      setAccountName(accountInfo.accountName);
    }

    if (!accountInfo?.id) {
      setError("Please log in to view your cart!");
      setLoading(false);
      return;
    }

    try {
      const cartData = await CartService.getCartByAccountId(accountInfo.id);
      setCartId(cartData.cartId);

      const cartProductsWithDetails = await Promise.all(
        cartData.listCartProduct.map(async (item) => {
          const productDetails = await CartService.getProductById(item.productId);
          const quantitySelected = parseInt(item.quantity, 10);
          const quantityRemaining = parseInt(productDetails.quantity, 10);
          const initialQuantity = quantityRemaining + quantitySelected;
          return {
            cartProductId: item.cartProductId,
            id: item.productId,
            name: productDetails.productName,
            price: parseFloat(item.price),
            quantitySelected: quantitySelected,
            quantityRemaining: quantityRemaining,
            initialQuantity: initialQuantity,
            image: productDetails.productImages[0]?.urlImage || "https://via.placeholder.com/100",
          };
        })
      );
      console.log("Cart items:", cartProductsWithDetails);
      setCartItems(cartProductsWithDetails);
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
      console.log("Provinces fetched:", provincesData);
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
      console.log("Districts fetched for provinceId", provinceId, ":", districtsData);
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
      console.log("Wards fetched for districtId", districtId, ":", wardsData);
    } catch (error) {
      toast.error(error.message);
      console.error("Fetch wards error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchProvinces();
    window.addEventListener("storageUpdate", fetchCart);
    return () => {
      window.removeEventListener("storageUpdate", fetchCart);
    };
  }, []);

  const handleIncrease = async (cartProductId, currentQuantity) => {
    const item = cartItems.find((i) => i.cartProductId === cartProductId);
    if (parseInt(item.quantitySelected, 10) < parseInt(item.initialQuantity, 10)) {
      try {
        const updatedQuantity = currentQuantity + 1;
        await CartService.updateProductQuantity(cartId, [
          { cartProductId, quantity: updatedQuantity },
        ]);
        await fetchCart();
        toast.success("Quantity updated!");
        window.dispatchEvent(new Event("storageUpdate"));
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Quantity exceeds available stock!");
    }
  };

  const handleDecrease = async (cartProductId, currentQuantity) => {
    if (currentQuantity > 1) {
      try {
        const updatedQuantity = currentQuantity - 1;
        await CartService.updateProductQuantity(cartId, [
          { cartProductId, quantity: updatedQuantity },
        ]);
        await fetchCart();
        toast.success("Quantity updated!");
        window.dispatchEvent(new Event("storageUpdate"));
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleRemove = async (cartProductId) => {
    try {
      await CartService.removeProductFromCart(cartId, [{ cartProductId }]);
      await fetchCart();
      toast.success("Item removed from cart!");
      window.dispatchEvent(new Event("storageUpdate"));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSelectItem = (cartProductId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [cartProductId]: !prev[cartProductId],
    }));
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems[item.cartProductId])
      .reduce((total, item) => total + item.price * item.quantitySelected, 0);
  };

  const handleCheckout = () => {
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
    if (selectedCount === 0) {
      toast.error("Please select at least one item to checkout!");
      return;
    }
    setShowDeliveryModal(true);
  };

  // Validate phone number
  const validatePhoneNumber = (value) => {
    if (!value) {
      return "Phone number is required.";
    }
    if (!value.startsWith("0")) {
      return "Phone number must start with 0.";
    }
    return "";
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Chỉ cho phép số và tối đa 11 số
    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhone(value);
      const error = validatePhoneNumber(value);
      setPhoneError(error);
    } else if (!/^\d*$/.test(value)) {
      toast.error("Phone number must contain only digits.");
    } else if (value.length > 11) {
      toast.error("Phone number must not exceed 11 digits.");
    }
  };

  // Validate address
  const validateAddress = (value) => {
    if (!value) {
      return "Address is required.";
    }
    if (value.length < 5) {
      return "Address must be at least 5 characters long.";
    }
    if (value.length > 100) {
      return "Address must not exceed 100 characters.";
    }
    // Ngăn các ký tự đặc biệt không mong muốn
    if (/[<>{}!@#$%^&*()+=[\]|\\:;"'?~`]/.test(value)) {
      return "Address contains invalid special characters.";
    }
    return "";
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    const error = validateAddress(value);
    setAddressError(error);
  };

  // Validate province, district, ward
  const validateProvince = (value) => {
    if (!value) {
      return "Please select a province/city.";
    }
    const province = provinces.find((p) => String(p.provinceId) === String(value));
    if (!province) {
      return "Invalid province selected.";
    }
    return "";
  };

  const validateDistrict = (value) => {
    if (!value) {
      return "Please select a district.";
    }
    const district = districts.find((d) => String(d.districtId) === String(value));
    if (!district) {
      return "Invalid district selected.";
    }
    return "";
  };

  const validateWard = (value) => {
    if (!value) {
      return "Please select a ward.";
    }
    const ward = wards.find((w) => String(w.wardCode) === String(value));
    if (!ward) {
      return "Invalid ward selected.";
    }
    return "";
  };

  const handleProvinceChange = (e) => {
    const value = e.target.value;
    setSelectedProvince(value);
    const error = validateProvince(value);
    setProvinceError(error);
    if (value) {
      fetchDistricts(value);
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
      setToDistrictId("");
      setToWardCode("");
      setDistrictError("");
      setWardError("");
    }
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectedDistrict(value);
    const error = validateDistrict(value);
    setDistrictError(error);
    const selected = districts.find((d) => d.districtId === parseInt(value));
    const districtId = selected ? selected.districtId.toString() : "";
    setToDistrictId(districtId);
    if (value) {
      fetchWards(value);
    } else {
      setWards([]);
      setSelectedWard("");
      setToWardCode("");
      setWardError("");
    }
  };

  const handleWardChange = (e) => {
    const value = e.target.value;
    setSelectedWard(value);
    const error = validateWard(value);
    setWardError(error);
    const selected = wards.find((w) => String(w.wardCode) === String(value));
    const wardCode = selected ? String(selected.wardCode) : String(value);
    setToWardCode(wardCode);
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

    // Kiểm tra các trường bắt buộc và hợp lệ
    const phoneErr = validatePhoneNumber(phone);
    const addressErr = validateAddress(address);
    const provinceErr = validateProvince(selectedProvince);
    const districtErr = validateDistrict(selectedDistrict);
    const wardErr = validateWard(selectedWard);

    setPhoneError(phoneErr);
    setAddressError(addressErr);
    setProvinceError(provinceErr);
    setDistrictError(districtErr);
    setWardError(wardErr);

    if (phoneErr || addressErr || provinceErr || districtErr || wardErr || !toWardCode) {
      const errors = [
        phoneErr,
        addressErr,
        provinceErr,
        districtErr,
        wardErr,
        !toWardCode ? "Please fill in all delivery information, including ward!" : "",
      ].filter(Boolean);
      toast.error(errors.join(" "));
      console.error("Validation errors:", errors);
      return;
    }

    console.log("Delivery confirmed:", {
      phone,
      address,
      toDistrictId,
      toWardCode,
    });
    setShowDeliveryModal(false);
    setShowPaymentModal(true);
    setTimeout(() => {
      const paymentModal = document.getElementById("cart-payment-modal");
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
    console.log("Payment method selected:", paymentMethod);
    setShowPaymentModal(false);
    setShowSummaryModal(true);
    setTimeout(() => {
      const summaryModal = document.getElementById("cart-summary-modal");
      if (summaryModal) {
        summaryModal.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const createOrder = async () => {
    const selectedCart = cartItems.filter((item) => selectedItems[item.cartProductId]);
    try {
      const orderData = {
        accountId: accountId,
        address: address,
        phone: phone,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        orderProducts: selectedCart.map((item) => ({
          productId: item.id,
          quantity: item.quantitySelected,
          createDate: new Date().toISOString(),
        })),
      };
      console.log("Order payload:", orderData);
      const response = await apiClient.post("/api/Order", orderData);
      console.log("Order response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create order error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to create order");
    }
  };

  const handleFinalConfirm = async () => {
    const selectedCart = cartItems.filter((item) => selectedItems[item.cartProductId]);
    const totalAmount = calculateTotal();

    if (!accountId) {
      toast.error("Please log in to proceed with payment!");
      return;
    }

    try {
      const orderpaymentId = await createOrder();

      const orderInfo = `Purchase: ${selectedCart
        .map((item) => `${item.name} (${item.quantitySelected})`)
        .join(", ")}`;

      const paymentData = {
        fullName: accountName || "Unknown",
        orderInfo: orderInfo,
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
      console.log("Payment payload:", paymentData);

      let paymentUrl;
      if (paymentMethod === "Momo") {
        paymentUrl = await PaymentService.createMomoPayment(paymentData);
        console.log("Momo payment URL:", paymentUrl);
      } else if (paymentMethod === "VNPay") {
        paymentUrl = await PaymentService.createVnpayPayment(paymentData);
        console.log("VNPay payment URL:", paymentUrl);
      }

      toast.success(`Redirecting to ${paymentMethod} payment...`);
      setTimeout(() => {
        localStorage.setItem("paymentSource", "cart");
        window.location.href = paymentUrl;
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      toast.error(error.message);
      setShowSummaryModal(false);
    }
  };

  const handleBackToPayment = () => {
    setShowSummaryModal(false);
    setShowPaymentModal(true);
    console.log("Back to payment modal");
    setTimeout(() => {
      const paymentModal = document.getId("cart-payment-modal");
      if (paymentModal) {
        paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleBackToDelivery = () => {
    setShowPaymentModal(false);
    setShowDeliveryModal(true);
    console.log("Back to delivery modal");
  };

  const handleCloseModals = () => {
    setShowDeliveryModal(false);
    setShowPaymentModal(false);
    setShowSummaryModal(false);
    setPhone("");
    setPhoneError("");
    setAddress("");
    setAddressError("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setToDistrictId("");
    setToWardCode("");
    setProvinceError("");
    setDistrictError("");
    setWardError("");
    setPaymentMethod(null);
    setDistricts([]);
    setWards([]);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const getProvinceName = (provinceId) => {
    const province = provinces.find((p) => String(p.provinceId) === String(provinceId));
    console.log("getProvinceName:", { provinceId, provinceIdType: typeof provinceId, province });
    return province ? province.provinceName : "N/A";
  };

  const getDistrictName = (districtId) => {
    const district = districts.find((d) => String(d.districtId) === String(districtId));
    console.log("getDistrictName:", { districtId, districtIdType: typeof districtId, district });
    return district ? district.districtName : "N/A";
  };

  const getWardName = (wardCode) => {
    const ward = wards.find((w) => String(w.wardCode) === String(wardCode));
    console.log("getWardName:", { wardCode, wardCodeType: typeof wardCode, ward });
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
        <div className="mt-3">
          <Button variant="primary" onClick={handleLoginRedirect}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page min-vh-100">
      <div className="container py-5">
        {cartItems.length === 0 ? (
          <div className="empty-cart text-center">
            <h3>Your cart is empty</h3>
            <p className="text-muted">Add some souvenirs to get started!</p>
            <Button
              variant="primary"
              href="/souvenirs-shop"
              className="shop-now-btn"
            >
              Shop Now
            </Button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => {
                console.log(
                  `Item: ${item.name}, quantitySelected: ${item.quantitySelected}, initialQuantity (In Stock): ${item.initialQuantity}, disabled: ${item.quantitySelected >= item.initialQuantity}`
                );
                return (
                  <div className="cart-item" key={item.cartProductId}>
                    <Form.Check
                      type="checkbox"
                      checked={!!selectedItems[item.cartProductId]}
                      onChange={() => handleSelectItem(item.cartProductId)}
                      className="me-3"
                    />
                    <div className="item-image">
                      <img src={item.image} alt={item.name} className="img-fluid" />
                    </div>
                    <div className="item-details">
                      <h5 className="item-name">{item.name}</h5>
                      <p className="item-price">{formatPrice(item.price)}</p>
                      <p className="item-stock">In Stock: {item.quantityRemaining}</p>
                    </div>
                    <div className="item-quantity">
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleDecrease(item.cartProductId, item.quantitySelected)}
                        disabled={item.quantitySelected === 1}
                      >
                        -
                      </Button>
                      <span>{item.quantitySelected}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleIncrease(item.cartProductId, item.quantitySelected)}
                        disabled={parseInt(item.quantitySelected, 10) >= parseInt(item.initialQuantity, 10)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="item-total">{formatPrice(item.price * item.quantitySelected)}</div>
                    <Button
                      variant="danger"
                      className="remove-btn"
                      onClick={() => handleRemove(item.cartProductId)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h4>Order Summary</h4>
              <div className="summary-details">
                <p>
                  <strong>Subtotal:</strong> {formatPrice(calculateTotal())}
                </p>
                <p>
                  <strong>Shipping:</strong> Free
                </p>
                <hr />
                <p className="total">
                  <strong>Total:</strong> {formatPrice(calculateTotal())}
                </p>
              </div>
              <Button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}

        <Modal
          show={showDeliveryModal}
          onHide={handleCloseModals}
          centered
          className="cart-delivery-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Delivery Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number (e.g., 01234567890)"
                  value={phone}
                  onChange={handlePhoneChange}
                  isInvalid={!!phoneError}
                />
                {phoneError && (
                  <Form.Text className="text-danger">{phoneError}</Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address (Street, House Number)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter street and house number"
                  value={address}
                  onChange={handleAddressChange}
                  isInvalid={!!addressError}
                />
                {addressError && (
                  <Form.Text className="text-danger">{addressError}</Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Province/City</Form.Label>
                <Form.Select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  isInvalid={!!provinceError}
                >
                  <option value="">Select Province/City</option>
                  {provinces.map((province) => (
                    <option key={province.provinceId} value={province.provinceId}>
                      {province.provinceName}
                    </option>
                  ))}
                </Form.Select>
                {provinceError && (
                  <Form.Text className="text-danger">{provinceError}</Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>District</Form.Label>
                <Form.Select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  disabled={!selectedProvince}
                  isInvalid={!!districtError}
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district.districtId} value={district.districtId}>
                      {district.districtName}
                    </option>
                  ))}
                </Form.Select>
                {districtError && (
                  <Form.Text className="text-danger">{districtError}</Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ward</Form.Label>
                <Form.Select
                  value={selectedWard}
                  onChange={handleWardChange}
                  disabled={!selectedDistrict}
                  isInvalid={!!wardError}
                >
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward.wardCode} value={ward.wardCode}>
                      {ward.wardName}
                    </option>
                  ))}
                </Form.Select>
                {wardError && (
                  <Form.Text className="text-danger">{wardError}</Form.Text>
                )}
              </Form.Group>
              <Button
                className="checkout-btn mt-3"
                onClick={handleDeliveryConfirm}
              >
                Proceed to Payment
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showPaymentModal}
          onHide={handleCloseModals}
          centered
          className="cart-payment-modal"
          id="cart-payment-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Select Payment Method</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                className="checkout-btn mt-3 me-2"
                onClick={handleConfirmPurchase}
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
          </Modal.Body>
        </Modal>

        <Modal
          show={showSummaryModal}
          onHide={handleCloseModals}
          centered
          className="cart-summary-modal"
          id="cart-summary-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Order Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="summary-details">
              <h5>Items</h5>
              {cartItems
                .filter((item) => selectedItems[item.cartProductId])
                .map((item) => (
                  <div
                    key={item.cartProductId}
                    className="summary-item"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <span style={{ marginRight: '0.5rem' }}>
                      {item.name} x {item.quantitySelected},
                    </span>
                    <span>Price: {formatPrice(item.price * item.quantitySelected)}</span>
                  </div>
                ))}
              <hr />
              <div
                className="total"
                style={{ marginBottom: '0.5rem' }}
              >
                <span style={{ marginRight: '0.25rem' }}>Total:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              <h5 className="mt-3">Delivery Information</h5>
              <div
                className="summary-info"
                style={{ marginBottom: '0.5rem' }}
              >
                <span style={{ marginRight: '0.25rem' }}>Phone:</span>
                <span>{phone}</span>
              </div>
              <div
                className="summary-info"
                style={{ marginBottom: '0.5rem' }}
              >
                <span style={{ marginRight: '0.25rem' }}>Address:</span>
                <span>{address}</span>
              </div>
              <div
                className="summary-info"
                style={{ marginBottom: '0.5rem' }}
              >
                <span style={{ marginRight: '0.25rem' }}>Province:</span>
                <span>{getProvinceName(selectedProvince)}</span>
              </div>
              <div
                className="summary-info"
                style={{ marginBottom: '0.5rem' }}
              >
                <span style={{ marginRight: '0.25rem' }}>District:</span>
                <span>{getDistrictName(selectedDistrict)}</span>
              </div>
              <div
                className="summary-info"
                style={{ marginBottom: '0.5rem' }}
              >
                <span style={{ marginRight: '0.25rem' }}>Ward:</span>
                <span>{getWardName(selectedWard)}</span>
              </div>
              <div
                className="summary-info"
                style={{ marginBottom: '0.5rem' }}
              >
                <span style={{ marginRight: '0.25rem' }}>Payment Method:</span>
                <span>{paymentMethod}</span>
              </div>
            </div>
            <div className="summary-actions">
              <Button
                className="checkout-btn me-2"
                onClick={handleFinalConfirm}
              >
                Confirm Purchase
              </Button>
              <Button
                variant="secondary"
                onClick={handleBackToPayment}
              >
                Back
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default CartPage;