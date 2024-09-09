import React, { useEffect, useState } from "react";
import Navbar from "../../components/authentication/Navbar";
import "../../index.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { CourseState, getAllCourses } from "../../components/redux/slices/courseSlice";
import { ListCourses } from "../../components/common/ListCourses";
import SkeletonLoader from "../../components/skelton/CourseList";
import { completeOnboarding, setOnboardingCompleted } from "../../components/redux/slices/paymentSlice";
import { toast } from "react-toastify";

const Home = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const onboardingCompleted = useSelector((state: RootState) => state.payment.onboardingCompleted);

  const { categories } = useSelector((state: RootState) => state.category);
  const [allCourses, setAllCourses] = useState([])
  const [searchResults, setSearchResults] = useState<CourseState[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate()
  const page = 1
console.log('user in hiome,',user)
  useEffect(() => {
    if (user?.stripeAccountId && !user.onboardingComplete) {
      console.log('User stripe account ID is present and the function is called:', user.stripeAccountId);
      
      dispatch(completeOnboarding(user.stripeAccountId))
        .then((res: any) => {
          toast.success(res.payload);
          dispatch(setOnboardingCompleted(true)); // Update Redux store after completion
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
    }
  }, [dispatch, user?.stripeAccountId, onboardingCompleted]);


  useEffect(() => {
    fetchCourses(page);
  }, [dispatch, page]);

  const fetchCourses = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await dispatch(getAllCourses({ page })).unwrap();
      if (response.courses.length > 0) {
        setAllCourses(response.courses);
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleSearchResults = (results: CourseState[]) => {
    setSearchResults(results)
  }

  const handleViewClick = (categoryId: string) => {
    navigate(`/viewcategory/${categoryId}`)
  }


  const handleStartClick = (courseId: string) => {
    navigate(`/course-detail/${courseId}`)
  }


  return (
    <>
      <Navbar isAuthenticated={true} onSearch={handleSearchResults} />
      <div className="grid bg-pure-white grid-cols-1 md:grid-cols-2 gap-8 p-5 ">
        <div className=" p-5 flex justify-center items-center text-left">
          <div className="">
            <h1 className="prime-font text-3xl md:text-5xl mb-4 leading-tight">
              Grow up Your skills <br /> by online courses <br /> with{" "}
              <span className="text-medium-rose">Edu-Nexus</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed">
              Edu-Nexus is an interesting platform that will teach you <br /> in
              a more interactive way
            </p>
            <div className="flex mt-6 justify-between items-center w-[55%]">
              {user == null && (
                <div className="bg-purple-500">
                  <Link to="/enrollment">
                    <button className="p-4 bg-medium-rose rounded-3xl font-semibold text-white">
                      Join Now
                    </button>
                  </Link>
                </div>
              )}
              <div>
                <button className="p-4 bg-lite-rose rounded-3xl font-semibold text-black">
                  View Demo
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" p-5 flex justify-center items-center">
          <img
            src="/assets/png/teaching.png"
            alt="Teaching"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      <div className="bg-gray-300 flex flex-col md:flex-row justify-between items-center p-5 md:p-0">
        <div className=" w-full md:w-1/4 text-center p-10">
          <h2 className="font-bold text-2xl">250+</h2>
          <p>Courses by our best mentors</p>
        </div>
        <div className="flex justify-center items-center w-full md:w-auto p-5">
          <img
            src="/assets/png/line.png"
            className="w-20 h-auto"
            alt="Line Divider"
          />
        </div>
        <div className="w-full md:w-1/4 text-center p-10">
          <h2 className="font-bold text-2xl">1000+</h2>
          <p>Courses by our best mentors</p>
        </div>
        <div className="flex justify-center items-center w-full md:w-auto p-5">
          <img
            src="/assets/png/line.png"
            className="w-20 h-auto"
            alt="Line Divider"
          />
        </div>
        <div className="w-full md:w-1/4 text-center p-10">
          <h2 className="font-bold text-2xl">15+</h2>
          <p>Courses by our best mentors</p>
        </div>
        <div className="flex justify-center items-center w-full md:w-auto p-5">
          <img
            src="/assets/png/line.png"
            className="w-20 h-auto"
            alt="Line Divider"
          />
        </div>
        <div className="w-full md:w-1/4 text-center p-10">
          <h2 className="font-bold text-2xl">2400+</h2>
          <p>Courses by our best mentors</p>
        </div>
      </div>
      {searchResults && searchResults.length > 0 && (
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">Search Results</h2>
            <ListCourses allCourses={searchResults} />
          </div>
        </div>
      )}
      <div className="container mx-auto p-3">
        <Link to='/allcategories'><button className="float-end mr-10 mt-5 rounded-3xl font-sans bg-medium-rose inter  px-3 py-2 text-white">
          All Categories
        </button></Link>
      </div>
      <div className="container mt-4">
        <h2 className="text-lg font-semibold mb-5">Top Categories</h2>
        <div>
          {categories && categories.length > 0 && (
            <div className="grid md:grid-cols-4  gap-8 sm:grid-cols-2" >
              {categories.slice(0, 4).map((category, index) => (
                <div
                  key={index}
                  className="border transform hover:scale-105 transition-transform duration-300 cursor-pointer border-gray-200 shadow-xl rounded-md text-center p-6"
                  onClick={() => handleViewClick(category.id)}>
                  <div className="rounded-full mx-auto w-36 h-36 shadow-sm border-2 border-gray-100 overflow-hidden">
                    <img
                      src={`${category.image}`}
                      alt={category.name}
                      className="w-full  h-full object-cover rounded-full"
                    />
                  </div>
                  <h1 className="mt-3 text-md inter ">{category.name}</h1>
                  <p className="text-sm inter">{category.coursesCount} Courses</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-12 flex justify-between p-4" id="last-course">
          <h1 className="text-xl font-semibold">New Courses</h1>
          <Link to='/allcourses'><button className=" rounded-3xl font-sans bg-medium-rose inter  px-3 py-2 text-white">
            AllCourses
          </button></Link>
        </div>
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 px-4">
              {allCourses.slice(0, 4).map((course) => (
                <div key={course._id} className="bg-white text-start rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="h-44 overflow-hidden rounded-md">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                  <h1 className="font-semibold text-md mt-3 truncate">{course.title}</h1>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <img src="/assets/png/lesson.png" className="w-3 h-3 mr-1" alt="" />
                      <p>Lessons: {course.lessons.length}</p>
                    </div>
                    <div className="flex items-center">
                      <img src="/assets/png/student.png" className="w-3 h-3 mr-1" alt="" />
                      <p>Students: {course.enrolledStudentsCount}</p>
                    </div>
                    <div className="flex items-center">
                      <img src="/assets/png/level.png" className="w-3 h-3 mr-1" alt="" />
                      <p>{course.level}</p>
                    </div>
                  </div>
                  <button className="bg-black py-1 px-3 text-white rounded-xl mt-4 flex items-center hover:bg-gray-800 transition-colors duration-300" onClick={() => handleStartClick(course._id)}>
                    Start Course
                    <span className="ml-2">
                      <img src="/assets/png/next.png" alt="" className="w-4" />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="relative ">
          <div className="grid grid-cols-6 gap-4 mt-20">
            <div className="col-span-2 py-20">
              <h1 className="thick-font">Best Instructors</h1>
              <p>
                At The Academy, We Strive To Bring Together The Best <br />
                Professors For The Best Courses
              </p>
              <button className="bg-medium-rose py-2 px-3 text-white rounded-xl mt-10 flex items-center">
                All Instructors
                <span>
                  <img src="/assets/png/next.png" alt="" className="w-4 ml-2" />
                </span>
              </button>
            </div>
            <div className="bg-pure-white col-span-4 mt-12 relative">
              <img
                src="/assets/png/background.png"
                className="rounded-2xl"
                loading="lazy"
                alt=""
              />
              <div className="grid grid-cols-6 gap-6 p-4 absolute top-0 right-16 -mt-16">
                <div className="col-span-2 bg-white p-3 rounded-xl">
                  <img
                    src="/assets/images/person1.png"
                    className="rounded-xl"
                    loading="lazy"
                    alt=""
                  />
                  <div className="flex justify-between mt-4">
                    <h6 className="font-semibold">Jon Kartner</h6>
                    <p>Designer</p>
                  </div>
                </div>
                <div className="col-span-2 bg-white p-3 rounded-xl">
                  <img
                    src="/assets/images/person2.png"
                    className="rounded-xl"
                    alt=""
                  />
                  <div className="flex justify-between mt-4">
                    <h6 className="font-semibold">Jon Kartner</h6>
                    <p>Designer</p>
                  </div>
                </div>
                <div className="col-span-2 bg-white p-3 rounded-xl">
                  <img
                    src="/assets/images/person3.png"
                    className="rounded-xl"
                    loading="lazy"
                    alt=""
                  />
                  <div className="flex justify-between mt-4">
                    <h6 className="font-semibold">Jon Kartner</h6>
                    <p>Designer</p>
                  </div>
                </div>
                <div className="col-span-2 bg-white p-3 rounded-xl">
                  <img
                    src="/assets/images/person4.png"
                    className="rounded-xl"
                    loading="lazy"
                    alt=""
                  />
                  <div className="flex justify-between mt-4">
                    <h6 className="font-semibold">Jon Kartner</h6>
                    <p>Designer</p>
                  </div>
                </div>
                <div className="col-span-2 bg-white p-3 rounded-xl">
                  <img
                    src="/assets/images/person5.png"
                    className="rounded-xl"
                    loading="lazy"
                    alt=""
                  />
                  <div className="flex justify-between mt-4">
                    <h6 className="font-semibold">Jon Kartner</h6>
                    <p>Designer</p>
                  </div>
                </div>
                <div className="col-span-2 bg-white p-3 rounded-xl">
                  <img
                    src="/assets/images/person6.png"
                    className="rounded-xl"
                    loading="lazy"
                    alt="fdfd"
                  />
                  <div className="flex justify-between mt-4">
                    <h6 className="font-semibold">Jon dartner</h6>
                    <p>Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div>
            <h1 className="poppins-semibold text-3xl mt-44 text-center">
              Our <span className="text-medium-rose">Features</span>
            </h1>
            <h6 className="text-center mt-4 ">
              This very extraordinary feature,can make learning activities more
              efficient
            </h6>
          </div>
          <div className="grid grid-cols-2 mt-10 gap-8">
            <div>
              <img src="/assets/images/feature.png" alt="" />
            </div>
            <div className=" p-4">
              <h1 className="poppins-semibold font-bold mb-6">
                A <span className="text-medium-rose">user interface</span>{" "}
                designed <br /> for the classroom
              </h1>
              <div className="flex justify-start items-center mb-4 p-3 rounded-lg">
                <div className="bg-rose-50 rounded-full shadow-2xl p-3 mr-4">
                  <img
                    src="/assets/images/point2.png"
                    className="mx-auto"
                    alt=""
                  />
                </div>
                <h5 className="text-black text-xl">
                  Teachers don’t get lost in the grid view and have a dedicated
                  Podium space.
                </h5>
              </div>
              <div className="flex justify-start items-center mb-4 p-3 rounded-lg">
                <div className="bg-rose-50 rounded-full shadow-2xl p-3 mr-4">
                  <img
                    src="/assets/images/point3.png"
                    className="mx-auto"
                    alt=""
                  />
                </div>
                <h5 className="text-black text-xl">
                  Teacher’s and presenters can be moved to the front of the
                  class.
                </h5>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg">
                <div className="bg-rose-50 rounded-full shadow-2xl p-3 mr-4">
                  <img
                    src="/assets/images/point1.png"
                    className="mx-auto"
                    loading="lazy"
                    alt=""
                  />
                </div>
                <h5 className="text-black text-xl">
                  Teachers can easily see all students and class data at one
                  time.
                </h5>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="py-20">
              <h1 className="text-2xl">
                {" "}
                <span className="text-medium-rose poppins-normal font-bold">
                  Tools
                </span>{" "}
                for Teachers <br /> And Learners
              </h1>
              <h4 className="text-2xl mt-5 ">
                Class has a dynamic set of teaching tools built to <br />
                be deployed and used during class. Teachers can <br />
                handout assignments in real-time for students to <br /> complete
                and submit.
              </h4>
            </div>
            <div className="poppins-normal">
              <img src="/assets/images/feature2.png" loading="lazy" width="80%" alt="" />
            </div>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <img src="/assets/images/feature3.png" loading="lazy" alt="" />
            </div>
            <div className="">
              <h1 className="poppins-semibold">
                <span className="text-medium-rose">Assessments</span>, <br />
                <span className="text-black">Quizzes</span>,
                <span className="text-medium-rose">Tests</span>
              </h1>
              <h4 className="text-2xl  mt-8">
                Easily launch live assignments, quizzes, and tests. <br />
                Student results are automatically entered in the <br />
                online gradebook.
              </h4>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
