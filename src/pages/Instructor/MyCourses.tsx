import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../components/redux/slices/courseSlice";

const MyCourses = () => {
  const { allCourses } = useSelector((state: RootState) => state.course);
  const { categories } = useSelector((state: RootState) => state.category);
  const {  user} = useSelector((state: RootState) => state.auth);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    console.log("allInstructors in mycours", user);
    if (user._id) {
      dispatch(getAllCourses(user?._id));
    }
  }, []);

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
        <div className="grid grid-cols-3 gap-8">
          {allCourses.map((course) => (
              
           <Link to={`/instructor/course-details/${course._id}`}> <div
              key={course._id}
              className="rounded-lg shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="w-full bg-gray-300 h-52 text-center flex justify-center p-3 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="bg-pure-white p-4 space-y-3 rounded-b-xl">
                <h4 className="inter text-lg font-semibold">{course.title}</h4>
                <div className="flex justify-between items-center">
                  <button className="bg-blue-300 text-blue-950 py-1 px-2 rounded-lg inter-sm text-center hover:bg-blue-400 transition-colors duration-300">
                    {categories.map((cat) =>
                      cat.id === course.categoryRef ? (
                        <span key={cat.id}>{cat.name}</span>
                      ) : null
                    )}
                  </button>

                  <h6 className="inter-sm">{course.lessons.length} lessons</h6>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyCourses;
