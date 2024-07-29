import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./config/Routes";
import SignupPage from "./pages/AuthPages/Signup";
import LoginPage from "./pages/AuthPages/Login";
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
import Public from "./layouts/Public";
import AllCategories from "./pages/UserPages/AllCategories";
import ViewCategory from "./pages/UserPages/ViewCategory";
import ChatUI from "./pages/Chat/UserChat";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import AuthSuccess from "./components/authentication/AuthSuccess";


function App() {
  return (
    <Router>
      <Routes>

        <Route path={routes.ROOT} element={<SignupPage />} />
        <Route path={routes.LOGIN} element={<LoginPage />} />
        <Route path={routes.HOME} element={<Home />} />
        <Route path={routes.VERIFY_OTP} element={<OtpVerify />} />
        <Route path={routes.GOOGLE_CALLBACK} element={<GoogleCallback />} />
        <Route path={routes.AUTH_SUCCESS} element={<AuthSuccess/>}/>
        <Route path={routes.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={routes.FORGOT_PASS_VERIFY_OTP}element={<OtpVerifyForResetPass />}/>
        <Route path={routes.RESET_PASS} element={<ResetPassword />} />
        <Route path={routes.ENROLLMENT} element={<Enrollment />} />
        <Route path={routes.NOT_VERIFIED} element={<NotVerified />} />

        <Route path={routes.REGISTRATION.ROOT} element={<Registration />}>
          <Route path={routes.REGISTRATION.STUDENT} element={<StudentRegistration />} />
          <Route path={routes.REGISTRATION.INSTRUCTOR} element={<InstructorRegistration />} />
        </Route>

        <Route path={routes.ADMIN.ROOT} element={<Admin />}>
          <Route path={routes.ADMIN.OVERVIEW} element={<Overview />} />
          <Route path={routes.ADMIN.COURSES} element={<Courses />} />
          <Route path={routes.ADMIN.COURSE_DETAIL} element={<CourseDetails />} />
          <Route path={routes.ADMIN.ASSESSMENTS} element={<Assessments />} />
          <Route path={routes.ADMIN.CATEGORIES} element={<Categories />} />
          <Route path={routes.ADMIN.REQUESTS} element={<Requests />} />
          <Route path={routes.ADMIN.USERS} element={<Users />} />
        </Route>

        <Route path={routes.INSTRUCTOR.ROOT} element={<Instructor />}>
          <Route path={routes.INSTRUCTOR.OVERVIEW} element={<Overview />} />
          <Route path={routes.INSTRUCTOR.PROFILE} element={<InstructorProfile />} />
          <Route path={routes.INSTRUCTOR.COURSES} element={<MyCourses />} />
          <Route path={routes.INSTRUCTOR.ADD_COURSE} element={<AddCourse />} />
          <Route path={routes.INSTRUCTOR.ADD_LESSON} element={<AddLesson />} />
          <Route path={routes.INSTRUCTOR.ASSESSMENTS} element={<Assessments />} />
          <Route path={routes.INSTRUCTOR.ADD_ASSESSMENTS} element={<AddAssessments />} />
          <Route path={routes.INSTRUCTOR.ANALYTICS} element={<Categories />} />
          <Route path={routes.INSTRUCTOR.REQUESTS} element={<Requests />} />
          <Route path={routes.INSTRUCTOR.COURSE_DETAIL} element={<CourseDetails />} />
          <Route path={routes.INSTRUCTOR.MESSAGES} element={<Users />} />
          <Route path={routes.INSTRUCTOR.SETTINGS} element={<Users />} />
        </Route>

        <Route path={routes.PUBLIC.ROOT} element={<Public />}>
          <Route path={routes.PUBLIC.ALL_COURSES} element={<AllCourses />} />
          <Route path={routes.PUBLIC.ALL_CATEGORIES} element={<AllCategories />} />
          <Route path={routes.PUBLIC.VIEW_COURSE} element={<ViewCourse />} />
          <Route path={routes.PUBLIC.VIEW_CATEGORY} element={<ViewCategory />} />
          <Route path={routes.PUBLIC.COURSE_DETAIL} element={<CourseDetail />} />
          <Route path={routes.PUBLIC.SUCCESS} element={<PaymentSuccess/>}/>
        </Route>

        <Route path={routes.STUDENT.ROOT} element={<Student />}>
          <Route path={routes.STUDENT.PROFILE} element={<UserProfile />} />
          <Route path={routes.STUDENT.MY_COURSES} element={<MyCourse />} />
          <Route path={routes.STUDENT.CHAT} element={<ChatUI/>}/>
        </Route>
          
      </Routes>
    </Router>
  );
}

export default App;
