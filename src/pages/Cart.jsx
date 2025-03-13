import React, { useMemo, useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import { useSelector, useDispatch } from "react-redux";
import { setCartFromStorage } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import emptyCart from "../images/empty-cart.jpg"

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    
    const subTotal = useMemo(() => {
        return cartItems.reduce((total, val) => total + Number(val.price), 0);
    }, [cartItems]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            dispatch(setCartFromStorage(JSON.parse(storedCart)));
        }
        setLoading(false);
        }
    }, [dispatch]);

    const handlePayment = async () => {
        setLoading(true);
        try {
        // Transform cart items to include full URLs for images
        const transformedCartItems = cartItems.map((item) => ({
            ...item,
            thumbnail: item.thumbnail.startsWith("http")
            ? item.thumbnail
            : `${window.location.origin}${item.thumbnail}`,
        }));

        const response = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItems: transformedCartItems }),
        });

        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        window.location.href = data.url;
        } catch (error) {
        console.error("Payment error:", error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="cart_page">
        {cartItems.length > 0 ? (
            <>
            <h2>Shopping Cart</h2>
            <div className="cart_container">
                <div className="cart_items">
                <h3>Cart Items</h3>
                {cartItems.map((cartItem) => (
                    <CartItem key={cartItem.id} item={cartItem} />
                ))}
                </div>

                <div className="cart_summary">
                <h3>Summary</h3>
                <div className="subtotal_div">
                    <div className="flex justify-between">
                    <h3>Subtotal</h3>
                    <h3>&#8377;{Number(subTotal)}</h3>
                    </div>
                    <p>
                    The subtotal reflects the total price of your order, including
                    duties and taxes, before any applicable discounts. It does not
                    include delivery costs and international transaction fees.
                    </p>
                </div>
                <button className="custom_btn" onClick={handlePayment} disabled={loading}>
                    Checkout
                    {loading && <svg class="spinner_btn" viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                    </svg>}
                </button>
                </div>
            </div>
            </>
        ) : (
            <div className="empty_cart_div">
            <img
                src={emptyCart}
                alt="Empty Cart"
            />
            <h4>Your cart is empty</h4>
            <span>
                Looks like you have not added anything in your cart.
                <br />
                Go ahead and explore top categories.
            </span>
            <Link
                to="/"
                className="custom_btn"
            >
                Continue Shopping
            </Link>
            </div>
        )}
        </div>
    );
};

export default Cart;
