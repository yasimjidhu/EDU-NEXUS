import React from 'react';

interface AllCategoriesSkeletonProps{
    length:number;
}
const AllCategoriesSkeleton: React.FC<AllCategoriesSkeletonProps> = ({length}) => {
  const skeletonArray = Array(length).fill(0);

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-8 sm:grid-cols-2">
        {skeletonArray.map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 shadow-lg rounded-md text-center p-6 animate-pulse"
          >
            <div className="rounded-full mx-auto w-36 h-36 shadow-sm border-2 border-gray-100 bg-gray-300"></div>
            <div className="mt-3 w-24 h-4 bg-gray-300 mx-auto rounded-md"></div>
            <div className="mt-2 w-16 h-3 bg-gray-300 mx-auto rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCategoriesSkeleton;
