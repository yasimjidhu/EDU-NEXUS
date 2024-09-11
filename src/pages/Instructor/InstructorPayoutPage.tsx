import React, { useState, useEffect } from 'react';
import dayjs from "dayjs";
import Pagination from '../../components/common/Pagination';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getInstructorAvailablePayouts, getInstructorCoursesTransaction, getInstructorsTodaysRevenue, getInstructorsTotalEarnings, getRecentPayouts, requestInstructorPayout } from '../../components/redux/slices/paymentSlice';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, StudentState } from '../../components/redux/slices/studentSlice';
import { FIXED_PAYOUT_AMOUNT, MAX_PAYOUT_LIMIT } from '../../constants/payoutAmount';
import { getInstructorCourseDetailed } from '../../components/redux/slices/courseSlice';

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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(getAllUsers()).then(res => setAllUsers(res.payload)),
          dispatch(getInstructorCourseDetailed(user?._id)).then(res => setCourseData(res.payload)),
          fetchAvailablePayouts(),
          getInstructorTodaysRevenue(),
          handleInstructorsTotalEarnings(),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch, user?._id]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const response = await dispatch(getInstructorCoursesTransaction({ instructorId: user._id, page: currentPage, limit: 5 })).unwrap();
        setTransactions(response.transactions);
        setTotalPages(response.totalPages);

        const dailyData = response.transactions.reduce((acc, curr) => {
          const date = dayjs(curr.createdAt).format('YYYY-MM-DD');
          acc[date] = acc[date] || { date, revenue: 0 };
          acc[date].revenue += curr.instructorAmount;
          return acc;
        }, {});

        const transformedData = Object.values(dailyData).map(entry => ({
          ...entry,
          revenue: (entry.revenue / 100).toFixed(2)
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        setLineChartData(transformedData);

        const courseMap = courseData.reduce((acc, course) => {
          acc[course._id] = course.title;
          return acc;
        }, {});

        const revenueData = response.transactions.reduce((acc, payment) => {
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
          value:parseFloat((revenueData[courseTitle] / 100).toFixed(2))
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
    if (!user?._id) return;
    try {
      const response = await dispatch(getInstructorAvailablePayouts(user._id)).unwrap();
      setAvailablePayouts(response.availablePayouts);
    } catch (error) {
      console.error('Error fetching available payouts:', error);
    }
  };

  const getInstructorTodaysRevenue = async () => {
    if (!user?._id) return;
    try {
      const response = await dispatch(getInstructorsTodaysRevenue(user._id))
      setTodaysRevenue(response.payload);
    } catch (error) {
      console.error('Error fetching today\'s revenue:', error);
    }
  };

  const handleInstructorsTotalEarnings = async () => {
    if (!user?._id) return;
    try {
      const response = await dispatch(getInstructorsTotalEarnings(user._id))
      setTotalEarnings(response.payload);
    } catch (error) {
      console.error('Error fetching total earnings:', error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePayout = async (transaction: any) => {
    if (!user?._id) return;

    if (availablePayouts < FIXED_PAYOUT_AMOUNT) {
      alert('Insufficient funds for payout.');
      return;
    }

    if (FIXED_PAYOUT_AMOUNT > MAX_PAYOUT_LIMIT) {
      alert(`The fixed payout amount exceeds the maximum limit of $${MAX_PAYOUT_LIMIT}.`);
      return;
    }

    setLoading(true);
    try {
      await dispatch(requestInstructorPayout({
        paymentId: transaction.id,
        accountId: transaction.instructorAccountId,
        amount: FIXED_PAYOUT_AMOUNT * 100,
        currency: 'usd',
        email: user.email
      }));
      alert('Payout initiated successfully!');
    } catch (error) {
      console.error('Error initiating payout:', error);
      alert('Payout failed');
    } finally {
      setLoading(false);
    }
  };

  function getUser(userId: string) {
    const user = allUsers.find(data => data._id == userId)
    return user
  }

  console.log('piechartdata',pieChartData)

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-xl font-bold mb-8 text-gray-800">Instructor Payout Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Available to payout', amount: `$ ${(availablePayouts / 100).toFixed(2)}`, color: 'bg-blue-600' },
          { title: 'Today\'s revenues', amount: `$ ${(todaysRevenue / 100).toFixed(2)}`, color: 'bg-green-500' },
          { title: 'Total earnings', amount: `$ ${(totalEarnings / 100).toFixed(2)}`, color: 'bg-yellow-500' },
          { title: 'Total Students', amount: ` ${transactions.length}`, color: 'bg-red-500' },
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
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
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
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.instructorPayoutStatus
                        === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.instructorPayoutStatus
                          === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {transaction.instructorPayoutStatus
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`bg-pink-500 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out 
                          ${availablePayouts < 50 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600 hover:shadow-lg'}
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
                        onClick={() => handlePayout(transaction)}
                        disabled={availablePayouts < 50} // Disable button if below threshold
                      >
                        Payout
                      </button>

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
