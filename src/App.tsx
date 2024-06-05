import "./App.css";
import SignupPage from "./pages/AuthPages/Signup";
import LoginPage from "./pages/AuthPages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OtpVerify from "./pages/AuthPages/OtpVerify";
import Home from "./pages/HomePage/Home";
import GoogleCallback from "./components/authentication/GoogleCallback";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import OtpVerifyForResetPass from "./pages/AuthPages/OtpVerifyForResetPass";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/auth/google/callback" element={<GoogleCallback/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/forgot-pass-verify-otp" element={<OtpVerifyForResetPass/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
