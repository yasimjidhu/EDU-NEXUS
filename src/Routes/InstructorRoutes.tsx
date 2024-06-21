// InstructorRouter.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/UserPages/Home';
import Enrollment from '../pages/UserPages/Enrollment';
import Registration from '../layouts/Registration';
import InstructorRegistration from '../pages/UserPages/InstructorRegistration';
import NotVerified from '../pages/UserPages/NotVerified';

const InstructorRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="enrollment" element={<Enrollment />} />
      <Route path="notVerified" element={<NotVerified />} />
      <Route path="register/instructor" element={<InstructorRegistration />} />
    </Routes>
  );
};

export default InstructorRouter;
