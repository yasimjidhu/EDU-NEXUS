import React, { useState, useEffect } from 'react';
import dayjs from "dayjs";
import Pagination from '../../components/common/Pagination';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { getInstructorAvailablePayouts, getInstructorCoursesTransaction, getInstructorsTodaysRevenue, getInstructorsTotalEarnings, getRecentPayouts, requestInstructorPayout } from '../../components/redux/slices/paymentSlice';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../components/redux/slices/studentSlice';
import { getInstructorCourseDetailed } from '../../components/redux/slices/courseSlice';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const InstructorPayoutPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [availablePayouts, setAvailablePayouts] = useState(0);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [courseData, setCourseData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  useDocumentTitle('Payments')
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [users, courses] = await Promise.all([
          dispatch(getAllUsers()).unwrap(),
          dispatch(getInstructorCourseDetailed(user?._id)).unwrap()
        ]);
        setAllUsers(users);
        setCourseData(courses);
        await Promise.all([
          fetchAvailablePayouts(),
          getInstructorTodaysRevenue(),
          handleInstructorsTotalEarnings(),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (user?._id) {
      fetchInitialData();
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const response = await dispatch(getInstructorCoursesTransaction({ instructorId: user._id, page: currentPage, limit: 5 })).unwrap();
        setTransactions(response.transactions);
        setTotalPages(response.totalPages);

        const dailyData = response.transactions.reduce((acc: any, curr: any) => {
          const date = dayjs(curr.createdAt).format('YYYY-MM-DD');
          if (!acc[date]) acc[date] = { date, revenue: 0 };
          acc[date].revenue += curr.instructorAmount;
          return acc;
        }, {});

        const transformedData = Object.values(dailyData).map((entry: any) => ({
          ...entry,
          revenue: (entry.revenue / 100).toFixed(2)
        })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setLineChartData(transformedData);

        const courseMap = courseData.reduce((acc: any, course: any) => {
          acc[course._id] = course.title;
          return acc;
        }, {});

        const revenueData = response.transactions.reduce((acc: any, payment: any) => {
          if (payment.status === "completed") {
            const courseTitle = courseMap[payment.courseId];
            if (courseTitle) {
              acc[courseTitle] = (acc[courseTitle] || 0) + payment.instructorAmount;
            }
          }
          return acc;
        }, {});

        const pieData = Object.keys(revenueData).map(courseTitle => ({
          name: courseTitle,
          value: parseFloat((revenueData[courseTitle] / 100).toFixed(2))
        }));

        setPieChartData(pieData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [dispatch, user?._id, courseData, currentPage]);

  const fetchAvailablePayouts = async () => {
    try {
      const response = await dispatch(getInstructorAvailablePayouts(user?.stripeAccountId!)).unwrap();
      setAvailablePayouts(response.availablePayouts);
    } catch (error) {
      console.error('Error fetching available payouts:', error);
    }
  };

  const getInstructorTodaysRevenue = async () => {
    if (!user?._id) return;
    try {
      const response = await dispatch(getInstructorsTodaysRevenue(user._id)).unwrap();
      console.log('payload of getinstructor todays revenuy', response)
      setTodaysRevenue(response);
    } catch (error) {
      console.error('Error fetching today\'s revenue:', error);
    }
  };

  const handleInstructorsTotalEarnings = async () => {
    if (!user?._id) return;
    try {
      const response = await dispatch(getInstructorsTotalEarnings(user._id)).unwrap();
      setTotalEarnings(response);
    } catch (error) {
      console.error('Error fetching total earnings:', error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getUser = (userId: string) => {
    return allUsers.find(data => data._id === userId);
  }

  const totalEnrollments = courseData.reduce((acc, course) => acc + course.enrolledStudentsCount, 0)

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-xl font-bold mb-8 text-gray-800">Instructor Payout Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Paid Out', amount: `$ ${availablePayouts}`, color: 'bg-blue-600' },
          { title: 'Today\'s revenues', amount: `$ ${(todaysRevenue / 100).toFixed(2)}`, color: 'bg-green-500' },
          { title: 'Total earnings', amount: `$ ${(totalEarnings / 100).toFixed(2)}`, color: 'bg-yellow-500' },
          { title: 'Total Students', amount: ` ${totalEnrollments}`, color: 'bg-red-500' },
        ].map((item, index) => (
          <div key={index} className={`${item.color} rounded-lg shadow-lg p-6 text-white`}>
            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
            <p className="text-3xl font-bold">{item.amount}</p>
            <p className="text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
              <legend />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={{ stroke: '#3B82F6', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>


        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieChartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      {transactions && transactions.length > 0 ? (
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b text-gray-800">Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap flex  gap-3 items-center space-x-2">
                      <div className="rounded-full w-10 h-10 shadow-sm border-2 border-gray-600 overflow-hidden">
                        <img
                          src={getUser(transaction.userId)?.profile?.avatar}
                          alt="avatar"
                          className="w-full h-full object-cover rounded-full"
                        />

                      </div>
                      {getUser(transaction.userId)?.firstName} {getUser(transaction.userId)?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{`$ ${(transaction.instructorAmount / 100).toFixed(2)}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.currency.toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Add Pagination Component Here */}
          <div className="flex justify-end items-center p-6">
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden p-6">
          <h1 className="text-xl font-semibold text-gray-800">No Transactions</h1>
        </div>
      )}
    </div>
  );
};

export { InstructorPayoutPage };
