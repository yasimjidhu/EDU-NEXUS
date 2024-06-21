import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Admin/Sidebar'
import Navbar from '../components/Admin/Navbar'

const Admin = () => {
  return (
    <div className="flex h-screen">
      <Sidebar isActive={true} />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <main className="flex-grow p-4 overflow-auto bg-gray-100">
          <Outlet />
        </main>
        {/* <footer className="p-4 bg-white shadow-md">
          <p className="text-center text-gray-600">Admin Footer</p>
        </footer> */}
      </div>
    </div>
  );
};


export default Admin
