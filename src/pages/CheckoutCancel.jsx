import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutCancel = () => {
  return (
    <div className="checkout_cancel">
      <div className="cancel_container text-center py-12 px-4">
        <div className="cancel_icon mb-6">
          <svg viewBox="0 0 24 24" className="w-20 h-20 mx-auto text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-lg mb-8">
          Your checkout process was cancelled. Your cart items are still saved if you wish to complete your purchase later.
        </p>
        
        <div className="buttons space-y-4">
          <Link to="/cart" className="custom_btn block w-full max-w-xs mx-auto">
            Return to Cart
          </Link>
          <Link to="/" className="text-blue-600 hover:underline block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;