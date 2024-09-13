import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store/store";

interface PrivateRouteProps {
  roles?: string[]; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userData = useSelector((state:RootState)=>state.user)

  const isAuthenticated = !!user;
  const isKycVerified = userData.user?.verificationStatus == 'verified' 
  ;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/forbidden" />; 
  }

  if(!isKycVerified && user?.role !== 'admin'){
    return <Navigate to="/verification-pending" />;
  }

  return <Outlet />; 
};

export default PrivateRoute;
