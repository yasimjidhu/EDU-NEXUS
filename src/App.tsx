import "./App.css";
import SignupPage from "./pages/AuthPages/Signup";
import LoginPage from "./pages/AuthPages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OtpVerify from "./pages/AuthPages/OtpVerify";
import Home from "./pages/HomePage/Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
