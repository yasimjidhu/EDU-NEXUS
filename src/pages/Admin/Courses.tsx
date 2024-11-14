import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCourses,
  CourseState
} from "../../components/redux/slices/courseSlice";
import { getAllCategories } from "../../components/redux/slices/adminSlice";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import Pagination from "../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import { fetchAllInstructors } from "../../components/redux/slices/instructorSlice";
import { budgetWiseCoursesCount } from "../../utils/getBudgetWiseCoursesCount";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

// Interfaces for types
interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
}

type FilterState = {
  instructors: (string | number)[];
  price: (string | number)[];
  review: (string | number)[];
  level: (string | number)[];
  category: (string | number)[];
};

const Courses: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate()

  const { categories } = useSelector((state: RootState) => state.category);

  const [allCourses, setAllCourses] = useState<CourseState[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseState[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    instructors: [],
    price: [],
    review: [],
    level: [],
    category: []
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useDocumentTitle('Courses')
  // Fetch categories, instructors, and courses on component mount and page change
  useEffect(() => {
    dispatch(getAllCategories(currentPage))
    dispatch(fetchAllInstructors()).then((res: any) => {
      setAllInstructors(res.payload.instructors);
    });
    dispatch(getAllCourses({ page: currentPage, limit: 5 })).then((res: any) => {
      setAllCourses(res.payload.courses);
      setTotalPages(res.payload.totalPages);
      setFilteredCourses(res.payload.courses);
    });
  }, [dispatch, currentPage]);

  // Memoized filtered courses
  const memoizedFilteredCourses = useMemo(() => {
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
        const courseRating = course.rating ?? 0; // Default to 0 if undefined
        return filters.review.some((rating) => Number(courseRating) >= Number(rating));
      });
    }
    
    

    if (filters.level.length > 0) {
      result = result.filter((course) => filters.level.includes(course.level));
    }

    if (filters.category.length > 0) {
      result = result.filter((course) => filters.category.includes(course.categoryRef));
    }

    return result;
  }, [allCourses, filters]);

  // Update filteredCourses when memoizedFilteredCourses changes
  useEffect(() => {
    setFilteredCourses(memoizedFilteredCourses);
  }, [memoizedFilteredCourses]);

  const handleCategoryClick = (categoryId: string) => {

    if (selectedCategory === categoryId) {
      // If the same category is clicked again, clear the filter
      setSelectedCategory(null);
      setFilters(prev => ({ ...prev, category: [] }));
    } else {
      // Set the new category
      setSelectedCategory(categoryId);
      setFilters(prev => ({ ...prev, category: [categoryId] }));
    }
    // Reset to the first page when changing categories
    setCurrentPage(1);
  };

  // Function to handle filter changes
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

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/course-detail/${courseId}`);
  };


  // Function to get instructor name by ID
  const getInstructorName = (instructorId: string) => {
    const instructor = allInstructors.find((inst) => inst._id === instructorId);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : "Unknown Instructor";
  };

  const budgetWiseCount = budgetWiseCoursesCount(allCourses)

  return (
    <div className=" px-8 bg-gray-50 min-h-screen">
      <ul className="flex flex-wrap justify-start gap-4 mb-8 pt-6">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <li
              key={category.id}
              className={`text-gray-700 bg-white hover:bg-medium-rose hover:text-white transition duration-300 px-4 py-2 rounded-full cursor-pointer shadow-md ${selectedCategory === category._id ? 'bg-medium-rose text-white' : ''
                }`}
              onClick={() => handleCategoryClick(category.id!)}
            >
              {category.name}
            </li>
          ))
        ) : (
          <li className="text-gray-700">No categories found</li>
        )}
      </ul>
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3 space-y-6 cursor-pointer">
          {filteredCourses.length > 0 && allInstructors.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="flex bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <div className="w-1/3">
                  <img
                    src={course.thumbnail || "/assets/images/person2.png"}
                    className="object-cover w-full h-full transition duration-300"
                    alt={course.title}
                  />
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 font-semibold">by {getInstructorName(course.instructorRef)}</p>
                    <h3 className="text-2xl font-bold mt-2 text-gray-800">{course.title}</h3>
                    <ul className="flex justify-between mt-4 text-sm text-gray-600">
                      <li className="flex items-center">
                        <img src="/assets/icon/clock.png" alt="Clock icon" className="w-5 h-5 mr-2" />
                        <span>2 Weeks</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/students.png" alt="Students icon" className="w-5 h-5 mr-2" />
                        <span>{course.enrolledStudentsCount} students</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/levels.png" alt="Levels icon" className="w-5 h-5 mr-2" />
                        <span>{course.level}</span>
                      </li>
                      <li className="flex items-center">
                        <img src="/assets/icon/lesson.png" alt="Lesson icon" className="w-5 h-5 mr-2" />
                        <span>{course.lessons.length} lessons</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="flex justify-between items-center">
                      <h6 className="text-2xl font-bold text-green-600">
                        ${course.pricing.amount}
                      </h6>
                      <button className="bg-medium-rose text-white px-4 py-2 rounded-full hover:bg-strong-rose transition duration-300" onClick={() => handleViewCourse(course._id!)}>
                        View Course
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              <div className="w-[35%] text-center">
                <img src="/assets/images/nothing.jpg" alt="No Courses" className="mb-4 w-full" />
                <h4 className="text-xl">No Courses Available</h4>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-1 space-y-8 sticky top-0 right-6 w-64 h-screen bg-white shadow-lg rounded-lg overflow-y-auto p-6">
          <div className="cursor-pointer">
            <h1 className="text-xl font-bold mb-4 text-gray-800">Instructors</h1>
            {allInstructors.map((instructor) => (
              <div key={instructor._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`instructor-${instructor._id}`}
                  checked={filters.instructors.includes(instructor._id)}
                  onChange={() => handleFilterChange('instructors', instructor._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label htmlFor={`instructor-${instructor._id}`} className="ml-2 text-gray-700 hover:text-indigo-600 transition duration-150 ease-in-out">{getInstructorName(instructor._id)}</label>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-xl font-bold mb-4 text-gray-800">Price</h1>
            {["All", "Free", "Paid"].map((priceOption) => (
              <div key={priceOption} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`price-${priceOption}`}
                    checked={filters.price.includes(priceOption)}
                    onChange={() => handleFilterChange('price', priceOption)}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <label htmlFor={`price-${priceOption}`} className="ml-2 text-gray-700">{priceOption}</label>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {budgetWiseCount[priceOption as keyof typeof budgetWiseCount]}
                </span>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-xl font-bold mb-4 text-gray-800">Review</h1>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`review-${rating}`}
                    checked={filters.review.includes(rating)}
                    onChange={() => handleFilterChange('review', rating)}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <label htmlFor={`review-${rating}`} className="flex ml-2">
                    {Array.from({ length: rating }, (_, index) => (
                      <img key={index} src="/assets/icon/star.png" alt="Star icon" className="w-4 h-4" />
                    ))}
                  </label>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  ({allCourses.reduce((total, course) => total + (course.reviewCounts[rating] || 0), 0)})
                </span>
              </div>
            ))}

          </div>
          <div>
            <h1 className="text-xl font-bold mb-4 text-gray-800">Level</h1>
            {Array.from(new Set(allCourses.map(course => course.level))).map((level) => (
              <div key={level} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`level-${level}`}
                    checked={filters.level.includes(level)}
                    onChange={() => handleFilterChange('level', level)}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <label htmlFor={`level-${level}`} className="ml-2 text-gray-700">{level}</label>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {allCourses.filter(course => course.level === level).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {
        totalPages > 1 && (
          <div className=' mt-8'>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )
      }
    </div>
  );
}

export default Courses;