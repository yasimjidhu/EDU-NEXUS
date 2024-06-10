import "./App.css";
import SignupPage from "./pages/AuthPages/Signup";
import LoginPage from "./pages/AuthPages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OtpVerify from "./pages/AuthPages/OtpVerify";
import GoogleCallback from "./components/authentication/GoogleCallback";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import OtpVerifyForResetPass from "./pages/AuthPages/OtpVerifyForResetPass";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import Home from "./pages/UserPages/Home";
import Sidebar from "./components/Admin/Sidebar";
import Admin from "./layouts/Admin";
import Courses from "./pages/Admin/Courses";
import Assessments from "./pages/Admin/Assessments";
import Categories from "./pages/Admin/Categories";
import Overview from "./pages/Admin/Overview";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/auth/google/callback" element={<GoogleCallback/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/forgot-pass-verify-otp" element={<OtpVerifyForResetPass/>}/>
          <Route path="/reset-pass" element={<ResetPassword/>}/>

            <Route path="/admin" element={<Admin/>}>
              <Route path="overview" element={<Overview/>}/>
              <Route path="courses" element={<Courses/>}/>
              <Route path="assessments" element={<Assessments/>}/> 
              <Route path="categories" element={<Categories/>}/> 
            </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
