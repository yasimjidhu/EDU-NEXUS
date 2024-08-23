import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <img
        src="/assets/png/404.png"
        alt="404 Not Found"
        className="w-1/2 max-w-lg h-auto" 
      />
      <p className="text-lg">The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
