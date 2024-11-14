import  { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { completePurchase } from '../../components/redux/slices/paymentSlice';
import { CheckCircle, XCircle } from 'lucide-react';
import { AppDispatch } from '../../components/redux/store/store';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch:AppDispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isActionDispatched, setIsActionDispatched] = useState(false); // Add a flag

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId && !isActionDispatched) { // Check the flag
      console.log('session id in the query params', sessionId);
      handlePaymentSuccess(sessionId);
      setIsActionDispatched(true); // Set flag to true
    } else if (!sessionId) {
      toast.error('No session ID found. Cannot verify payment.');
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [searchParams, isActionDispatched]); // Dependency array

  const handlePaymentSuccess =  useCallback(async(sessionId: string) => { 
    try {
      const response = await dispatch(completePurchase({ sessionId }));
      console.log('response of handlepayment', response);
      if (response.payload.success) {
        setIsSuccess(true);
        toast.success('Payment successful and enrolled in the course!');
        setTimeout(() => navigate('/student/mycourses'), 3000);
      } else {
        setIsSuccess(false);
        toast.error('Failed to complete enrollment. Please contact support.');
        setTimeout(() => navigate('/home'), 3000);
      }
    } catch (error) {
      console.error('Error completing purchase:', error);
      setIsSuccess(false);
      toast.error('An error occurred while finalizing your enrollment.');
      setTimeout(() => navigate('/home'), 3000);
    } finally {
      setIsLoading(false);
    }
  },[dispatch,navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {isLoading ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Processing your payment...</h1>
            <div className="animate-pulse flex space-x-4 justify-center">
              <div className="rounded-full bg-blue-400 h-3 w-3"></div>
              <div className="rounded-full bg-blue-400 h-3 w-3"></div>
              <div className="rounded-full bg-blue-400 h-3 w-3"></div>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">You've been enrolled in the course.</p>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-4">There was an issue with your payment. Please try again or contact support.</p>
            <button 
              onClick={() => navigate('/home')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
