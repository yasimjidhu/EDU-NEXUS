// components/SkeletonLoader.tsx
import React from 'react';

const CourseDetailsSkelton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Course Section */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-pulse">
            <div className="w-1/2 h-8 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-center mb-6">
              <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="w-3/4 h-4 bg-gray-200 rounded mb-6"></div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-full h-8 bg-gray-200 rounded"></div>
          </div>

          {/* Instructor Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
            <div className="w-1/2 h-8 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mr-4"></div>
              <div className="w-3/4">
                <div className="w-1/2 h-6 bg-gray-200 rounded mb-2"></div>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            {/* Course Trailer */}
            <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="w-1/2 h-8 bg-gray-200 rounded mb-4"></div>
              <div className="relative pb-[56.25%]">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Course Highlights */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded animate-pulse">
              <div className="w-1/2 h-6 bg-blue-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Lesson List */}
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-4 animate-pulse">
                  <div className="w-1/2 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="relative pb-[56.25%]">
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="mt-4">
                    <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsSkelton;
