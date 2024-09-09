// AdminPaymentDashboard.tsx
import React from 'react';

interface Instructor {
  id: string;
  name: string;
  totalEarnings: number;
  paidAmount: number;
  pendingAmount: number;
}

const instructors: Instructor[] = [
  { id: '1', name: 'John Doe', totalEarnings: 20000, paidAmount: 15000, pendingAmount: 5000 },
  { id: '2', name: 'Jane Smith', totalEarnings: 15000, paidAmount: 12000, pendingAmount: 3000 },
  { id: '3', name: 'Mark Johnson', totalEarnings: 25000, paidAmount: 20000, pendingAmount: 5000 },
];

const AdminPaymentDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Admin Payment Dashboard</h2>
        <div className="flex justify-between">
          <div>
            <h4 className="text-lg font-semibold">Total Revenue</h4>
            <p className="text-3xl font-bold text-green-500">$100,000</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Total Payouts</h4>
            <p className="text-3xl font-bold text-blue-500">$70,000</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Pending Payouts</h4>
            <p className="text-3xl font-bold text-yellow-500">$10,000</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Platform Fees</h4>
            <p className="text-3xl font-bold text-purple-500">$30,000</p>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4">Revenue Breakdown</h3>
        {/* Placeholder for revenue graph */}
        <div className="bg-gray-200 h-40 rounded-md mb-4">Graph: Revenue Breakdown</div>
        {/* Revenue Source Breakdown */}
        <h4 className="text-lg font-semibold mb-2">Revenue Source</h4>
        <div className="bg-gray-100 p-4 rounded-md">
          <p>React Masterclass - $40,000</p>
          <p>Node.js Advanced - $25,000</p>
          <p>Full Stack Bootcamp - $35,000</p>
        </div>
      </div>

      {/* Instructor Payout Management */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Instructor Payout Management</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Instructor</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Earnings</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Paid Amount</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Pending Amount</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor.id}>
                <td className="text-left py-3 px-4">{instructor.name}</td>
                <td className="text-left py-3 px-4">${instructor.totalEarnings}</td>
                <td className="text-left py-3 px-4">${instructor.paidAmount}</td>
                <td className="text-left py-3 px-4">${instructor.pendingAmount}</td>
                <td className="text-left py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                    instructor.pendingAmount === 0 ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {instructor.pendingAmount === 0 ? 'Paid' : 'Pending'}
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

export default AdminPaymentDashboard;
