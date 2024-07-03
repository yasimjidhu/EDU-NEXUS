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
import Admin from "./layouts/Admin";
import Courses from "./pages/Admin/Courses";
import Overview from "./pages/Admin/Overview";
import Enrollment from "./pages/UserPages/Enrollment";
import StudentRegistration from "./pages/UserPages/StudentRegistration";
import Registration from "./layouts/Registration";
import InstructorRegistration from "./pages/UserPages/InstructorRegistration";
import Requests from "./pages/Admin/Requests";
import Categories from "./pages/Admin/Categories";
import NotVerified from "./pages/UserPages/NotVerified";
// import DetailedInstructor from "./pages/Admin/DetailedInstructor";
import Users from "./pages/Admin/Users";
import Instructor from "./layouts/Instructor";
import AddCourse from "./pages/Instructor/AddCourse";
import MyCourses from "./pages/Instructor/MyCourses";
import AddLesson from "./pages/Instructor/AddLesson";
import CourseDetails from "./pages/Instructor/CourseDetails";
import Student from "./layouts/Student";
import CourseDetail from "./pages/UserPages/CourseDetail";
import UserProfile from "./pages/UserPages/UserProfile";
import InstructorProfile from "./pages/Instructor/InstructorProfile";
import Assessments from "./pages/Instructor/Assessments";
import AddAssessments from "./pages/Instructor/AddAssessments";
import AllCourses from "./pages/UserPages/AllCourses";
import MyCourse from "./pages/UserPages/Mycourses";
import ViewCourse from "./pages/UserPages/ViewCourse";
// import ViewCourse from "./pages/UserPages/ViewCourse";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/forgot-pass-verify-otp"
            element={<OtpVerifyForResetPass />}
          />

          <Route path="/reset-pass" element={<ResetPassword />} />
          <Route path="/enrollment" element={<Enrollment />} />

          <Route path="/register" element={<Registration />}>
            <Route path="student" element={<StudentRegistration />} />
            <Route path="instructor" element={<InstructorRegistration />} />
          </Route>
          <Route path="/notVerified" element={<NotVerified />} />

          <Route path="/admin" element={<Admin />}>
            <Route path="overview" element={<Overview />} />
            <Route path="courses" element={<Courses />} />
            <Route path="course-detail/:id" element={<CourseDetails />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="categories" element={<Categories />} />
            <Route path="requests" element={<Requests />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="/instructor" element={<Instructor />}>
            <Route path="overview" element={<Overview />} />
            <Route path="profile" element={<InstructorProfile />} />
            <Route path="courses" element={<MyCourses />}/>   
            <Route path="add-course" element={<AddCourse />} />
            <Route path="add-lesson" element={<AddLesson />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="add-assessments" element={<AddAssessments />} />
            <Route path="analytics" element={<Categories />} />
            <Route path="requests" element={<Requests />} />
            <Route path="course-detail/:id" element={<CourseDetails />} />
            <Route path="messages" element={<Users />} />
            <Route path="settings" element={<Users />} />
            <Route path="course-details/:id" element={<CourseDetails  />} />
          </Route>

          <Route path="/allcourses" element={<AllCourses />} />
          <Route path="/view-course/:courseId" element={<ViewCourse />} />

          <Route path="/student" element={<Student />}>
            <Route path="profile" element={<UserProfile/>}/>
            <Route path="course-detail/:id" element={<CourseDetail />} />
            <Route path="mycourses" element={<MyCourse />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
