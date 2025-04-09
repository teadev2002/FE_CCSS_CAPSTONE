import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/CartPage.scss";
import CartService from "../../services/CartService/CartService";
import PaymentService from "../../services/PaymentService/PaymentService";
import ProductService from "../../services/ProductService/ProductService";
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [cartId, setCartId] = useState(null);
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

  useEffect(() => {
    fetchCart();
    // Lắng nghe sự kiện storageUpdate để cập nhật giỏ hàng
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
    setShowPaymentModal(true);
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
    const selectedCart = cartItems.filter((item) => selectedItems[item.cartProductId]);
    try {
      const orderData = {
        accountId: accountId,
        orderProducts: selectedCart.map((item) => ({
          productId: item.id,
          quantity: item.quantitySelected,
          createDate: new Date().toISOString(),
        })),
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
      console.error("Error checking order status:", error);
      throw new Error("Failed to check order status");
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

      if (paymentMethod === "Momo") {
        const paymentData = {
          fullName: accountName || "Unknown",
          orderInfo: "Cart Checkout",
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
        localStorage.setItem("paymentSource", "cart");
        window.location.href = paymentUrl;

        const intervalId = setInterval(async () => {
          try {
            const status = await checkOrderStatus(orderpaymentId);
            if (status === 1) { // Complete
              clearInterval(intervalId);
              await Promise.all(
                selectedCart.map(async (item) => {
                  const newQuantity = item.initialQuantity - item.quantitySelected;
                  await ProductService.updateProductQuantity(item.id, newQuantity);
                })
              );
              const cartProductIdsToRemove = selectedCart.map((item) => ({
                cartProductId: item.cartProductId,
              }));
              await CartService.removeProductFromCart(cartId, cartProductIdsToRemove);
              toast.success("Payment successful!");
              await fetchCart();
              setSelectedItems({});
              setShowConfirmModal(false);
              window.dispatchEvent(new Event("storageUpdate")); // Thông báo cập nhật
              navigate("/success-payment", { state: { source: "cart" } });
            } else if (status === 2) { // Cancel
              clearInterval(intervalId);
              toast.error("Payment was canceled!");
              setShowConfirmModal(false);
            } else if (status === 0) { // Pending
              // Continue waiting
            }
          } catch (error) {
            clearInterval(intervalId);
            toast.error("Error checking payment status");
            setShowConfirmModal(false);
          }
        }, 5000);

        setTimeout(() => {
          clearInterval(intervalId);
          toast.error("Payment timeout. Please try again.");
          setShowConfirmModal(false);
        }, 120000); // 2 minutes timeout
      } else if (paymentMethod === "VNPay") {
        const paymentData = {
          fullName: accountName || "Unknown",
          orderInfo: "Cart Checkout",
          amount: totalAmount,
          purpose: 3,
          accountId: accountId,
          accountCouponId: null,
          ticketId: "string",
          ticketQuantity: "string",
          contractId: "string",
          orderpaymentId: orderpaymentId,
        };

        const paymentUrl = await PaymentService.createVNPayPayment(paymentData);
        toast.success("Redirecting to VNPay payment...");
        localStorage.setItem("paymentSource", "cart");
        window.location.href = paymentUrl;

        const intervalId = setInterval(async () => {
          try {
            const status = await checkOrderStatus(orderpaymentId);
            if (status === 1) { // Complete
              clearInterval(intervalId);
              await Promise.all(
                selectedCart.map(async (item) => {
                  const newQuantity = item.initialQuantity - item.quantitySelected;
                  await ProductService.updateProductQuantity(item.id, newQuantity);
                })
              );
              const cartProductIdsToRemove = selectedCart.map((item) => ({
                cartProductId: item.cartProductId,
              }));
              await CartService.removeProductFromCart(cartId, cartProductIdsToRemove);
              toast.success("Payment successful with VNPay!");
              await fetchCart();
              setSelectedItems({});
              setShowConfirmModal(false);
              window.dispatchEvent(new Event("storageUpdate")); // Thông báo cập nhật
              navigate("/success-payment", { state: { source: "cart" } });
            } else if (status === 2) { // Cancel
              clearInterval(intervalId);
              toast.error("Payment with VNPay was canceled!");
              setShowConfirmModal(false);
            } else if (status === 0) { // Pending
              // Continue waiting
            }
          } catch (error) {
            clearInterval(intervalId);
            toast.error("Error checking payment status");
            setShowConfirmModal(false);
          }
        }, 5000);

        setTimeout(() => {
          clearInterval(intervalId);
          toast.error("Payment timeout. Please try again.");
          setShowConfirmModal(false);
        }, 120000); // 2 minutes timeout
      }
    } catch (error) {
      toast.error(error.message);
      setShowConfirmModal(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
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

        {showPaymentModal && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Payment Method</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowPaymentModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
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
                  </Form>
                </div>
                <div className="modal-footer">
                  <Button variant="primary" onClick={handleConfirmPurchase}>
                    Confirm Purchase
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Payment</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowConfirmModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to pay {formatPrice(calculateTotal())} with{" "}
                    {paymentMethod}?
                  </p>
                </div>
                <div className="modal-footer">
                  <Button variant="success" onClick={handleFinalConfirm}>
                    Yes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;