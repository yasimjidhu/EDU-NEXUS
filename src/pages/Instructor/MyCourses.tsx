import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesOfInstructor } from "../../components/redux/slices/courseSlice";
import { PencilIcon } from "lucide-react";

const MyCourses = () => {
  const { categories } = useSelector((state: RootState) => state.category);
  const { user } = useSelector((state: RootState) => state.user);
  const [myCourses, setMyCourses] = useState<any[]>([]);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (user._id) {
      dispatch(getAllCoursesOfInstructor(user._id)).then((res) => {
        setMyCourses(res.payload.courses);
      });
    }
  }, [dispatch, user._id]);

  const handleEditClick = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    navigate(`/instructor/add-course`, { state: courseId });
  };

  return (
    <div className=" space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="inter text-2xl font-bold">My Courses</h1>
        <Link to="/instructor/add-course">
          <button className="bg-white border-2 border-pink-900 rounded-md px-4 py-2 inter hover:bg-pink-900 hover:text-white transition-colors duration-300">
            Add Course
          </button>
        </Link>
      </div>
      {myCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myCourses.map((course) => (
            <Link to={`/instructor/course-detail/${course._id}`} key={course._id} className="block h-full">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="w-full h-52 bg-gray-300 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="inter text-lg font-semibold line-clamp-2">{course.title}</h4>
                      <button 
                        onClick={(e) => handleEditClick(e, course._id)}
                        className="text-blue-500 hover:text-blue-600 transition-colors duration-300 ml-2 flex-shrink-0"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-sm font-medium">
                        {categories.find(cat => cat.id === course.categoryRef)?.name || 'Uncategorized'}
                      </span>
                      <span className="inter-sm text-gray-600">{course.lessons.length} lessons</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <img src="/assets/images/no-data.jpg" alt="No courses" className="mx-auto w-1/2 max-w-md" />
          <h2 className="inter text-xl mt-4">You haven't added any courses yet!</h2>
        </div>
      )}
    </div>
  );
};

export default MyCourses;