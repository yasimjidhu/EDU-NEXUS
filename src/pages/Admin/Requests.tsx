import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { useNavigate } from 'react-router-dom';
import { fetchUnVerifiedInstructors, fetchVerifiedInstructors } from '../../components/redux/slices/instructorSlice';
import { toast } from 'react-toastify';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/dateFormater';
import { ApproveInstructor, RejectInstructor } from '../../components/redux/slices/studentSlice';
import { fetchCourseRequests, approveCourse, rejectCourse } from '../../components/redux/slices/courseSlice';
import { getAllCategories } from '../../components/redux/slices/adminSlice';


const Requests: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [instructorEmail, setInstructorEmail] = useState<string>('');
  const [show, setShow] = useState<"users" | "courses">("users");
  const [unpublishedCourses, setUnpublishedCourses] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [verifiedInstructors, setVerifiedInstructors] = useState([])
  const [unVerifiedInstructors, setUnVerifiedInstructors] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [approvedInstructors, setApprovedInstructors] = useState([]);
  const [rejectedInstructors, setRejectedInstructors] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [rejectedCourses, setRejectedCourses] = useState([]);


  const { user } = useSelector((state: RootState) => state.user);
  const { courseRequests } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    dispatch(fetchCourseRequests(currentPage)).then((res) => {
      setUnpublishedCourses(res.payload.courses);
    });
    dispatch(getAllCategories(currentPage)).then((res) => setAllCategories(res.payload.categories));
    dispatch(fetchVerifiedInstructors()).then((res) => setVerifiedInstructors(res.payload.instructors));
    dispatch(fetchUnVerifiedInstructors()).then((res) => setUnVerifiedInstructors(res.payload.instructors));
  }, [dispatch, currentPage, approvedInstructors, rejectedInstructors, approvedCourses, rejectedCourses]);

  const handleApproval = async (email) => {
    try {
      await dispatch(ApproveInstructor({ email }));
      toast.success('Instructor approved successfully');
      setApprovedInstructors((prev) => [...prev, email]);
    } catch (error) {
      toast.error('Error occurred');
      console.log(error);
    }
  };

  const handleRejection = async (email) => {
    try {
      await dispatch(RejectInstructor({ email }));
      toast.success('Instructor rejected successfully');
      setRejectedInstructors((prev) => [...prev, email]);
    } catch (error) {
      toast.error('Error occurred');
      console.log(error);
    }
  };

  const handleCourseApproval = async (courseId, email) => {
    try {
      await dispatch(approveCourse({ courseId, email }));
      toast.success('Course approved successfully');
      setApprovedCourses((prev) => [...prev, courseId]);
    } catch (error) {
      toast.error('Error occurred');
      console.log(error);
    }
  };

  const handleCourseRejection = async (courseId, email) => {
    try {
      await dispatch(rejectCourse({ courseId, email }));
      toast.success('Course rejected successfully');
      setRejectedCourses((prev) => [...prev, courseId]);
    } catch (error) {
      toast.error('Error occurred');
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = show === "users"
    ? (unVerifiedInstructors ? unVerifiedInstructors.slice(indexOfFirstItem, indexOfLastItem) : [])
    : (unpublishedCourses ? unpublishedCourses.slice(indexOfFirstItem, indexOfLastItem) : []);

  const totalPages = show === "users"
    ? (unVerifiedInstructors ? Math.ceil(unVerifiedInstructors.length / itemsPerPage) : 1)
    : (unpublishedCourses ? Math.ceil(unpublishedCourses.length / itemsPerPage) : 1);

  const switchShow = () => {
    setShow((prev) => (prev === "users" ? "courses" : "users"));
    setCurrentPage(1);
  };

  enum Need {
    NAME = "name",
    PROFILE = "profile",
    EMAIL = "email"
  }

  interface Instructor {
    _id: string;
    firstName: string;
    lastName: string;
    profile: string;
    email: string;
  }

  const getInstructorData = (
    instructorId: string,
    need: Need
  ): string | Instructor | null => {
    const instructor = verifiedInstructors.find(
      (inst: Instructor) => inst._id === instructorId
    );

    if (!instructor) {
      return null;
    }

    if (need === Need.NAME) {
      return `${instructor.firstName} ${instructor.lastName}`;
    } else if (need === Need.PROFILE) {
      return instructor.profile.avatar;
    } else if (need == Need.EMAIL) {
      return instructor.email
    }

    return instructor;
  };

  const getCategoryName = (categoryId: string): string | undefined => {
    const category = allCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className="">
      <div className="flex justify-end mb-4">
        <button
          className={`py-1 px-2 rounded-lg mr-2 ${show === "users"
            ? "bg-medium-rose text-white"
            : "bg-strong-rose text-white"
            }`}
          onClick={switchShow}
        >
          {show === "users" ? "Switch to Courses" : "Switch to Users"}
        </button>
      </div>
      {currentItems.length > 0 ? (
        <div className="rounded-xl shadow-md p-4 bg-pure-white max-w-6xl mx-auto ">
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
                    {!approvedInstructors.includes(item.email) && !item.isVerified ? (
                      <>
                        <a href={`${item.cv}`}
                          className="text-center bg-black text-white inter py-1 px-3 rounded-lg cursor-pointer"
                        >
                          View CV
                        </a>
                        <button
                          className="text-center bg-medium-rose text-white inter py-1 px-3 rounded-lg cursor-pointer"
                          onClick={() => {
                            setInstructorEmail(item.email);
                            handleApproval(item.email);
                          }}
                        >
                          Approve
                        </button>
                      </>
                    ) : null}
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
                        src={`${getInstructorData(course.instructorRef, "profile")}`}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h4 className="inter mt-2">{getInstructorData(course.instructorRef, "name")}</h4>
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
                      onClick={() => handleCourseApproval(course._id, getInstructorData(course.instructorRef, "email"))}
                    >
                      Approve
                    </button>
                    <button
                      className="text-center bg-strong-rose text-white inter py-1 px-3 rounded-lg cursor-pointer"
                      onClick={() => handleCourseRejection(course._id, getInstructorData(course.instructorRef, "email"))}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <div className="w-[35%] text-center">
            <img src="/assets/images/nothing.jpg" alt="No Courses" className="mb-4 w-full" />
            <h4 className="text-xl">No {show} Requests Available</h4>
          </div>
        </div>
      )}
      {unVerifiedInstructors.length > 10 || verifiedInstructors.length > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Requests;