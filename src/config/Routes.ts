const routes = {
    ROOT: "/",
    LOGIN: "/login",
    HOME: "/home",
    VERIFY_OTP: "/verify-otp",
    GOOGLE_CALLBACK: "/auth/google/callback",
    AUTH_SUCCESS:"/auth-success",
    FORGOT_PASSWORD: "/forgot-password",
    FORGOT_PASS_VERIFY_OTP: "/forgot-pass-verify-otp",
    RESET_PASS: "/reset-pass",
    ENROLLMENT: "/enrollment",
    NOT_VERIFIED: "/notVerified",
    ADMIN: {
      ROOT: "/admin",
      OVERVIEW: "/admin/overview",
      COURSES: "/admin/courses",
      COURSE_DETAIL: "/admin/course-detail/:id",
      ASSESSMENTS: "/admin/assessments",
      CATEGORIES: "/admin/categories",
      REQUESTS: "/admin/requests",
      USERS: "/admin/users",
    },
    INSTRUCTOR: {
      ROOT: "/instructor",
      OVERVIEW: "/instructor/overview",
      PROFILE: "/instructor/profile",
      COURSES: "/instructor/courses",
      ADD_COURSE: "/instructor/add-course",
      ADD_LESSON: "/instructor/add-lesson",
      ASSESSMENTS: "/instructor/assessments",
      ADD_ASSESSMENTS: "/instructor/add-assessments",
      ANALYTICS: "/instructor/analytics",
      REQUESTS: "/instructor/requests",
      COURSE_DETAIL: "/instructor/course-detail/:id",
      CHAT: "/instructor/chat",
      SETTINGS: "/instructor/settings",
    },
    STUDENT: {
      ROOT: "/student",
      PROFILE: "/student/profile",
      COURSE_DETAIL: "/student/course-detail/:id",
      MY_COURSES: "/student/mycourses",
      CHAT:"/student/chat"
    },
    PUBLIC: {
      ROOT: "/",
      ALL_COURSES: "/allcourses",
      ALL_CATEGORIES: "/allcategories",
      VIEW_COURSE: "/view-course/:courseId",
      VIEW_CATEGORY: "/viewcategory/:categoryId",
      COURSE_DETAIL: "/course-detail/:id",
      SUCCESS:"/success",
      CANCELLED:"/cancel",
      FAILED:"/failure"
    },
    REGISTRATION: {
      ROOT: "/register",
      STUDENT: "/register/student",
      INSTRUCTOR: "/register/instructor",
    },
  };
  
  export default routes;
  