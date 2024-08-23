import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store/store";

// Define the types for the props
interface PrivateRouteProps {
  roles?: string[]; // Optional array of roles that can access the route
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user; // Ensure user exists to be considered authenticated

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/forbidden" />; // Redirect to home or any other page if role does not match
  }

  return <Outlet />; // Render child routes if authenticated and authorized
};

export default PrivateRoute;
