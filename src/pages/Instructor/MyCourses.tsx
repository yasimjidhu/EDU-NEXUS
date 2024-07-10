import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { CourseState, getAllCoursesOfInstructor } from "../../components/redux/slices/courseSlice";
import { PencilIcon } from "lucide-react";

const MyCourses = () => {
  const { allCourses } = useSelector((state: RootState) => state.course);
  const { categories } = useSelector((state: RootState) => state.category);
  const { user } = useSelector((state: RootState) => state.user);
  const [myCourses, setMyCourses] = useState<CourseState[]>([]);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (user._id) {
      dispatch(getAllCoursesOfInstructor(user._id)).then((res) => {
        setMyCourses(res.payload.courses);
      });
    }
  }, []);

   const handleEditClick = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/instructor/add-course`,{state:courseId});
  };

  return (
    <>
      <div className="ml-52 space-y-4">
        <div className="flex justify-between">
          <h1 className="inter text-xl">My Courses</h1>
          <Link to="/instructor/add-course">
            <button className="bg-white border-2 border-pink-900 rounded-md px-2 py-1 inter hover:bg-pink-900 hover:text-white transition-colors duration-300">
              Add Course
            </button>
          </Link>
        </div>
          {myCourses.length > 0 ? (
        <div className="grid grid-cols-3 gap-8">
            {myCourses.map((course) => (
              <Link to={`/instructor/course-detail/${course._id}`} key={course._id}>
                <div className="rounded-lg shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className="w-full bg-gray-300 h-52 text-center flex justify-center p-3 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="bg-pure-white p-4 space-y-3 rounded-b-xl">
                    <div className="flex justify-between">
                      <h4 className="inter text-lg font-semibold">{course.title}</h4>
                      <button 
                      onClick={(e) => handleEditClick(e, course._id)}
                      className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <button className="bg-blue-300 text-blue-950 py-1 px-2 rounded-lg inter-sm text-center hover:bg-blue-400 transition-colors duration-300">
                        {categories.map((cat) =>
                          cat.id === course.categoryRef ? <span key={cat.id}>{cat.name}</span> : null
                        )}
                      </button>
                      <h6 className="inter-sm">{course.lessons.length} lessons</h6>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
         
        </div>
         ) : (
          <div>
          <div className="w-full flex justify-center ">
            <img src="/assets/images/no-data.jpg" width='40%' alt="" />
          </div>
          <h1 className="text-center inter">You haven't added any course yet...!</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default MyCourses;
