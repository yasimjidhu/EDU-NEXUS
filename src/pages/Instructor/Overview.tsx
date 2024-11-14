import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Text } from 'recharts';
import { getInstructorCourseDetailed, getInstructorsStudentsOverview } from '../../components/redux/slices/courseSlice';
import { getInstructorCoursesTransaction } from '../../components/redux/slices/paymentSlice';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { getAllUsers } from '../../components/redux/slices/studentSlice';
import InstructorAnalyticsSkeleton from '../../components/skelton/InstructorOverview';
import Pagination from '../../components/common/Pagination';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomizedAxisTick = ({ x, y, payload }: { x: any, y: any, payload: any }) => {
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


const InstructorOverview = () => {
    const [courseData, setCourseData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<any>(true);
    const [error, setError] = useState<any>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<any>('');
    const [studentsOverview, setStudentsOverview] = useState<any>(null);
    const [totalEnrollments, setTotalEnrollments] = useState<any>(0);
    const [enrolledStudentIds, setEnrolledStudentIds] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [allUsers, setAllUsers] = useState<any>([]);
    const [totalPages, setTotalPages] = useState<number>(0);

    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);

    useDocumentTitle('Overview');
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            setIsLoading(true);

            try {
                // Fetch courses data
                const coursesResponse = await dispatch(getInstructorCourseDetailed(user._id));
                const courses = coursesResponse.payload as any;
                
                if (courses.length === 0) {
                    throw new Error('You don/t have any uploaded courses. Please upload a course first.');
                }

                // Set default selected course ID if not already set
                if (!selectedCourseId) {
                    setSelectedCourseId(courses[0]._id);
                }

                // Calculate total enrollments across all courses
                const totalEnrollments = courses.reduce((acc: any, course: any) => acc + course.enrolledStudentsCount, 0);
                setTotalEnrollments(totalEnrollments);

                // Fetch payments data
                const paymentsResponse = await dispatch(getInstructorCoursesTransaction({
                    instructorId: user._id,
                    limit: 50,
                    page: currentPage
                })) as any

                const payments = paymentsResponse.payload.transactions 
                setTotalPages(paymentsResponse.payload.totalPages);

                // Combine course and payment data
                const combinedData = courses.map((course: any) => {
                    const coursePayments = payments.filter((payment: any) => payment.courseId === course._id);
                    return {
                        id: course._id,
                        name: course.title,
                        studentsEnrolled: course.enrolledStudentsCount,
                        totalRevenue: coursePayments.reduce((sum: any, payment: any) => sum + (payment.instructorAmount / 100), 0),
                        instructorRevenue: coursePayments.reduce((sum: any, payment: any) => sum + (payment.instructorAmount / 100), 0),
                        averageRating: course.averageRating || 0,
                    };
                });

                setCourseData(combinedData);

            } catch (error: any) {
                setError(error.message);
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dispatch, user?._id, selectedCourseId, currentPage]);

    useEffect(() => {
        const fetchStudentsData = async () => {
            if (user?._id && selectedCourseId) {
                try {
                    const resultAction = await dispatch(getInstructorsStudentsOverview({ instructorId: user._id, courseId: selectedCourseId }));

                    if (getInstructorsStudentsOverview.fulfilled.match(resultAction)) {
                        const studentsData = resultAction.payload;
                        setStudentsOverview(studentsData[0]);
                        const studentIds = studentsData[0].enrolledStudents.map((item: any) => item.userId);
                        setEnrolledStudentIds(studentIds);
                    } else {
                        console.error('Failed to fetch students data:', resultAction.payload);
                    }
                } catch (error: any) {
                    console.error('Error dispatching getInstructorsStudentsOverview:', error);
                }
            }
        };

        fetchStudentsData();
    }, [dispatch, user?._id, selectedCourseId]);

    useEffect(() => {
        dispatch(getAllUsers()).then((res: any) => setAllUsers(res.payload));

    }, []);


    const handlePageChange = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    };

    
    console.log(studentsOverview)
    console.log(enrolledStudentIds)
    console.log(allUsers)

    if(error){
        console.log(error)
    }
    if (isLoading) return <div className="text-center p-4"><InstructorAnalyticsSkeleton /></div>;

    const totalRevenue = courseData.reduce((sum: any, course: any) => sum + course.totalRevenue, 0);
    const averageRating = courseData.length > 0
        ? (courseData.reduce((sum: any, course: any) => sum + course.averageRating, 0) / courseData.length).toFixed(1)
        : 'N/A';

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Instructor Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {courseData.map((course: any, index: any) => (
                    <div key={index} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                        <p>Students Enrolled: {totalEnrollments}</p>
                        <p>Average Rating: {course.averageRating.toFixed(1)}</p>
                        <p className='mt-2'>
                            Revenue:
                            <span
                                className={`ml-2 text-md inter ${course.instructorRevenue === 0 ? 'text-red-600' : 'text-green-600'}`}
                            >
                                $ {course.instructorRevenue.toFixed(2)}
                            </span>
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
                <p>Total Students: {totalEnrollments}</p>
                <p>Average Rating: {averageRating}</p>
                <p className='mt-2'> Total Revenue: <span className='text-xl inter text-green-600'>$ {totalRevenue.toFixed(2)}</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Students per Course</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={courseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" height={60} tick={CustomizedAxisTick} interval={0} />
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
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, value }: any) => `${name}: $${value.toFixed(2)}`}
                            >
                                {courseData.map(( index: any) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default InstructorOverview;
