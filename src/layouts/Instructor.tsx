
import Sidebar from '../components/Instructor/Sidebar'
import Navbar from '../components/Instructor/Navbar'
import { Outlet } from 'react-router-dom'

const Instructor = () => {
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

export default Instructor
