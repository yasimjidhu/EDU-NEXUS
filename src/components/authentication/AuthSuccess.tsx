import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setUser } from '../redux/slices/authSlice';

const AuthSuccess: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthSuccess = (user: any) => {
      console.log('This is the Google login user:', user);
      dispatch(setUser(user));
      navigate('/home');
    };

    // Check for user data in URL parameters
    const searchParams = new URLSearchParams(location.search);
    const userString = searchParams.get('user');
    if (userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        handleAuthSuccess(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/signup'); // Redirect to signup page if there's an error
      }
    } else {
      navigate('/signup'); // Redirect to signup page if no user data is found
    }
  }, [dispatch, navigate, location]);

  return <div>Authenticating...</div>;
};

export default AuthSuccess;
