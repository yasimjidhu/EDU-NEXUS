import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Admin/Sidebar'
import Navbar from '../components/Admin/Navbar'

const Admin = () => {
  return (
    <div>
      <header>
        <Sidebar isActive={true}/>
      </header>
      <nav>
        <Navbar/>
      </nav>
      <main>
        <Outlet/>
      </main>
      <footer>
        <p>Admin Footer</p>
      </footer>
    </div>
  )
}

export default Admin
