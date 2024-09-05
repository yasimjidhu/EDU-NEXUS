import IAssessment from '../../types/assessments';
import { getStudentAssessments, getStudentCourseOverview } from '../../components/redux/slices/courseSlice';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentOverview = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [overview, setOverview] = useState<any>({ courses: [], overallAverageGrade: 0 });
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getStudentCourseOverview(user._id))
        .then((res) => {
          setOverview(res.payload[0] || {}); // Update state with the first item in the array
        })
        .catch((err) => console.error('Error fetching course overview:', err));

      dispatch(getStudentAssessments(user._id)).then((res) => setAssessments(res.payload));
    }
  }, [dispatch, user]);

  const transformStudentOverviewData = (data: any) => {
    const courses = data.courses || [];
    const totalCourses = courses.length;
    const completedCourses = courses.filter((course) => course.progress === 100).length;
    const averageGrade = courses.reduce((sum, course) => sum + (course.averageGrade || 0), 0) / totalCourses;

    const courseProgress = courses.map((course) => ({
      name: course.courseTitle, // Use courseTitle for display
      progress: course.progress,
      grade: course.averageGrade || 0,
      completedAssessmentId: course.completedAssessmentIds[0],
    }));

    return {
      studentInfo: {
        totalCourses,
        completedCourses,
        averageGrade: isNaN(averageGrade) ? 0 : averageGrade,
      },
      courseProgress,
    };
  };

  const getAssessmentDetails = (id: string) => {
    const assessment = assessments.find((item) => item.completedAssessmentId === id);
    return assessment ? assessment.studentAssessments[0] : null;
  };

  const { studentInfo, courseProgress } = transformStudentOverviewData(overview);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Student Overview</h1>

        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold">{`${user?.firstName} ${user?.lastName}`}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Joined: {new Date(user?.createdAt).toDateString()}</p>
              <p className="text-sm text-gray-600">Total Courses: {studentInfo.totalCourses}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-600 font-semibold">Completed Courses</p>
              <p className="text-3xl font-bold text-blue-800">{studentInfo.completedCourses}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 font-semibold">Average Score</p>
              <p className="text-3xl font-bold text-green-800">{studentInfo.averageGrade.toFixed(0)}%</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-600 font-semibold">Course Completion</p>
              <p className="text-3xl font-bold text-purple-800">
                {Math.round((studentInfo.completedCourses / studentInfo.totalCourses) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
          <div className="space-y-4">
            {courseProgress.map((course, index) => (
              <div key={index} className="flex items-center">
                <div className="w-1/4 font-medium">{course.name}</div>
                <div className="w-1/2">
                  <div className="bg-gray-200 rounded-full h-4 w-full">
                    <div
                      className="bg-blue-600 rounded-full h-4"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-1/4 text-right">{course.progress ? `${course.progress}%` : 'In Progress'}</div>
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
                  <th className="px-4 py-2 text-left">Your Score</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {courseProgress.map((item, index) => {
                  const data = getAssessmentDetails(item.completedAssessmentId);
                  if (data) {
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-4 py-2">{data.title}</td>
                        <td className="px-4 py-2">{item.grade}</td>
                        <td className="px-4 py-2">{data.total_score}</td>
                        <td
                          className={`px-4 py-2 font-semibold ${
                            item.grade >= data.passing_score ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {item.grade >= data.passing_score ? 'Passed' : 'Failed'}
                        </td>
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#3B82F6" name="Progress" />
              <Bar dataKey="grade" fill="#10B981" name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
