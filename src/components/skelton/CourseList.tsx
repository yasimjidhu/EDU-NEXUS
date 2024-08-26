// components/SkeletonLoader.tsx
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 px-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white text-start rounded-lg p-4 shadow-lg animate-pulse">
          <div className="h-44 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
              <div className="h-4 bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
              <div className="h-4 bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
              <div className="h-4 bg-gray-200 rounded-md"></div>
            </div>
          </div>
          <button className="bg-gray-200 py-1 px-3 rounded-xl mt-4 flex items-center cursor-not-allowed">
            <div className="h-4 bg-gray-200 rounded-md w-24"></div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
