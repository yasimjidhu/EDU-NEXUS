import React from 'react'
import Navbar from '../components/authentication/Navbar'
import { Outlet } from 'react-router-dom'

const Public = () => {
  return (
    <div className='flex h-screen'>
      <div className='flex flex-col flex-grow'>
        <Navbar isAuthenticated={true}/>
        <main className="flex-grow p-4 overflow-auto bg-gray-100 ">
            <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default Public
