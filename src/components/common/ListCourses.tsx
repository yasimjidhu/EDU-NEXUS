import React from 'react'
import { CourseState } from '../redux/slices/courseSlice'
import { useNavigate } from 'react-router-dom';


interface ListCoursesProps{
    allCourses:CourseState[];
}
export const ListCourses:React.FC<ListCoursesProps> = ({allCourses}) => {

    const navigate  = useNavigate()
    const handleStartClick = (courseId: string) => {
        navigate(`/course-detail/${courseId}`)
      }
    
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 px-4">
    {allCourses.slice(0,4).map((course) => (
        <div key={course._id} className="bg-white text-start rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
              <p>Students: {course.enrolledStudentsCount}</p>
            </div>
            <div className="flex items-center">
              <img src="/assets/png/level.png" className="w-3 h-3 mr-1" alt="" />
              <p>{course.level}</p>
            </div>
          </div>
          <button className="bg-black py-1 px-3 text-white rounded-xl mt-4 flex items-center hover:bg-gray-800 transition-colors duration-300" onClick={()=>handleStartClick(course._id)}>
            Start Course
            <span className="ml-2">
              <img src="/assets/png/next.png" alt="" className="w-4" />
            </span>
          </button>
        </div>
    ))}
  </div>
  )
}
