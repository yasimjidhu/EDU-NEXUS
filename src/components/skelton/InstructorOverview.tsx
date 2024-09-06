import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const InstructorAnalyticsSkeleton = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        <Skeleton width={200} />
      </h1>

      {/* Skeleton for Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">
              <Skeleton width={150} />
            </h2>
            <p><Skeleton width={100} /></p>
            <p><Skeleton width={80} /></p>
            <p className="mt-2">
              <Skeleton width={120} />
            </p>
          </div>
        ))}
      </div>

      {/* Skeleton for Overall Statistics */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          <Skeleton width={200} />
        </h2>
        <p><Skeleton width={150} /></p>
        <p><Skeleton width={100} /></p>
        <p className="mt-2">
          <Skeleton width={150} />
        </p>
      </div>

      {/* Skeleton for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            <Skeleton width={180} />
          </h2>
          <Skeleton height={300} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            <Skeleton width={180} />
          </h2>
          <Skeleton height={300} />
        </div>
      </div>

      {/* Skeleton for Course Overview Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          <Skeleton width={200} />
        </h2>
        <Skeleton height={40} count={5} />
      </div>

      {/* Skeleton for Students Overview */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">
            <Skeleton width={200} />
          </h2>
          <Skeleton width={150} height={40} />
        </div>
        <Skeleton height={40} count={5} />
      </div>
    </div>
  );
};

export default InstructorAnalyticsSkeleton;
