import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {  getCategoryWiseCourses } from '../../components/redux/slices/courseSlice';
import { AppDispatch } from '../../components/redux/store/store';
import Pagination from '../../components/common/Pagination';

const ViewCategory: React.FC = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const { categoryId } = useParams();

  
  useEffect(() => {
    fetchCourses(currentPage,categoryId);
  }, [currentPage,categoryId]);

  const fetchCourses = async (page: number,categoryId:string) => {
    if(categoryId){
        const response = await dispatch(getCategoryWiseCourses({categoryId,page}));
        const { courses, totalPages } = response.payload;
        setAllCourses(courses);
        setTotalPages(totalPages);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex justify-between items-center px-4">
        <h1 className="text-xl font-semibold">All Courses</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 px-4">
        {allCourses.map((course) => (
          <Link key={course._id} to={`/course-detail/${course._id}`}>
            <div className="bg-white text-start rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-44 overflow-hidden rounded-md">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </div>
              <h1 className="font-semibold text-md mt-3 truncate">{course.title}</h1>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <img src="/assets/png/lesson.png" className="w-3 h-3 mr-1" alt="" />
                  <p>Lessons: {course.lessons.length}</p>
                </div>
                <div className="flex items-center">
                  <img src="/assets/png/student.png" className="w-3 h-3 mr-1" alt="" />
                  <p>Students: 17</p>
                </div>
                <div className="flex items-center">
                  <img src="/assets/png/level.png" className="w-3 h-3 mr-1" alt="" />
                  <p>{course.level}</p>
                </div>
              </div>
              <button className="bg-gray-800 py-1 px-3 text-white rounded-xl mt-4 flex items-center hover:bg-gray-800 transition-colors duration-300">
                Start Course
                <span className="ml-2">
                  <img src="/assets/png/next.png" alt="" className="w-4" />
                </span>
              </button>
            </div>
          </Link>
        ))}
      </div>
      <div className='mt-10'>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default ViewCategory;
