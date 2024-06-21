// StudentRouter.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/UserPages/Home';
import Enrollment from '../pages/UserPages/Enrollment';
import StudentRegistration from '../pages/UserPages/StudentRegistration';

const StudentRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="enrollment" element={<Enrollment />} />
      <Route path="register/student" element={<StudentRegistration />} />
    </Routes>
  );
};

export default StudentRouter;
