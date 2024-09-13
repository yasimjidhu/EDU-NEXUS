import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initiateKYC, checkKYCStatus } from '../../components/redux/slices/kycSlice';
import { AppDispatch, RootState } from '../../components/redux/store/store';

const KYCPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { kycStatus, message, loading, error, verificationUrl } = useSelector((state: RootState) => state.kyc);
    const { user } = useSelector((state: RootState) => state.user);

    // Initiate KYC as soon as the component loads
    useEffect(() => {
        console.log('user is',user)
        if (user && user._id && user.isVerified) {
            dispatch(initiateKYC(user._id));
        }
    }, [dispatch, user]);

    // Check KYC status whenever the user reaches this page
    useEffect(() => {
        if (user && user.verificationSessionId) {
            dispatch(checkKYCStatus(user.verificationSessionId));
        }
    }, [dispatch, user]);

    // Redirect user to verificationUrl after KYC initiation
    useEffect(() => {
        if (verificationUrl) {
            window.location.href = verificationUrl; // Redirect to the KYC verification URL
        }
    }, [verificationUrl]);

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">KYC Verification</h1>

            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {message && <p className="text-center text-green-500">{message}</p>}
            
            <div className="mt-6 text-center">
                {kycStatus && <p className="mt-2 font-semibold">KYC Status: {kycStatus}</p>}
            </div>
            <h1 className='text-center text-md inter'>Please go through the kyc verification to complete the enrollment</h1>
        </div>
    );
};

export default KYCPage;
