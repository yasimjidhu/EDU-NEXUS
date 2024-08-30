import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
  student: {
    name: "John Doe",
    email: "johndoe@example.com",
    joinedDate: "2023-01-15",
    totalCourses: 5,
    completedCourses: 3,
    averageGrade: 85,
  },
  courseProgress: [
    { name: "Web Development", progress: 100, grade: 92 },
    { name: "Data Science", progress: 75, grade: 88 },
    { name: "UI/UX Design", progress: 60, grade: 78 },
    { name: "Machine Learning", progress: 40, grade: null },
    { name: "Mobile App Development", progress: 10, grade: null },
  ],
  examResults: [
    { name: "Web Development Final", score: 92, date: "2023-05-15" },
    { name: "Data Science Midterm", score: 88, date: "2023-06-30" },
    { name: "UI/UX Design Project", score: 78, date: "2023-07-20" },
  ],
};

const StudentOverview = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Student Overview</h1>
        
        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold">{mockData.student.name}</h2>
              <p className="text-gray-600">{mockData.student.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Joined: {mockData.student.joinedDate}</p>
              <p className="text-sm text-gray-600">Total Courses: {mockData.student.totalCourses}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-600 font-semibold">Completed Courses</p>
              <p className="text-3xl font-bold text-blue-800">{mockData.student.completedCourses}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 font-semibold">Average Grade</p>
              <p className="text-3xl font-bold text-green-800">{mockData.student.averageGrade}%</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-600 font-semibold">Course Completion</p>
              <p className="text-3xl font-bold text-purple-800">
                {Math.round((mockData.student.completedCourses / mockData.student.totalCourses) * 100)}%
              </p>
            </div>
          </div>
        </div>
        
        {/* Course Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
          <div className="space-y-4">
            {mockData.courseProgress.map((course, index) => (
              <div key={index} className="flex items-center">
                <div className="w-1/4 font-medium">{course.name}</div>
                <div className="w-1/2">
                  <div className="bg-gray-200 rounded-full h-4 w-full">
                    <div 
                      className="bg-blue-600 rounded-full h-4" 
                      style={{width: `${course.progress}%`}}
                    ></div>
                  </div>
                </div>
                <div className="w-1/4 text-right">
                  {course.grade ? `${course.grade}%` : 'In Progress'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Exam Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Recent Exam Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Exam Name</th>
                  <th className="px-4 py-2 text-left">Score</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockData.examResults.map((exam, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-2">{exam.name}</td>
                    <td className="px-4 py-2">{exam.score}%</td>
                    <td className="px-4 py-2">{exam.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.courseProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#3B82F6" name="Progress" />
              <Bar dataKey="grade" fill="#10B981" name="Grade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;