import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses, CourseState } from "../../components/redux/slices/courseSlice";
import { getAllCategories } from "../../components/redux/slices/adminSlice";
import { fetchAllInstructors } from "../../components/redux/slices/instructorSlice";
import { AppDispatch, RootState } from "../../components/redux/store/store";

const Courses: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.category);
  const [allCourses, setAllCourses] = useState<CourseState[]>([]);
  const [allInstructors, setAllInstructors] = useState<any[]>([]);


  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(fetchAllInstructors()).then((res: any) => {
      setAllInstructors(res.payload.instructors);
    });
    dispatch(getAllCourses()).then((res: any) => {
      setAllCourses(res.payload.courses);
    });
  }, [dispatch]);

  const getInstructorName = (instructorId: string) => {
    const instructor = allInstructors.find((inst: any) => inst._id === instructorId);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : "Unknown Instructor";
  };

  return (
    <div className="ml-52 px-8">
      <ul className="flex justify-between">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li
              key={category.id}
              className="text-black inter hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer"
            >
              {category.name}
            </li>
          ))
        ) : (
          <li className="text-black inter">No categories found</li>
        )}
      </ul>
      <div className="grid grid-cols-4 gap-4 p-2 mt-8">
        {allCourses.length > 0 && allInstructors.length > 0 ? (
          <div className="col-span-3 grid grid-cols-1 gap-4">
            {allCourses.map((course) => (
              <div
                key={course._id}
                className="flex bg-white rounded-lg border-2 h-48 border-gray-300"
              >
                <div className="bg-purple-700 w-1/3 flex-shrink-0">
                  <img
                    src={course.thumbnail || "/assets/images/person2.png"}
                    className="object-cover w-full h-full rounded-l-lg"
                    alt={course.title}
                  />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <p>by {getInstructorName(course.instructorRef)}</p>
                    <h3 className="prime-sm text-xl font-semibold">{course.title}</h3>
                    <ul className="flex justify-between mt-3">
                      <li className="flex items-center">
                        <img src="/assets/icon/clock.png" alt="Clock icon" className="mr-2" />
                        <span>2 Weeks</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/students.png" alt="Students icon" className="mr-2" />
                        <span>156 students</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/levels.png" alt="Levels icon" className="mr-2" />
                        <span>{course.level}</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/lesson.png" alt="Lesson icon" className="mr-2" />
                        <span>{course.lessons.length} lessons</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="border-b-2 border-gray-300 my-4"></div>
                    <div className="flex justify-between items-center">
                      <h6 className="text-green-700 font-semibold poppins-normal">
                        ${course.pricing.amount} {course.pricing.type}
                      </h6>
                      <button className="bg-black py-2 px-2 hover:bg-gray-800 rounded-md text-white poppins-normal">
                        Manage Course
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="col-span-3">No courses available.</p>
        )}
        <div className="col-span-1 p-8 space-y-8">
          <div>
            <h1 className="text-lg font-semibold">Instructors</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>Kennie White</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>John Doe</span>
              </div>
              <h6>15</h6>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Price</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="price" className="mr-2" />
                <span>All</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="price" className="mr-2" />
                <span>Free</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="price" className="mr-2" />
                <span>Paid</span>
              </div>
              <h6>15</h6>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Review</h1>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <input type="checkbox" name={`review-${index + 1}`} className="mr-2" />
                  <div className="flex justify-evenly space-x-2">
                    {Array.from({ length: 5 - index }, (_, starIndex) => (
                      <img key={starIndex} src="/assets/icon/star.png" alt="Star icon" />
                    ))}
                  </div>
                </div>
                <h6>(1,234)</h6>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-lg font-semibold">Level</h1>
            {["All Levels", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <div key={level} className="flex justify-between items-center">
                <div className="flex items-center">
                  <input type="checkbox" name="level" className="mr-2" />
                  <span>{level}</span>
                </div>
                <h6>15</h6>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
