import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { useParams } from "react-router-dom";
import {
  CourseState,
  checkEnrollment,
  enrollToCourse,
  getCourse,
} from "../../components/redux/slices/courseSlice";
import {
  Book,
  Users,
  GraduationCap,
  Linkedin,
  Twitter,
  Globe,
  Languages,
  DollarSign,
  Video,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Paperclip,
} from "lucide-react";
import { fetchAllInstructors } from "../../components/redux/slices/instructorSlice";
import Navbar from "../../components/authentication/Navbar";
import { CompletionStatus } from "../../types/enrollment";
import { toast } from "react-toastify";

const CourseDetails: React.FC<CourseDetailsProps> = () => {
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const [courseData, setCourseData] = useState<CourseState | null>(null);
  const [trial, setTrial] = useState<string | null>(null);
  const [allInstructors, setAllInstructors] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [openLesson, setOpenLesson] = useState(null);
  const [enrolled, setEnrolled] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.user);
  const userData = useSelector((state: RootState) => state.auth);

  const toggleLesson = (index) => {
    setOpenLesson(openLesson === index ? null : index);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await dispatch(getCourse(id as string));
        setCourseData(course.payload.course);
        setTrial(course.payload.course.trial.video);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    dispatch(fetchAllInstructors()).then((res: any) => {
      setAllInstructors(res.payload.instructors);
    });
    fetchCourse();
  }, [dispatch, id]);

  useEffect(() => {
    if (courseData?._id && user?._id) {
      const checkUserEnrollment = async () => {
        try {
          const res = await dispatch(
            checkEnrollment({ courseId: courseData._id, userId: user._id })
          ).unwrap();
          setEnrolled(res.studentEnrolled);
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
      };

      checkUserEnrollment();
    }
  }, [dispatch, courseData, user, enrolled]);

  const handleSubmitReview = () => {
    console.log("Submitting review:", { text: reviewText, rating });
    setReviewText("");
    setRating(0);
  };

  const handleEnrollment = async (courseId: string) => {
    const enrollmentInfo = {
      userId: user?._id,
      courseId: courseId,
      enrolledAt: new Date().toISOString(),
      completionStatus: CompletionStatus.Enrolled,
      progress: {
        completedLessons: [],
        completedAssessments: [],
        overallCompletionPercentage: 0,
      },
    };
    try {
      const enrolledStudent = await dispatch(enrollToCourse(enrollmentInfo));
      setEnrolled(true);
      toast.success(enrolledStudent.payload.message);
    } catch (error: any) {
      toast.error(error.message);
    }
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
    const instructor = allInstructors.find(
      (inst: Instructor) => inst._id === instructorId
    );

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

  if (!courseData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="inter text-2xl mt-4 font-bold mb-4">
                {courseData.title}
              </h1>
              <div className="flex justify-center">
                <img
                  src={courseData.thumbnail}
                  alt="Course Thumbnail"
                  className="w-full rounded-lg shadow-lg mb-6"
                />
              </div>
              <p className="text-gray-600 mb-6">{courseData.description}</p>
              <div className="flex justify-between items-center">
                {courseData.pricing.type === "free" ? (
                  <div className="flex ">
                    <DollarSign className="w-6 h-6 mr-2 text-green-700" />
                    <h1 className="text-xl inter text-green-700">Free</h1>
                  </div>
                ) : (
                  <div className="flex ">
                    <DollarSign className="w-6 h-6 mr-2 text-green-700" />
                    <span className="inter text-xl text-green-700">
                      {courseData.pricing.amount}
                    </span>
                  </div>
                )}
                <div></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 mt-6">
                <div className="flex items-center">
                  <Languages className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm">{courseData.language}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm">{courseData.level || "Level"}</span>
                </div>
                <div className="flex items-center">
                  <Book className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm">
                    {courseData.lessons.length} Lessons
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm">
                    {courseData.students || "0"} Students
                  </span>
                </div>
              </div>
              {enrolled ? (
                <h1 className="text-green-800  font-bold mr-2">
                  Already enrolled
                </h1>
              ) : (
                <button
                  className="w-full sm:w-auto bg-black hover:bg-strong-rose text-white font-bold py-1 px-4 rounded-full"
                  onClick={() => handleEnrollment(courseData._id)}
                >
                  Enroll Now
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Instructor</h2>
              <div className="flex items-center ">
                <img
                  src={getInstructorData(courseData.instructorRef, "profile")}
                  alt="Instructor"
                  className="w-20 h-20 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold mt-4">
                    {getInstructorData(courseData.instructorRef, "name")}
                  </h3>
                  <p className="text-gray-600 mb-4"></p>
                  <div className="flex space-x-2">
                    <button className="p-2 border bg-gray-200 rounded-full hover:bg-gray-100">
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button className="p-2 border bg-gray-200 rounded-full hover:bg-gray-100">
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button className="p-2 border bg-gray-200 rounded-full hover:bg-gray-100">
                      <Globe className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* New Review Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 mt-4">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>

              {/* Existing Reviews */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Student Reviews</h3>
                {/* This is a placeholder. You would typically map over an array of reviews from your data */}
                <div className="border-t pt-4">
                  <p className="text-gray-600">
                    Great course! I learned a lot and the instructor was very
                    helpful.
                  </p>
                </div>
                {/* You can add more review items here */}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Course Trailer</h2>
                <div className="relative pb-[56.25%]">
                  <iframe
                    src={trial || ""}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-lg mb-2">Course Highlights</h3>
                <ul className="list-disc list-inside">
                  <li>Learn at your own pace</li>
                  <li>Access to exclusive resources</li>
                  <li>Certificate upon completion</li>
                  <li>24/7 support from instructors</li>
                </ul>
              </div>

              <div className="space-y-2">
                {courseData.lessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full text-left bg-white p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                      onClick={() => toggleLesson(index)}
                    >
                      <span className="font-semibold">
                        Lesson {index + 1}: {lesson.title}
                      </span>
                      {openLesson === index ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    {openLesson === index && (
                      <div className="p-4 bg-white">
                        <div className="mb-4">
                          <div className="relative pb-[56.25%]">
                            <iframe
                              src={lesson.video || ""}
                              frameBorder="0"
                              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute top-0 left-0 w-full h-full rounded-lg"
                            ></iframe>
                          </div>
                        </div>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Description
                          </h3>
                          <p className="text-sm text-gray-600">
                            {lesson.description}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Attachments
                          </h3>
                          {lesson.attachments &&
                          lesson.attachments.length > 0 ? (
                            <ul className="space-y-2">
                              {lesson.attachments.map((item, attachIndex) => (
                                <li
                                  key={attachIndex}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <Paperclip className="w-4 h-4 mr-2 text-blue-500" />
                                    <span className="text-sm">
                                      {item.title}
                                    </span>
                                  </div>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-500 hover:text-blue-700"
                                  >
                                    <span className="text-sm mr-1">View</span>
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No attachments for this lesson.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
