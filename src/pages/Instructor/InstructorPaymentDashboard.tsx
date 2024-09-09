import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, CategoryScale } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Transaction {
  id: string;
  date: string;
  courseName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

const transactions: Transaction[] = [
  { id: '1', date: '2024-09-01', courseName: 'React Masterclass', amount: 200, status: 'completed' },
  { id: '2', date: '2024-09-10', courseName: 'Node.js Advanced', amount: 150, status: 'pending' },
  { id: '3', date: '2024-08-15', courseName: 'Full Stack Bootcamp', amount: 300, status: 'failed' },
];

// Sample data for the earnings graph
const graphData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Earnings',
      data: [5000, 7000, 3000, 8000],
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 1)',
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
    },
  ],
};

const InstructorPaymentDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Instructor Payment Dashboard</h2>
        <div className="flex justify-between">
          <div>
            <h4 className="text-lg font-semibold">Total Earnings</h4>
            <p className="text-3xl font-bold text-green-500">$20,000</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Available Balance</h4>
            <p className="text-3xl font-bold text-blue-500">$5,000</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Pending Payouts</h4>
            <p className="text-3xl font-bold text-yellow-500">$2,000</p>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4">Earnings Breakdown</h3>
        <div className="bg-gray-200 h-40 rounded-md mb-4">
          <Line data={graphData} />
        </div>

        {/* Course Performance */}
        <h4 className="text-lg font-semibold mb-2">Course Performance</h4>
        <div className="bg-gray-100 p-4 rounded-md">
          <p>React Masterclass - $5,000</p>
          <p>Node.js Advanced - $3,500</p>
          <p>Full Stack Bootcamp - $11,500</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Payment History</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Course</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Amount</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="text-left py-3 px-4">{transaction.date}</td>
                <td className="text-left py-3 px-4">{transaction.courseName}</td>
                <td className="text-left py-3 px-4">${transaction.amount}</td>
                <td className="text-left py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      transaction.status === 'completed'
                        ? 'bg-green-200 text-green-700'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-200 text-yellow-700'
                        : 'bg-red-200 text-red-700'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorPaymentDashboard;