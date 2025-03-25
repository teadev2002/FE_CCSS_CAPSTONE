import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button, Form } from "react-bootstrap";
import "../../styles/CartPage.scss";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Souvenir Mug", price: 15, quantity: 2, image: "https://via.placeholder.com/100" },
        { id: 2, name: "Handmade Keychain", price: 10, quantity: 1, image: "https://via.placeholder.com/100" },
    ]);

    const handleIncrease = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecrease = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const handleRemove = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        alert("Proceeding to checkout with total: $" + calculateTotal());
    };

    return (
        <div className="cart-page min-vh-100">
            {/* Hero Section - Copy từ SouvenirsPage, chỉ đổi title */}
            {/* <div className="hero-section text-white py-5">
                <div className="container">
                    <h1 className="display-4 fw-bold text-center">Your Cart</h1>
                    <p className="lead text-center mt-3">
                        Review and manage your selected souvenirs
                    </p>
                </div>
            </div> */}

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
                                <div className="cart-item" key={item.id}>
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} className="img-fluid" />
                                    </div>
                                    <div className="item-details">
                                        <h5 className="item-name">{item.name}</h5>
                                        <p className="item-price">${item.price}</p>
                                    </div>
                                    <div className="item-quantity">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => handleDecrease(item.id)}
                                            disabled={item.quantity === 1}
                                        >
                                            -
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => handleIncrease(item.id)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <div className="item-total">
                                        ${item.price * item.quantity}
                                    </div>
                                    <Button
                                        variant="danger"
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.id)}
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
                            <Button
                                className="checkout-btn"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;