import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { useParams } from "react-router-dom";
import {
  CourseState,
  getCourse,
} from "../../components/redux/slices/courseSlice";
import { Video } from "cloudinary-react";

const CourseDetails = () => {
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const [courseData, setCourseData] = useState<CourseState | null>(null);
  const [trial, setTrial] = useState<string | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

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

    fetchCourse();
  }, []);

  const { user } = useSelector((state: RootState) => state.auth);

  if (!courseData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-details-container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 ml-52">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="course-header flex flex-col md:flex-row items-start">
          <div className="course-thumbnail w-full md:w-1/2 mb-6 md:mb-0 md:mr-8">
            <img
              src={courseData.thumbnail}
              alt="Course Thumbnail"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="course-info w-full md:w-1/2">
            <h1 className="course-title text-3xl font-bold mb-4">
              {courseData.title}
            </h1>
            <p className="course-description text-gray-600 mb-6">
              {courseData.description}
            </p>
            <div className="course-details grid grid-cols-2 gap-4">
              <div className="detail flex items-center">
                <img
                  src="duration-icon.png"
                  alt="Duration Icon"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-gray-800">
                  {courseData.lessons[0].duration}
                </span>
              </div>
              <div className="detail flex items-center">
                <img
                  src="level-icon.png"
                  alt="Level Icon"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-gray-800">
                  {courseData.level ? courseData.level : "Level"}
                </span>
              </div>
              <div className="detail flex items-center">
                <img
                  src="lessons-icon.png"
                  alt="Lessons Icon"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-gray-800">
                  {courseData.lessons.length} Lessons
                </span>
              </div>
              <div className="detail flex items-center">
                <img
                  src="students-icon.png"
                  alt="Students Icon"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-gray-800">
                  {courseData.students ? courseData.students : "Students"} Students
                </span>
              </div>
            </div>
            <button className="enroll-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-6">
              Enroll Now
            </button>
          </div>
        </div>

        <div className="course-trailer mt-10 bg-gray-100 p-12 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Course Trailer</h2>
          <div className="video-container relative h-0" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={trial}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>

        <div className="instructor-info mt-10">
          <h2 className="text-2xl font-bold mb-4">Instructor</h2>
          <div className="instructor-details flex flex-col md:flex-row items-center">
            <div className="instructor-image w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
              <img
                src={courseData.instructorRef}
                alt="Instructor Image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="instructor-bio">
              <h3 className="text-xl font-bold mb-2">{courseData.instructorName}</h3>
              <p className="text-gray-600 mb-4">{courseData.instructorBio}</p>
              <div className="instructor-social flex">
                <a href="#" target="_blank" className="mr-2" rel="noreferrer">
                  <img
                    src="linkedin-icon.png"
                    alt="LinkedIn Icon"
                    className="w-6 h-6"
                  />
                </a>
                <a href="#" target="_blank" className="mr-2" rel="noreferrer">
                  <img
                    src="twitter-icon.png"
                    alt="Twitter Icon"
                    className="w-6 h-6"
                  />
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <img
                    src="website-icon.png"
                    alt="Website Icon"
                    className="w-6 h-6"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
