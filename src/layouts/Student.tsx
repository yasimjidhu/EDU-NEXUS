import React from 'react'

import Navbar from '../components/Instructor/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/student/Sidebar'

const Student = () => {
  return (
    <div className='flex h-screen'>
      <Sidebar/>
      <div className='flex flex-col flex-grow'>
        <Navbar/>
        <main className="flex-grow p-4 overflow-auto bg-gray-100 ml-52">
            <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default Student
