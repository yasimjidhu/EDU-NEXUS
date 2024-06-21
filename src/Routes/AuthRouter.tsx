import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignupPage from '../pages/AuthPages/Signup';
import LoginPage from '../pages/AuthPages/Login';
import OtpVerify from '../pages/AuthPages/OtpVerify';
import GoogleCallback from '../components/authentication/GoogleCallback';
import ForgotPassword from '../pages/AuthPages/ForgotPassword';
import OtpVerifyForResetPass from '../pages/AuthPages/OtpVerifyForResetPass';
import ResetPassword from '../pages/AuthPages/ResetPassword';

const AuthRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/verify-otp' element={<OtpVerify />} />
      <Route path='/auth/google/callback' element={<GoogleCallback />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/forgot-pass-verify-otp' element={<OtpVerifyForResetPass />} />
      <Route path='/reset-pass' element={<ResetPassword />} />
    </Routes>
  );
};

export default AuthRouter;
