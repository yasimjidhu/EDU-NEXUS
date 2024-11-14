
const CourseSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
    <div className="w-full h-52 bg-gray-300 animate-pulse"></div>
    <div className="p-4 flex-grow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const CourseListingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <CourseSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CourseListingSkeleton;