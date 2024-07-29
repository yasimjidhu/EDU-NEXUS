// AuthSuccess.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setUser } from '../redux/slices/authSlice';

const AuthSuccess: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userString = params.get('user');
    
    if (userString) {
      const user = JSON.parse(decodeURIComponent(userString));
      console.log('this is the google login user',user)
      dispatch(setUser(user));
      navigate('/home'); // or wherever you want to redirect after successful login
    }
  }, [dispatch, navigate, location]);

  return <div>Authenticating...</div>;
};

export default AuthSuccess;