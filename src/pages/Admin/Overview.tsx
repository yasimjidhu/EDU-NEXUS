import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Text } from 'recharts';
import { getAllCourses, getPopularInstructorsCourses } from '../../components/redux/slices/courseSlice';
import { getAllTransactions, getTransactions } from '../../components/redux/slices/paymentSlice';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import DisplayPopularInstructors from '../../components/Admin/DisplayPopularInstructors';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomizedAxisTick = ({ x, y, payload }) => {
  const maxChars = 15; // Adjust this value based on your needs
  let displayName = payload.value;
  if (displayName.length > maxChars) {
    displayName = displayName.substring(0, maxChars) + '...';
  }
  return (
    <Text x={x} y={y} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
      {displayName}
    </Text>
  );
};

const AdminOverview = () => {
  const [courseData, setCourseData] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const filters = {
        sortBy: 'created_at',
        sortOrder: 'desc',
        page: 1,
        limit: 10,
      };

      try {
        const coursesResponse = await dispatch(getAllCourses({ page: 1,limit:10 }));
        console.log('all courses response in frontend', coursesResponse)
        const { courses, totalPages } = coursesResponse.payload;

        const popularCoursesResponse = await dispatch(getPopularInstructorsCourses())
        const data = popularCoursesResponse.payload
        console.log('popular courses',data)
        setPopularCourses(data)

        const transactionsResponse = await dispatch(getTransactions(filters));
        const transactions = transactionsResponse.payload.transactions;
        console.log('transaction new',transactionsResponse.payload)

        const combinedData = courses.map(course => {
          const courseTransactions = transactions.filter(transaction => transaction.courseId == course._id);
          console.log('course transactions',courseTransactions)
          return {
            id: course._id,
            name: course.title,
            studentsEnrolled: courseTransactions.length,
            totalRevenue: courseTransactions.reduce((sum, transaction) => sum + (transaction.adminAmount/100) , 0),
            adminRevenue: courseTransactions.reduce((sum, transaction) => sum + (transaction.adminAmount/100) , 0),
            averageRating: course.averageRating || 0,
          };
        });

        setCourseData(combinedData);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) {
    return (
      <div className="w-full flex justify-center items-center">
        <div className="w-[35%] text-center">
          <img src="/assets/images/nothing.png" alt="Error" className="mb-4 w-full" />
          <h4 className="text-xl">{error}</h4>
        </div>
      </div>
    );
  }

  const totalStudents = courseData.reduce((sum, course) => sum + course.studentsEnrolled, 0);
  const totalRevenue = courseData.reduce((sum, course) => sum + course.totalRevenue, 0);
  const averageRating = courseData.length > 0
    ? (courseData.reduce((sum, course) => sum + course.averageRating, 0) / courseData.length).toFixed(1)
    : 'N/A';


    console.log('coursedata',courseData)
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {courseData.map((course, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
            <p>Students Enrolled: {course.studentsEnrolled}</p>
            <p>Average Rating: {course.averageRating.toFixed(1)}</p>
            <p>
              Revenue:
              <span
                className={`ml-2 inter ${course.adminRevenue === 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                $ {course.adminRevenue.toFixed(2)}
              </span>
            </p>

          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
        <p>Total Students: {totalStudents}</p>
        <p>Average Rating: {averageRating}</p>
        <p className='mt-2'> Total Revenue: <span className='text-xl inter text-green-600'> $ {totalRevenue.toFixed(2)}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Students per Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="studentsEnrolled" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseData}
                dataKey="totalRevenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {courseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left p-2">Course Name</th>
                <th className="text-left p-2">Students Enrolled</th>
                <th className="text-left p-2">Total Revenue</th>
                <th className="text-left p-2">Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {courseData.map((course, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <td className="p-2">{course.name}</td>
                  <td className="p-2">{course.studentsEnrolled}</td>
                  <td className="p-2">$ {course.totalRevenue.toFixed(2)}</td>
                  <td className="p-2">{course.averageRating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {
        popularCourses.length > 0 && (
          <DisplayPopularInstructors data={popularCourses}/>
        )
      }
    </div>
  );
};

export default AdminOverview;
