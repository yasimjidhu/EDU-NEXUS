import { Route,Routes } from 'react-router-dom'
import Admin from '../layouts/Admin'
import Courses from '../pages/Admin/Courses'
import Overview from '../pages/Admin/Overview'
import Requests from '../pages/Admin/Requests'
import Categories from '../pages/Admin/Categories'
import Users from '../pages/Admin/Users'


const AdminRouter = () => {
  return (
    <Routes>
        <Route path='/' element={<Admin/>}>
            <Route path='overview' element={<Overview/>}/>
            <Route path='courses' element={<Courses/>}/>
            <Route path='categories' element={<Categories/>}/>
            <Route path='requests' element={<Requests/>}/>
            <Route path='users' element={<Users/>}/>
        </Route>
    </Routes>
  )
}

export default AdminRouter
