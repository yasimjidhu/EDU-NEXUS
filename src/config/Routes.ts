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
      FEEDBACKS: "/admin/feedbacks",
      TRANSACTIONS: "/admin/transactions",
      REQUESTS: "/admin/requests",
      USERS: "/admin/users",
    },
    INSTRUCTOR: {
      ROOT: "/instructor",
      OVERVIEW: "/instructor/overview",
      ANALYTICS: "/instructor/analytics",
      PROFILE: "/instructor/profile",
      COURSES: "/instructor/courses",
      ADD_COURSE: "/instructor/add-course",
      ADD_LESSON: "/instructor/add-lesson",
      ASSESSMENTS: "/instructor/assessments",
      ADD_ASSESSMENTS: "/instructor/add-assessments",
      REQUESTS: "/instructor/requests",
      COURSE_DETAIL: "/instructor/course-detail/:id",
      CHAT: "/instructor/chat",
      CHATGROUP:"/instructor/group",
    },
    STUDENT: {
      ROOT: "/student",
      PROFILE: "/student/profile",
      OVERVIEW: "/student/overview",
      COURSE_DETAIL: "/student/course-detail/:id",
      MY_COURSES: "/student/mycourses",
      CHAT:"/student/chat"
    },
    PUBLIC: {
      ROOT: "/",
      ABOUT_US:'/about-us',
      CONTACT_US:'/contact-us',
      ALL_COURSES: "/allcourses",
      ALL_CATEGORIES: "/allcategories",
      VIEW_COURSE: "/view-course/:courseId",
      VIEW_CATEGORY: "/viewcategory/:categoryId",
      COURSE_DETAIL: "/course-detail/:id",
      SETTINGS: "/settings",
      SUCCESS:"/success",
      CANCELLED:"/cancel",
      FAILED:"/failure"
    },
    REGISTRATION: {
      ROOT: "/register",
      STUDENT: "/register/student",
      INSTRUCTOR: "/register/instructor",
    },
    RESTRICTED:{
      NOTFOUND:'*',
      FORBIDDEN:'/forbidden'
    }
  };
  
  export default routes;
  