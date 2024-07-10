// PaymentForm.tsx
import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import axiosInstance from '../../constants/axiosInstance';

interface PaymentFormProps {
  amount: number;
  currency: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  onPaymentSuccess:()=>void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, currency, userId, courseId, courseTitle,onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleCheckout = async () => {
    console.log('handle checkout function called',userId)
    const response = await axiosInstance.post('/payments/create', {
      amount,
      currency,
      userId,
      courseId,
      courseTitle
    });
    console.log('response of handlle checkout',handleCheckout)

    const { clientSecret } = response.data;

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      }
    }
  };


  return (
    <button 
      onClick={handleCheckout} 
      className="w-full bg-medium-rose text-white font-bold py-2 px-4 rounded-full hover:bg-strong-rose"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PaymentForm;
