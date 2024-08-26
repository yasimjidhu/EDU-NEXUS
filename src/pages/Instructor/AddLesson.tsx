import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../components/redux/store/store";
import {
  clearCourseInfo,
  getCourse,
  submitCourse,
  updateCourse,
  updateLesson,
} from "../../components/redux/slices/courseSlice";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { Video } from "cloudinary-react";
import { toast } from "react-toastify";
import { PlusCircle, Save, File, X, ChevronDown, ChevronUp ,Edit} from "lucide-react";
import { Lesson } from "../../types/course";

const AddLesson: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    title: "",
    description: "",
    video: "",
    attachments: []
  });
  const [attachmentTitle, setAttachmentTitle] = useState<string>("");
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [attachmentLoading, setAttachmentLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [index,setIndex] = useState<number>(0)
  const [expandedLessonIndex, setExpandedLessonIndex] = useState<number>(-1);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number>(-1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const course = useSelector((state: RootState) => state.course);

  useEffect(() => {
    if (location.state) {
      setMode("edit");
      dispatch(getCourse(location.state) as any).then((res: any) => {
        setLessons(res.payload.course.lessons);
      });
    }
  }, [location.state, dispatch]);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    fileType: 'video' | 'attachment'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const setLoading = fileType === 'video' ? setVideoLoading : setAttachmentLoading;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      fileType === 'video'
        ? import.meta.env.VITE_CLOUDINARY_VIDEO_PRESET
        : import.meta.env.VITE_CLOUDINARY_ATTACHMENTS_PRESET
    );

    const resourceType = fileType === 'video' ? 'video' : 'raw';

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        formData
      );

      if (fileType === 'video') {
        setCurrentLesson((prev) => ({
          ...prev,
          video: response.data.secure_url,
          duration: response.data.duration?.toString(),
        }));
      } else {
        const newAttachment: any = {
          title: attachmentTitle || file.name,
          url: response.data.secure_url
        };
        setCurrentLesson((prev) => ({
          ...prev,
          attachments: [...prev.attachments, newAttachment],
        }));
        setAttachmentTitle("");
      }
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      toast.error(`Failed to upload ${fileType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Lesson, value: string) => {
    setCurrentLesson((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddOrUpdateLesson = () => {
    if (!currentLesson.title || !currentLesson.video) {
      toast.error("Please add a title and upload a video before adding/updating the lesson.");
      return;
    }

    if (editingLessonIndex > -1) {
      // Update existing lesson
      setLessons((prev) =>
        prev.map((lesson, index) =>
          index === editingLessonIndex ? { ...currentLesson, lessonNumber: (index + 1).toString() } : lesson
        )
      );
      setEditingLessonIndex(-1);
      toast.success("Lesson updated successfully");
    } else {
      // Add new lesson
      setLessons((prev) => [...prev, { ...currentLesson, lessonNumber: (prev.length + 1).toString() }]);
      toast.success("Lesson added successfully");
    }

    setCurrentLesson({
      title: "",
      description: "",
      video: "",
      attachments: []
    });
  };

  const handleEditLesson = (index: number) => {
    setCurrentLesson(lessons[index]);
    setIndex(index)
    setEditingLessonIndex(index);
    setExpandedLessonIndex(-1);
  };

  const handleRemoveAttachment = (index: number) => {
    setCurrentLesson((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitCourse = async () => {
    if (lessons.length === 0) {
      toast.error("Please add at least one lesson before submitting the course.");
      return;
    }
    const updatedLessons = lessons.map((lesson, index) => ({
      ...lesson,
      lessonNumber: (index + 1).toString()
    }));
    try {
      if (mode === "add") {
        await dispatch(submitCourse({ ...course, lessons: updatedLessons }) as any);
        toast.success("Course submitted successfully");
      } else {
        await dispatch(updateLesson({ courseId: location.state, lessons: updatedLessons }) as any);
        toast.success("Lesson updated successfully");
      }
      await dispatch(clearCourseInfo());
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Error submitting/updating course:", error);
      toast.error("Failed to submit/update course. Please try again.");
    }
  };

  const handleInputClick = (id: string) => {
    document.getElementById(id)?.click();
  };

  const toggleLessonDetails = (index: number) => {
    setExpandedLessonIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 ">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {mode === "edit" ? "Edit Course" : "Add Course"}
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingLessonIndex > -1 ? "Edit Lesson" : "Add New Lesson"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Title
            </label>
            <input
              type="text"
              value={currentLesson.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lesson Title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Description
            </label>
            <textarea
              value={currentLesson.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lesson Description"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Video
            </label>
            <div
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleInputClick("video-input")}
            >
              {videoLoading ? (
                <BeatLoader color="#4F46E5" />
              ) : currentLesson.video ? (
                <Video
                  cloudName={cloudName}
                  publicId={currentLesson.video}
                  controls
                  width="100%"
                  height="100%"
                />
              ) : (
                <div className="text-center">
                  <img src="/assets/icon/video.png" alt="Video" className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload video</p>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, 'video')}
              className="hidden"
              id="video-input"
              accept="video/*"
            />
          </div>
        <div>
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Attachments
          </label>
          <div className="mb-2">
          <input
            type="text"
            value={currentLesson.attachments && currentLesson.attachments.length > 0 ? currentLesson.attachments[0].title : ""}
            onChange={(e) => setAttachmentTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Attachment Title"
          />
        </div>
 
            <div
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleInputClick("attachments-input")}
            >
              {attachmentLoading ? (
                <BeatLoader color="#4F46E5" />
              ) : currentLesson.attachments.length > 0 ? (
                <ul className="w-full px-4">
                  {currentLesson.attachments.map((attachment, index) => (
                    <li key={index} className="flex items-center justify-between mb-2">
                      <a
                        href={attachment.url}
                        download
                        className="flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <File className="w-4 h-4 mr-2" />
                        {attachment.title}
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAttachment(index);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <File className="w-5 h-5 text-center" />
                  <p className="text-sm text-gray-500 mt-2">Click to upload attachment</p>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, 'attachment')}
              className="hidden"
              id="attachments-input"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
            onClick={handleAddOrUpdateLesson}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {editingLessonIndex > -1 ? 'Update Lesson' : 'Add Lesson'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Course Lessons</h2>
        {lessons.length === 0 ? (
          <p className="text-gray-500">No lessons added yet.</p>
        ) : (
          <ul className="space-y-4">
            {lessons.map((lesson, index) => (
              <li key={index} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Lesson {index + 1}: {lesson.title}
                  </h3>
                  <div>
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEditLesson(index)}
                    >
                      <Edit/>
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => toggleLessonDetails(index)}
                    >
                      {expandedLessonIndex === index ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </div>
                {expandedLessonIndex === index && (
                  <>
                    <p className="text-gray-600">{lesson.description}</p>
                    {lesson.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Attachments:</p>
                        <ul className="list-disc list-inside">
                          {lesson.attachments.map((attachment, i) => (
                            <li key={i}>{attachment.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between">
        <button
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          onClick={() => navigate("/home")}
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
          onClick={handleSubmitCourse}
        >
          <Save className="w-5 h-5 mr-2" />
          {mode === "edit" ? "Update Course" : "Submit Course"}
        </button>
      </div>
    </div>
  );
};

export default AddLesson;

