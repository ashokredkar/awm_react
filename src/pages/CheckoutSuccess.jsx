import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyCart } from '../redux/cartSlice';

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Ensure cart is cleared on success page load
    dispatch(emptyCart());
  }, [dispatch]);

  return (
    <div className="checkout_success">
      <div className="success_container text-center py-12 px-4">
        <div className="success_icon mb-6">
          <svg viewBox="0 0 24 24" className="success_icon-img" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h4>Payment Successful!</h4>
        <p className="text-lg mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="buttons space-y-4">
          <Link to="/" className="custom_btn block w-full max-w-xs mx-auto">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;