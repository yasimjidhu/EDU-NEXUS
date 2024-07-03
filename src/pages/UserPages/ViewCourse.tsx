import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PlayCircle, Clock, FileText } from 'lucide-react';
import { getCourse, updateLessonProgress } from '../../components/redux/slices/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import Navbar from '../../components/Instructor/Navbar';
import ReactPlayer from 'react-player';

interface Attachment {
  title?: string;
  url?: string;
}

interface Lesson {
  _id?: string;
  lessonNumber: string;
  title: string;
  description: string;
  video: string;
  duration?: string;
  attachments: Attachment[];
}

interface Pricing {
  type: "free" | "paid";
  amount: number;
}

interface Trial {
  video?: string;
}

interface CourseEntity {
  courseId?: string;
  title: string;
  description: string;
  thumbnail: string;
  instructorRef: string;
  category: string;
  categoryRef: string;
  lessons: Lesson[];
  pricing: Pricing;
  level?: "beginner" | "intermediate" | "expert";
  certificationAvailable: boolean;
  isRequested: boolean;
  isBlocked: boolean;
  isPublished: boolean;
  isRejected: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  language?: string;
  trial?: Trial;
}

const ViewCourse: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseEntity | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<{ [key: string]: number }>({});
  const [totalLesson,setTotalLesson]=useState<number>(0)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await dispatch(getCourse(courseId));
        setCourse(response.payload.course);
  
        if (response.payload.course.lessons.length > 0) {
          setTotalLesson(response.payload.course.lessons.length)
          setCurrentLesson(response.payload.course.lessons[0]);
        }
  
        const initialProgress = response.payload.course.lessons.reduce((acc, lesson) => {
          acc[lesson.lessonNumber] = 0;
          return acc;
        }, {});
  
        setLessonProgress(initialProgress);
  
        // Load completed lessons from local storage
        const savedCompletedLessons = localStorage.getItem(`completedLessons-${courseId}-${user._id}`);
        if (savedCompletedLessons) {
          setCompletedLessons(new Set(JSON.parse(savedCompletedLessons)));
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
  
    fetchCourse();
  }, [courseId, dispatch, user]);
  

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleVideoProgress = useCallback((progress: number) => {
    if (!currentLesson || !user) return;
  
    setLessonProgress(prev => ({
      ...prev,
      [currentLesson.lessonNumber]: progress
    }));
  
    if (progress >= 95 && !completedLessons.has(currentLesson._id || '')) {
      dispatch(updateLessonProgress({
        userId: user._id,
        courseId,
        lessonId: currentLesson._id || '',
        progress: 100,
        totalLesson: totalLesson,
      })).then(() => {
        const updatedCompletedLessons = new Set(completedLessons).add(currentLesson._id || '');
        setCompletedLessons(updatedCompletedLessons);
        localStorage.setItem(`completedLessons-${courseId}-${user._id}`, JSON.stringify(Array.from(updatedCompletedLessons)));
      }).catch(error => {
        console.error('Error updating lesson progress:', error);
      });
    }
  }, [currentLesson, user, courseId, dispatch, completedLessons, totalLesson]);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content area */}
            <div className="lg:w-2/3">
              {/* Video player */}
              {currentLesson && (
                <div className="bg-black w-full h-96 rounded-lg overflow-hidden shadow-lg mb-6">
                  <ReactPlayer
                    url={currentLesson.video}
                    controls
                    width="100%"
                    height="100%"
                    onProgress={({ played }) => handleVideoProgress(played * 100)}
                  />
                </div>
              )}

              {/* Video info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">{currentLesson?.title || course.title}</h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                    <span className="flex items-center"><Clock size={16} className="mr-1" /> {course.lessons.length} lessons</span>
                    <span className="flex items-center"><FileText size={16} className="mr-1" /> {course.level}</span>
                  </div>
                </div>
                <p className="text-gray-600">{currentLesson?.description || course.description}</p>
              </div>

              {/* Attachments */}
              {currentLesson?.attachments && currentLesson.attachments.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                  <ul className="space-y-2">
                    {currentLesson.attachments.map((attachment, index) => (
                      <li key={index} className="flex items-center">
                        <FileText size={16} className="mr-2 text-blue-500" />
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">{attachment.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar - Lesson list */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Course Content</h2>
                <ul className="space-y-2">
  {course.lessons.map((lesson, index) => (
    <li
      key={lesson.lessonNumber}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        currentLesson?.lessonNumber === lesson.lessonNumber
          ? 'bg-gray-100'
          : 'hover:bg-gray-50'
      }`}
      onClick={() => handleLessonClick(lesson)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
          {index + 1}
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-gray-800">{lesson.title}</h3>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <PlayCircle size={12} className="mr-1" />
            <span className="mr-2">Video</span>
            {lesson.duration && (
              <>
                <Clock size={12} className="mr-1" />
                <span>{lesson.duration}</span>
              </>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${lessonProgress[lesson.lessonNumber]}%` }}
            ></div>
          </div>
          {completedLessons.has(lesson._id || '') && (
            <div className="text-green-600 font-semibold mt-2">
              Lesson Completed
            </div>
          )}
        </div>
      </div>
    </li>
  ))}
</ul>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCourse;
