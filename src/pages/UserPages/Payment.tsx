// PaymentPage.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaymentForm from '../../components/payment/paymentForm';
import { Elements } from '@stripe/react-stripe-js';

const stripe_publishable_key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = loadStripe(stripe_publishable_key);

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const { courseTitle, amount, currency, userId } = location.state as {
    courseTitle: string;
    amount: number;
    currency: string;
    userId: string;
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment successful! You're now enrolled in the course.");
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Purchase</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-4">
          <span>Course:</span>
          <span className="font-medium">{courseTitle}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Price:</span>
          <span className="font-medium">₹{amount}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>₹{amount}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={amount}
            currency={currency}
            userId={userId}
            courseId={courseId || ''}
            courseTitle={courseTitle}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
