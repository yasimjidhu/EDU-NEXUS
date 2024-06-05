
import React from 'react';

const GoogleSignInButton = ({message}:any) => {
  const handleSignup = ()=>{
    window.location.href = 'http://localhost:3001/auth/google'
  }

  return (
    <button onClick={handleSignup} className='w-full bg-gray-500 py-2 rounded-md text-black flex justify-center items-center font-semibold'>
    <span className='flex items-center text-white'> 
      <img src="/assets/images/google.png" alt="" width='30px' height='auto' className='mr-3'/>
      {message} With Google
    </span>
  </button>
  
  );
};

export default GoogleSignInButton;
