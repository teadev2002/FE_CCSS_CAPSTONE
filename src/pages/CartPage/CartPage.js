import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button, Form } from "react-bootstrap";
import "../../styles/CartPage.scss";
import CartService from "../../services/CartService/CartService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const navigate = useNavigate();

  const getAccountIdFromToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        console.log("Decoded token in CartPage:", decoded);
        return decoded?.Id;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  const fetchCart = async () => {
    const fetchedAccountId = getAccountIdFromToken();
    setAccountId(fetchedAccountId);

    if (!fetchedAccountId) {
      setError("Please log in to view your cart!");
      setLoading(false);
      return;
    }

    try {
      const cartData = await CartService.getCartByAccountId(fetchedAccountId);
      setCartId(cartData.cartId);

      const cartProductsWithDetails = await Promise.all(
        cartData.listCartProduct.map(async (item) => {
          const productDetails = await CartService.getProductById(item.productId);
          return {
            cartProductId: item.cartProductId,
            id: item.productId,
            name: productDetails.productName,
            price: item.price,
            quantitySelected: item.quantity,
            quantity: productDetails.quantity,
            image: productDetails.productImages[0]?.urlImage || "https://via.placeholder.com/100",
          };
        })
      );
      setCartItems(cartProductsWithDetails);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleIncrease = async (cartProductId, currentQuantity) => {
    const item = cartItems.find((i) => i.cartProductId === cartProductId);
    if (item.quantitySelected < item.quantity) {
      try {
        const updatedQuantity = currentQuantity + 1;
        await CartService.updateProductQuantity(cartId, [
          { cartProductId, quantity: updatedQuantity },
        ]);
        await fetchCart(); // Đồng bộ lại dữ liệu từ backend
        toast.success("Quantity updated!");
        window.dispatchEvent(new Event("storage"));
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
        await fetchCart(); // Đồng bộ lại dữ liệu từ backend
        toast.success("Quantity updated!");
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleRemove = async (cartProductId) => {
    try {
      await CartService.removeProductFromCart(cartId, [{ cartProductId }]);
      await fetchCart(); // Đồng bộ lại dữ liệu từ backend
      toast.success("Item removed from cart!");
      window.dispatchEvent(new Event("storage"));
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

  const handleFinalConfirm = async () => {
    const selectedCart = cartItems.filter((item) => selectedItems[item.cartProductId]);
    toast.success(
      `Purchase confirmed with ${paymentMethod} for ${selectedCart.length} item(s)!`
    );
    setCartItems(cartItems.filter((item) => !selectedItems[item.cartProductId]));
    setSelectedItems({});
    setShowConfirmModal(false);
    await fetchCart(); // Đồng bộ lại sau khi mua
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
              {cartItems.map((item) => (
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
                    <p className="item-price">${item.price}</p>
                    <p className="item-stock">In Stock: {item.quantity}</p>
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
                      disabled={item.quantitySelected >= item.quantity}
                    >
                      +
                    </Button>
                  </div>
                  <div className="item-total">${item.price * item.quantitySelected}</div>
                  <Button
                    variant="danger"
                    className="remove-btn"
                    onClick={() => handleRemove(item.cartProductId)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h4>Order Summary</h4>
              <div className="summary-details">
                <p>
                  <strong>Subtotal:</strong> ${calculateTotal()}
                </p>
                <p>
                  <strong>Shipping:</strong> Free
                </p>
                <hr />
                <p className="total">
                  <strong>Total:</strong> ${calculateTotal()}
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
                    Are you sure you want to pay ${calculateTotal()} with{" "}
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