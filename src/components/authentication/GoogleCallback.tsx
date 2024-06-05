import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Save the token to local storage or state management
      localStorage.setItem('authToken', token);

      // Redirect to a protected route or home page
      navigate('/home');
    } else {
      // Handle error or redirection
      navigate('/');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
