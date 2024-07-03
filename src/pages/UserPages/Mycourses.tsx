import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { CourseState, getUserEnrolledCourses } from "../../components/redux/slices/courseSlice";

const MyCourse: React.FC = () => {
  const { categories } = useSelector((state: RootState) => state.category);
  const { user } = useSelector((state: RootState) => state.user);
  const [myCourses, setMyCourses] = useState<CourseState[]>([]);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user._id) {
      dispatch(getUserEnrolledCourses(user._id)).then((res: any) => {
        console.log('result of enrolled courses of student', res);
        setMyCourses(res.payload.courses || []);
      });
    }
  }, [user._id, dispatch]);

  const handleCardClick = (courseId: string) => {
    navigate(`/view-course/${courseId}`);
  };

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      {myCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myCourses.map((course) => (  
            <div 
              key={course._id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer" 
              
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 m-2 rounded-full text-sm">
                  {course.lessons.length} lessons
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="text-lg font-semibold text-gray-800 line-clamp-2">{course.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-sm font-medium">
                    {categories.find((cat) => cat.id === course.categoryRef)?.name || 'Uncategorized'}
                  </span>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full text-sm transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(course._id);
                    }}
                  >
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <img src="/assets/images/no-data.jpg" className="mx-auto w-1/2 max-w-md" alt="No courses" />
          <h2 className="mt-4 text-xl font-semibold text-gray-600">You haven't enrolled in any courses yet!</h2>
          <p className="mt-2 text-gray-500">Explore our course catalog and start learning today.</p>
        </div>
      )}
    </div>
  );
};

export default MyCourse;