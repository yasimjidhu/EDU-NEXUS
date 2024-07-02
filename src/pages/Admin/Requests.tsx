import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { useNavigate } from 'react-router-dom';
import { fetchAllInstructors } from '../../components/redux/slices/instructorSlice';
import { toast } from 'react-toastify';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/dateFormater';
import { ApproveInstructor, RejectInstructor } from '../../components/redux/slices/studentSlice';
import { fetchCourseRequests } from '../../components/redux/slices/courseSlice';
import { getAllCategories } from '../../components/redux/slices/adminSlice';
import { string } from 'yup';

const Requests: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [instructorEmail, setInstructorEmail] = useState<string>('');
  const [approvedInstructors, setApprovedInstructors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState<"users" | "courses">("users");
  const [unpublishedCourses,setUnpublishedCourses] = useState([])
  const [allCategories,setAllCategories] = useState([])

  const { loading, allInstructors, data, error } = useSelector((state: RootState) => state.instructor);
  const { user } = useSelector((state: RootState) => state.user);
  const { courseRequests } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    dispatch(fetchAllInstructors());
    dispatch(fetchCourseRequests()).then((res)=>setUnpublishedCourses(res.payload.courses))
    dispatch(getAllCategories()).then((res)=>setAllCategories(res.payload))
  }, [dispatch]);
  console.log('all categories',allCategories)
  // useEffect(() => {
  //   dispatch(fetchAllInstructors());
  //   dispatch(fetchCourseRequests()).then((res)=>console.log('res of second',res))
  // }, [user]);

  const handleApproval = async (email: string) => {
    try {
      await dispatch(ApproveInstructor({ email }));
      toast.success('Instructor approved successfully');
      setApprovedInstructors([...approvedInstructors, email]);
    } catch (error) {
      toast.error('Error occurred');
      console.log(error);
    }
  };

  const handleRejection = async (email: string) => {
    try {
      await dispatch(RejectInstructor({ email }));
      toast.success('Instructor rejected successfully');
    } catch (error) {
      toast.error('Error occurred');
      console.log(error);
    }
  };

  // const handleCourseApproval = async (courseId: string) => {
  //   try {
  //     await dispatch(ApproveCourse({ courseId }));
  //     toast.success('Course approved successfully');
  //   } catch (error) {
  //     toast.error('Error occurred');
  //     console.log(error);
  //   }
  // };

  // const handleCourseRejection = async (courseId: string) => {
  //   try {
  //     await dispatch(RejectCourse({ courseId }));
  //     toast.success('Course rejected successfully');
  //   } catch (error) {
  //     toast.error('Error occurred');
  //     console.log(error);
  //   }
  // };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = show === "users"
    ? (allInstructors ? allInstructors.instructors.slice(indexOfFirstItem, indexOfLastItem) : [])
    : (unpublishedCourses ? unpublishedCourses.slice(indexOfFirstItem, indexOfLastItem) : []);

  const totalPages = show === "users"
    ? (allInstructors ? Math.ceil(allInstructors.instructors.length / itemsPerPage) : 1)
    : (unpublishedCourses ? Math.ceil(unpublishedCourses.length / itemsPerPage) : 1);

  const switchShow = () => {
    setShow((prev) => (prev === "users" ? "courses" : "users"));
    setCurrentPage(1);
  };

  enum Need {
    NAME = "name",
    PROFILE = "profile",
  }

  interface Instructor {
    _id: string;
    firstName: string;
    lastName: string;
    profile: string;
  }

  const getInstructorData = (
    instructorId: string,
    need: Need
  ): string | Instructor | null => {
    const instructor = allInstructors.instructors.find(
      (inst: Instructor) => inst._id === instructorId
    );
    console.log("Found instructor:", instructor);

    if (!instructor) {
      return null;
    }

    if (need === Need.NAME) {
      return `${instructor.firstName} ${instructor.lastName}`;
    } else if (need === Need.PROFILE) {
      return instructor.profile.avatar;
    }

    return null;
  };

  const getCategoryName = (categoryId: string): string | undefined => {
    // alert(categoryId)
    const category = allCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className="">
      <div className="flex justify-end mb-4">
        <button
          className={`py-1 px-2 rounded-lg mr-2 ${
            show === "users"
              ? "bg-medium-rose text-white"
              : "bg-strong-rose text-white"
          }`}
          onClick={switchShow}
        >
          {show === "users" ? "Switch to Courses" : "Switch to Users"}
        </button>
      </div>
      <div className="rounded-xl shadow-md p-4 bg-pure-white max-w-6xl mx-auto ml-52">
        {show === "users" ? (
          <>
            <div className="grid grid-cols-12 justify-between gap-4 text-sm">
              <div className="col-span-3">
                <h2 className="inter">User</h2>
              </div>
              <div className="col-span-2">
                <h2 className="inter">Email Address</h2>
              </div>
              <div className="col-span-2 flex justify-center items-start">
                <h2 className="inter">Qualification</h2>
              </div>
              <div className="col-span-2 flex justify-center items-center">
                <h2 className="inter">Date</h2>
              </div>
              <div className="col-span-3 flex justify-center items-start">
                <h2 className="inter">Action</h2>
              </div>
            </div>
            <div className="border-2 border-gray-300 w-full mt-2"></div>
            {currentItems.map((item: any) => (
              <div key={item._id} className="grid grid-cols-12 items-center py-2 text-sm">
                <div className="flex col-span-3 justify-start items-center space-x-2">
                  <div className="rounded-full w-10 h-10 shadow-sm border-2 border-gray-600 overflow-hidden">
                    <img
                      src={`${item.profile.avatar}?${new Date().getTime()}`}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="inter">{item.firstName} {item.lastName}</h4>
                </div>
                <div className="col-span-2 text-justify">
                  <h4 className="inter">{item.email}</h4>
                </div>
                <div className="col-span-2 flex justify-center items-center text-justify">
                  <h6 className="inter-sm">{item.qualification}</h6>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                  <h3 className="inter">{formatDate(item.profile.dateOfBirth)}</h3>
                </div>
                <div className="col-span-3 flex justify-end items-center space-x-2">
                  {!approvedInstructors.includes(item.email) && !item.isVerified && (
                    <button
                      className="text-center bg-medium-rose text-white inter py-1 px-3 rounded-lg cursor-pointer"
                      onClick={() => {
                        setInstructorEmail(item.email);
                        handleApproval(item.email);
                      }}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    className="text-center bg-strong-rose text-white inter py-1 px-3 rounded-lg cursor-pointer"
                    onClick={() => {
                      handleRejection(item.email);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="grid grid-cols-12 justify-between gap-4 text-sm">
              <div className="col-span-3">
                <h2 className="inter">Instructor</h2>
              </div>
              <div className="col-span-3">
                <h2 className="inter">Course</h2>
              </div>
              <div className="col-span-2 flex justify-center items-start">
                <h2 className="inter">Category</h2>
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <h2 className="inter">Date</h2>
              </div>
              <div className="col-span-3 flex justify-center items-start">
                <h2 className="inter">Action</h2>
              </div>
            </div>

            <div className="border-2 border-gray-300 w-full mt-2"></div>

            {currentItems?.map((course) => (
        <div key={course._id} className="grid grid-cols-12 items-center py-2 text-sm">
          <div className="flex space-x-3 col-span-3 text-justify">
          <div className="  rounded-full w-10 h-10 shadow-sm border-2 border-gray-600 overflow-hidden">
                    <img
                      src={`${getInstructorData(course.instructorRef,"profile")}`}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="inter mt-2">{getInstructorData(course.instructorRef,"name")}</h4>
          </div>
          <div className="flex col-span-3 justify-start items-center space-x-2">
            <h4 className="inter">{course.title}</h4>
          </div>
          <div className="col-span-2 flex justify-center items-center text-justify">
            <h6 className="inter">{getCategoryName(course.categoryRef)}</h6>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <h3 className="inter">{formatDate(course.createdAt)}</h3>
          </div>
          <div className="col-span-3 flex justify-end items-center space-x-2">
            <button
              className="text-center bg-black text-white inter py-1 px-3 rounded-lg cursor-pointer"
              onClick={() => navigate(`/admin/course-detail/${course._id}`)}
            >
              View
            </button>
            <button
              className="text-center bg-medium-rose text-white inter py-1 px-3 rounded-lg cursor-pointer"
              // onClick={() => handleCourseApproval(course._id)}
            >
              Approve
            </button>
            <button
              className="text-center bg-strong-rose text-white inter py-1 px-3 rounded-lg cursor-pointer"
              // onClick={() => handleCourseRejection(course._id)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
          </>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Requests;