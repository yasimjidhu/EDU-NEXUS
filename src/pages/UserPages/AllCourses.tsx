import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../../components/redux/slices/courseSlice';
import { AppDispatch } from '../../components/redux/store/store';
import Pagination from '../../components/common/Pagination';
import FilterAndSort from '../../components/common/FilterAndSort';
import CourseListingSkeleton from '../../components/skelton/courses';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const AllCourses: React.FC = () => {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState({
    price: '',
    level: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  useDocumentTitle('Courses')

  useEffect(() => {
    fetchCourses(currentPage, sortBy, filters);
  }, [currentPage, sortBy, filters]);

  const fetchCourses = async (page: number, sort: string, filters: any) => {
    setIsLoading(true);
    const response = await dispatch(getAllCourses({ page,limit:6, sort, filters }));
    console.log('allcourses data', response.payload)
    const { courses, totalPages } = response.payload as any
    setAllCourses(courses);
    setTotalPages(totalPages);
    setIsLoading(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column for courses */}
        <div className="md:w-3/4">
          {isLoading ? (
            <CourseListingSkeleton />
          ) : (
            allCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCourses.map((course) => (
                  <Link key={course._id} to={`/course-detail/${course._id}`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover object-center rounded-t-lg"
                      />
                      <div className="p-4">
                        <h2 className="font-semibold text-lg mb-2 truncate">{course.title}</h2>
                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <img src="/assets/png/lesson.png" className="w-4 h-4 mr-1" alt="" />
                            <p>{course.lessons.length} Lessons</p>
                          </div>
                          <div className="flex items-center">
                            <img src="/assets/png/student.png" className="w-4 h-4 mr-1" alt="" />
                            <p>{course.enrolledStudentsCount} Students</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                            {course.level}
                          </span>
                          <button className="bg-black text-white py-1 px-3 rounded-md hover:bg-gray-800 transition-colors duration-300 text-sm">
                            Start Course
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center">
                <div className="w-[35%] text-center">
                  <img src="/assets/images/nothing.jpg" alt="No Courses" className="mb-4 w-full" />
                  <h4 className="text-xl">No Courses Available</h4>
                </div>
              </div>
            )
          )}
        </div>

        {/*filter and sort */}
        {allCourses && allCourses.length > 0 && (
          <div className="md:w-1/4">
            <FilterAndSort
              sortBy={sortBy}
              filters={filters}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-end h-full mt-10">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default AllCourses;
