import React, { useMemo, useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import { useSelector, useDispatch } from "react-redux";
import { setCartFromStorage, emptyCart } from "../redux/cartSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import emptyCartImg from "../images/empty-cart.jpg";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe - replace with your publishable key
const stripePromise = loadStripe("pk_test_51MgU4YSCZDwYFEVOL78hnRImX4fndMO5GO8JTI0IVJxGivngE2azshTFLlPXewd3sckyAioyIpW5ovWVROVa4jqA00TL5cC618");

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = useSelector((state) => state.cart.items);
    
    const subTotal = useMemo(() => {
        return cartItems.reduce((total, val) => total + Number(val.price || 0), 0);
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
    
        // Handle payment status from URL parameters
        const query = new URLSearchParams(location.search);
        const paymentStatus = query.get('payment_status');
    
        if (paymentStatus === 'success') {
            dispatch(emptyCart()); // Clear cart
            localStorage.removeItem("cartItems"); // Ensure localStorage is cleared
            setTimeout(() => {
                navigate('/checkout/success', { replace: true }); // Navigate to success page
            }, 500); // Delay to allow cart state update
        } else if (paymentStatus === 'cancelled') {
            navigate('/checkout/cancel', { replace: true });
        }
    }, [dispatch, navigate, location.search]);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            // Format cart items for Stripe
            const lineItems = cartItems.map(item => {
                // let imageUrl = item.prodImage.startsWith('http') 
                //     ? item.prodImage 
                //     : `${window.location.origin}${item.prodImage.startsWith('/') ? '' : '/'}${item.prodImage}`;
            
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.title || 'Product',
                            description: item.desc?.substring(0, 255) || '',
                            // images: imageUrl ? [imageUrl] : [emptyCartImg],
                        },
                        unit_amount: Math.round(Number(item.price || 0) / (item.quantity || 1) * 100), // Fix: Ensure unit price
                    },
                    quantity: item.quantity || 1, // Ensure correct quantity is sent
                };
            });
            

            // Create checkout session with absolute URLs
            const response = await fetch("http://localhost:5000/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    lineItems,
                    success_url: `${window.location.origin}/#/checkout/success`,
                    cancel_url: `${window.location.origin}/#/cart?payment_status=cancelled`
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}. ${errorData.error || ''}`);
            }

            const { sessionId } = await response.json();
            
            // Redirect to Stripe checkout
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId });
            
            if (error) {
                console.error("Stripe checkout error:", error);
                throw new Error(error.message);
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert(`Payment error: ${error.message}. Please try again.`);
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
                    <h3>&#8377;{Number(subTotal).toFixed(2)}</h3>
                    </div>
                    <p>
                    The subtotal reflects the total price of your order, including
                    duties and taxes, before any applicable discounts. It does not
                    include delivery costs and international transaction fees.
                    </p>
                </div>
                <button className="custom_btn" onClick={handleCheckout} disabled={loading}>
                    Checkout with Stripe
                    {loading && <svg className="spinner_btn" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                    </svg>}
                </button>
                </div>
            </div>
            </>
        ) : (
            <div className="empty_cart_div">
            <img
                src={emptyCartImg}
                alt="Empty Cart"
                style={{ width: "50%" }}
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