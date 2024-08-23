import React from 'react';

const Forbidden: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <img
        src="/assets/png/403.png"
        alt="404 Not Found"
        className="w-1/2 max-w-lg h-auto" 
      />
      <p className="text-lg">You are not authorized to view this page. If you believe you should have access, please contact the system administrator for assistance.</p>
    </div>
  );
};

export default Forbidden;
