import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateTokensForOauthUsers, setUser } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store/store';

const AuthSuccess: React.FC = () => {
  const dispatch:AppDispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthSuccess = async (user: any) => {
      console.log('This is the Google login user:', user);
      dispatch(setUser(user));
      try {
        await dispatch(generateTokensForOauthUsers(user)).unwrap(); // Wait for token generation
        localStorage.setItem('email', user.email);
        navigate('/home');
      } catch (error) {
        console.error('Error generating tokens:', error);
        navigate('/signup'); // Redirect to signup if token generation fails
      }
      localStorage.setItem('email',user.email)
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
