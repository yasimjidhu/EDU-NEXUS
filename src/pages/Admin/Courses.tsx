import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses, CourseState } from "../../components/redux/slices/courseSlice";
import { getAllCategories } from "../../components/redux/slices/adminSlice";
import { fetchAllInstructors } from "../../components/redux/slices/instructorSlice";
import { AppDispatch, RootState } from "../../components/redux/store/store";

interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
}

interface FilterState {
  instructors: string[];
  price: string[];
  review: number[];
  level: string[];
}

const Courses: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.category);
  const [allCourses, setAllCourses] = useState<CourseState[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseState[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    instructors: [],
    price: [],
    review: [],
    level: [],
  });

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(fetchAllInstructors()).then((res: any) => {
      setAllInstructors(res.payload.instructors);
    });
    dispatch(getAllCourses()).then((res: any) => {
      setAllCourses(res.payload.courses);
      setFilteredCourses(res.payload.courses);
    });
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [filters, allCourses]);

  const applyFilters = () => {
    let result = allCourses;

    if (filters.instructors.length > 0) {
      result = result.filter((course) => filters.instructors.includes(course.instructorRef));
    }

    if (filters.price.length > 0) {
      result = result.filter((course) => {
        if (filters.price.includes("Free")) {
          return course.pricing.amount === 0;
        }
        if (filters.price.includes("Paid")) {
          return course.pricing.amount > 0;
        }
        return true;
      });
    }

    if (filters.review.length > 0) {
      result = result.filter((course) => {
        // Assuming course has a rating property
        return filters.review.some((rating) => course.rating >= rating);
      });
    }

    if (filters.level.length > 0) {
      result = result.filter((course) => filters.level.includes(course.level));
    }

    setFilteredCourses(result);
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string | number) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      const index = updatedFilters[filterType].indexOf(value as never);
      if (index > -1) {
        updatedFilters[filterType] = updatedFilters[filterType].filter((item) => item !== value);
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value as never];
      }
      return updatedFilters;
    });
  };

  const getInstructorName = (instructorId: string) => {
    const instructor = allInstructors.find((inst) => inst._id === instructorId);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : "Unknown Instructor";
  };

  return (
    <div className="ml-52 px-8">
      <ul className="flex justify-between mb-8">
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
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3 space-y-6">
          {filteredCourses.length > 0 && allInstructors.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="flex bg-white rounded-lg border border-gray-300 overflow-hidden"
              >
                <div className="w-1/3 bg-purple-700">
                  <img
                    src={course.thumbnail || "/assets/images/person2.png"}
                    className="object-cover w-full h-full"
                    alt={course.title}
                  />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-600">by {getInstructorName(course.instructorRef)}</p>
                    <h3 className="text-xl font-semibold mt-1">{course.title}</h3>
                    <ul className="flex justify-between mt-3 text-sm">
                      <li className="flex items-center">
                        <img src="/assets/icon/clock.png" alt="Clock icon" className="w-4 h-4 mr-1" />
                        <span>2 Weeks</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/students.png" alt="Students icon" className="w-4 h-4 mr-1" />
                        <span>156 students</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/levels.png" alt="Levels icon" className="w-4 h-4 mr-1" />
                        <span>{course.level}</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/lesson.png" alt="Lesson icon" className="w-4 h-4 mr-1" />
                        <span>{course.lessons.length} lessons</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <div className="border-t border-gray-300 my-2"></div>
                    <div className="flex justify-between items-center">
                      <h6 className="text-green-700 font-semibold">
                        ${course.pricing.amount} 
                      </h6>
                      <button className="bg-black py-2 px-4 hover:bg-gray-800 rounded-md text-white text-sm">
                        Manage Course
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No courses available.</p>
          )}
        </div>
        <div className="col-span-1 space-y-8">
          <div>
            <h1 className="text-lg font-semibold mb-2">Instructors</h1>
            {allInstructors.map((instructor) => (
              <div key={instructor._id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`instructor-${instructor._id}`}
                  checked={filters.instructors.includes(instructor._id)}
                  onChange={() => handleFilterChange('instructors', instructor._id)}
                  className="mr-2"
                />
                <label htmlFor={`instructor-${instructor._id}`}>{getInstructorName(instructor._id)}</label>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-lg font-semibold mb-2">Price</h1>
            {["All", "Free", "Paid"].map((priceOption) => (
              <div key={priceOption} className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`price-${priceOption}`}
                    checked={filters.price.includes(priceOption)}
                    onChange={() => handleFilterChange('price', priceOption)}
                    className="mr-2"
                  />
                  <label htmlFor={`price-${priceOption}`}>{priceOption}</label>
                </div>
                <span className="text-sm text-gray-600">15</span>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-lg font-semibold mb-2">Review</h1>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`review-${rating}`}
                    checked={filters.review.includes(rating)}
                    onChange={() => handleFilterChange('review', rating)}
                    className="mr-2"
                  />
                  <label htmlFor={`review-${rating}`} className="flex">
                    {Array.from({ length: rating }, (_, index) => (
                      <img key={index} src="/assets/icon/star.png" alt="Star icon" className="w-4 h-4" />
                    ))}
                  </label>
                </div>
                <span className="text-sm text-gray-600">(1,234)</span>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-lg font-semibold mb-2">Level</h1>
            {["All Levels", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <div key={level} className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`level-${level}`}
                    checked={filters.level.includes(level)}
                    onChange={() => handleFilterChange('level', level)}
                    className="mr-2"
                  />
                  <label htmlFor={`level-${level}`}>{level}</label>
                </div>
                <span className="text-sm text-gray-600">15</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;

