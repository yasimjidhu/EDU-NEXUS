import React, { useEffect, useState } from "react";
import { FaStar, FaBook, FaComments, FaDollarSign } from "react-icons/fa";
import { getAllUsers, StudentState } from "../redux/slices/studentSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";

const DisplayPopularInstructors = ({ data }) => {
    const [allUsers, setAllUsers] = useState<StudentState>([]);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllUsers()).then(res => setAllUsers(res.payload));
    }, [dispatch]);

    function getUser(userId) {
        return allUsers.find(user => user._id === userId) || { firstName: 'Unknown', lastName: '', image: '/path/to/default/image.png' }; // Default image
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Instructors Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((instructor, index) => {
                    const user = getUser(instructor.instructorId);
                    return (
                        <div
                            key={index}
                            className="bg-white shadow-lg cursor-pointer rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={user?.profile?.avatar}
                                    alt={`${user?.firstName} ${user?.lastName}`}
                                    className="w-12 h-12 rounded-full mr-4 object-cover"
                                />
                                <h2 className="text-2xl font-semibold text-blue-600">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                            </div>

                            <div className="flex items-center mb-2">
                                <FaBook className="text-gray-600 mr-2" />
                                <p className="text-gray-600">
                                    <strong>Total Courses:</strong> {instructor.totalCourses}
                                </p>
                            </div>

                            <div className="flex items-center mb-2">
                                <FaStar className="text-yellow-500 mr-2" />
                                <p className="text-gray-600">
                                    <strong>Total Rating:</strong> {instructor.totalRating}
                                </p>
                            </div>

                            <div className="flex items-center mb-2">
                                <FaComments className="text-gray-600 mr-2" />
                                <p className="text-gray-600">
                                    <strong>Total Reviews:</strong> {instructor.totalReviews}
                                </p>
                            </div>

                            <h3 className="text-lg font-medium mt-4 mb-2">Courses:</h3>
                            <ul className="list-disc pl-5">
                                {instructor.courseNames.map((course, i) => (
                                    <li key={i} className="text-gray-700">
                                        {course}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DisplayPopularInstructors;