import React from 'react';

interface GoogleSignInButtonProps {
  message: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ message }) => {
  const handleSignup = () => {
    window.location.href = 'https://mcartecommerce.online/auth/google';
  };

  return (
    <button 
      onClick={handleSignup} 
      className='w-full bg-hash-black py-2 rounded-md text-black flex justify-center items-center font-semibold'
    >
      <span className='flex items-center text-white'> 
        <img src="/assets/images/google.png" alt="" width='25px' height='auto' className='mr-3'/>
        {message} With Google
      </span>
    </button>
  );
};

export default GoogleSignInButton;