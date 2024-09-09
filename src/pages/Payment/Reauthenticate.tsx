import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createAccountLink } from '../../components/redux/slices/paymentSlice';
import { RootState } from '../../components/redux/store/store';

const Reauthenticate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user} = useSelector((state:RootState)=>state.user)

  useEffect(() => {
    handleReauthentication();
  }, []);

  const handleReauthentication = async () => {
      if(!user)return;
      try {console.log('user in reauthencitate',user)
      const instructorId =user._id 
      const email = user.email  
      console.log('instructor id and email in re-authenticate',instructorId,email)
      const response = await dispatch(createAccountLink({ instructorId, email }));
      window.location.href = response.payload.url; // Redirect to the account link
    } catch (error) {
      toast.error('Failed to start the onboarding process. Please try again.');
      console.error(error);
    }
  };

   return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Reauthentication Required</h1>
      <p className="text-lg text-gray-600 text-center mb-6">
        Your session has expired or you need to restart the onboarding process.
      </p>
      <button
        className="px-6 py-2 text-white bg-medium-rose rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-strong-rose focus:outline-none focus:ring-2  focus:ring-opacity-50"
        onClick={handleReauthentication}
      >
        Retry Onboarding
      </button>
    </div>
  );
};

export default Reauthenticate;
