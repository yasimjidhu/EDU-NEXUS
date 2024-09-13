import React from 'react';
import { Loader } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const KycPendingPage = () => {
    const navigate = useNavigate()

    const handleContactNavigation = ()=>{
        navigate('/contact-us')
    }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <Loader className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">
          KYC Verification Pending
        </h1>
        <p className="mt-2 text-gray-600">
          Your KYC verification is currently being processed. Please check back later.
        </p>
        <p className="mt-4 text-gray-500">
          If you have any questions, feel free to contact our support team.
        </p>
        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={handleContactNavigation}>
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default KycPendingPage;