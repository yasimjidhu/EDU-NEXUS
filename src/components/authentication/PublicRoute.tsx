import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store/store";


interface PublicRouteProps {
  restricted?: boolean; // If true, redirect authenticated users away from this route
}

const PublicRoute: React.FC<PublicRouteProps> = ({ restricted }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!user; // Check if the user is authenticated

  if (isAuthenticated && restricted) {
    return <Navigate to="/home" />; // Redirect to a different page if authenticated
  }

  return <Outlet />; // Render the route's children if not restricted
};

export default PublicRoute;
