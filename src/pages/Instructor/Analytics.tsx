import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Mock data - replace with actual data in a real application
const courseData = [
  { name: 'Web Development', students: 120, profit: 6000, rating: 4.5 },
  { name: 'Data Science', students: 80, profit: 4000, rating: 4.2 },
  { name: 'Mobile App Dev', students: 100, profit: 5000, rating: 4.7 },
  { name: 'Machine Learning', students: 90, profit: 5500, rating: 4.6 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const totalStudents = courseData.reduce((sum, course) => sum + course.students, 0);
  const totalProfit = courseData.reduce((sum, course) => sum + course.profit, 0);
  const averageRating = (courseData.reduce((sum, course) => sum + course.rating, 0) / courseData.length).toFixed(1);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Instructor Analytics </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {courseData.map((course, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
            <p>Students: {course.students}</p>
            <p>Profit: ${course.profit}</p>
            <p>Rating: {course.rating}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
        <p>Total Students: {totalStudents}</p>
        <p>Total Profit: ${totalProfit}</p>
        <p>Average Rating: {averageRating}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Students per Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Profit Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseData}
                dataKey="profit"
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
                <th className="text-left p-2">Students</th>
                <th className="text-left p-2">Profit</th>
                <th className="text-left p-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {courseData.map((course, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <td className="p-2">{course.name}</td>
                  <td className="p-2">{course.students}</td>
                  <td className="p-2">${course.profit}</td>
                  <td className="p-2">{course.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;