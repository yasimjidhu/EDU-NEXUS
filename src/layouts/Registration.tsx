
import Navbar from '../components/authentication/Navbar'
import { Outlet } from 'react-router-dom'

const Registration = () => {
  return (
    <div>
      <header>

      </header>
      <nav>
        <Navbar isAuthenticated={true}/>
      </nav>
      <main>
        <Outlet/>
      </main>
      <footer>
        
      </footer>
    </div>
  )
}

export default Registration
