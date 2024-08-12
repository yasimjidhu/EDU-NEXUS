import React from 'react';
import Sidebar from '../components/Instructor/Sidebar';
import Navbar from '../components/Instructor/Navbar';
import { Outlet } from 'react-router-dom';

const Instructor = () => {
  return (
    <div className='flex h-screen'>
      <Sidebar className="w-52 fixed h-full" />
      <div className='flex flex-col flex-grow ml-52'>
        <Navbar />
        <main className="flex-grow p-4 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Instructor;