import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../components/redux/store/store";
import { axiosInstance } from "../../constants/axiosInstance";
import {
  addLesson,
  getCourse,
  submitCourse,
} from "../../components/redux/slices/courseSlice";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { Image, Video } from "cloudinary-react";
import { toast } from "react-toastify";

const AddLesson: React.FC = () => {

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [attachmentsTitle, setAttachmentsTitle] = useState<string>("");
  const [duration, setduration] = useState<number | null>(null);
  

  const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [attachmentLoading, setAttachmentLoading] = useState<boolean>(false);
  const [mode,setMode]=useState<"add"|"edit">("add")

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const course = useSelector((state: RootState) => state.course);
  const {user} = useSelector((state:RootState)=>state.auth)

  useEffect(()=>{
    if(course.courseId){
      setMode("edit")
    }
  },[])

  useEffect(() => {
    if (mode=="edit") {
      dispatch(getCourse(course.courseId)).then((res) => {
        const lesson = res.payload.course;
        console.log('editmode',lesson)
        // setThumbnail(course.thumbnail);
        // setTrial(course.trial.video);
        // setTitle(course.title);
        // setDescription(course.description);
        // setCategory(course.category);
        // setCategoryRef(course.categoryRef);
        // setLevel(course.level);
        // setInstructorRef(course.instructorRef);
        // setCertificationAvailable(course.certificationAvailable);
        // setPricing(course.pricing);
        // setCourseAmount(course?.pricing?.amount);
      });
    } else {

      // setTitle("");
      // setDescription("");
      // setCategoryRef(categories.length > 0 ? categories[0].id : "");
      // setLevel("beginner");
      // setCertificationAvailable(false);
      // setPricing({ type: "free", amount: 0 });
      // setCourseAmount(null);
    }
  }, [dispatch, mode]);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const handleFileChange =
    (
      setter: React.Dispatch<React.SetStateAction<File | null>>,
      urlSetter: React.Dispatch<React.SetStateAction<string>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      preset: string,
      resourceType: "image" | "video" | "raw" = "raw",
      durationSetter?: React.Dispatch<React.SetStateAction<number | null>>
    ) =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const file = event.target.files?.[0] || null;
      setter(file);
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", preset);

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
            }/${resourceType}/upload`,
            formData
          );
          console.log('response of uploads',response)
          urlSetter(response.data.secure_url);

          if (resourceType === "video" && durationSetter) {
            const duration = response.data.duration;
            durationSetter(duration);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

  const handleAddLesson = async () => {
    console.log('handel Add lesson called')
    const thumbnailPromise = thumbnail
      ? handleFileChange(
          setThumbnail,
          setThumbnailUrl,
          setThumbnailLoading,
          import.meta.env.VITE_CLOUDINARY_THUMBNAILS_PRESET,
          "image"
        )
      : Promise.resolve();
    const videoPromise = video
      ? handleFileChange(
          setVideo,
          setVideoUrl,
          setVideoLoading,
          import.meta.env.VITE_CLOUDINARY_VIDEO_PRESET,
          "video",
          setduration
        )
      : Promise.resolve();

    const attachmentPromise = attachment
      ? handleFileChange(
          setAttachment,
          setAttachmentUrl,
          setAttachmentLoading,
          import.meta.env.VITE_CLOUDINARY_ATTACHMENTS_PRESET
        )
      : Promise.resolve();

    await Promise.all([thumbnailPromise, videoPromise, attachmentPromise])

    console.log('Video duration:', duration);

    const lesson = {
      title,
      description,
      video: videoUrl,
      duration: duration?.toString(), 
      attachments:{
        title:attachmentsTitle,
        url:attachmentUrl
      }
    };
  

    console.log('added lesson',lesson)
    await dispatch(addLesson(lesson));

    const updatedCourse = {
      ...course,
      lessons: [...course.lessons, lesson],
    };

    await dispatch(submitCourse(updatedCourse) as any);
    toast.success('course added successfully')
    navigate("/home"); 
  };

  const handleInputClick = (id: string) => {
    document.getElementById(id)?.click();
  };

  return (
    <div className="ml-52">
      <h1 className="inter">Add Lesson</h1>
      <div className="grid grid-cols-12 space-x-4">
        <div className="col-span-7 p-4 space-y-2">
          <div>
            <label htmlFor="title" className="text-sm">
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
              placeholder="Lesson Title"
            />
          </div>
          <div className="w-full mx-auto bg-pure-white border-2 border-dashed border-gray-400 h-72 text-center p-4 overflow-hidden flex flex-col justify-center items-center mt-2" onClick={()=>handleInputClick('lesson-thumb')}>
            <div className="cursor-pointer w-full h-full flex justify-center items-center">
              {thumbnailLoading ? (
                <div className="w-16 h-auto">
                  <BeatLoader color="#9A1750" />
                </div>
              ) : thumbnailUrl ? (
                <Image
                  cloudName={cloudName}
                  publicId={thumbnailUrl}
                  width="100%"
                  crop="scale"
                />
              ) : (
                <img
                  src="/assets/icon/gallery.png"
                  alt="Thumbnail"
                  className="w-16 h-auto object-contain"
                />
              )}
              <input
                type="file"
                onChange={handleFileChange(
                  setThumbnail,
                  setThumbnailUrl,
                  setThumbnailLoading,
                  import.meta.env.VITE_CLOUDINARY_THUMBNAILS_PRESET,
                  "image"
                )}
                className="hidden"
                id="lesson-thumb"
              />
            </div>
           {/* {thumbnailUrl == "" && (<p className="mt-2 inter">Upload Thumbnail</p>)}  */}
          </div>
          <div>
            <label htmlFor="description" className="text-sm">
              Lesson Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
              placeholder="Lesson Description"
            />
          </div>
          <div className="w-full mx-auto bg-pure-white border-2 border-dashed border-gray-400 h-80 text-center p-4 overflow-hidden flex flex-col justify-center items-center mt-2" onClick={()=>handleInputClick('video-input')}>
            <div className="cursor-pointer w-full h-full flex justify-center items-center">
              {videoLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <BeatLoader color="#9A1750" />
                </div>
              ) : videoUrl ? (
                <Video
                  cloudName={cloudName}
                  publicId={videoUrl}
                  controls
                  width="100%"
                />
              ) : (
                <img
                  src="/assets/icon/video.png"
                  alt="Video"
                  className="w-16 h-auto object-contain"
                />
              )}
              <input
                type="file"
                onChange={handleFileChange(
                  setVideo,
                  setVideoUrl,
                  setVideoLoading,
                  import.meta.env.VITE_CLOUDINARY_VIDEO_PRESET,
                  "video"
                )}
                className="hidden"
                id="video-input"
              />
            </div>

          </div>
          <div className="flex justify-between space-x-8 mt-2">
            <div className="mt-1 w-1/2">
              <button className="bg-pure-white inter py-1 w-full px-10 border-gray-300 border-2 rounded-md">
                Cancel
              </button>
            </div>
            <div className="mt-1 w-1/2">
              <button
                className="bg-medium-rose py-1 w-full px-10 text-white inter rounded-md"
                onClick={handleAddLesson}
              >
                Add Lesson
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-5 p-4">
          <h6 className="inter-sm text-blue-700">Lesson Attachments</h6>
          <div>
            <input
              type="text"
              value={attachmentsTitle}
              onChange={(e) => setAttachmentsTitle(e.target.value)}
              className="mt-2 w-full bg-pure-white rounded-md py-2 px-3 text-md"
              placeholder="Attachments Title"
            />
          </div>
          <div className="w-full mx-auto bg-pure-white border-2 border-dashed border-gray-400 h-52 text-center p-4 overflow-hidden flex flex-col justify-center items-center mt-2 cursor-pointer" onClick={()=>handleInputClick('attachments-input')}>
            <div className="cursor-pointer">
              {attachmentLoading ? (
                <div className="w-16 h-auto">
                  <BeatLoader color="#9A1750" />
                </div>
              ) : attachmentUrl ? (
                <a
                  href={attachmentUrl}
                  download
                  className="flex items-center justify-center w-full h-full bg-pure-white hover:bg-blue-200 border-2 border-dashed border-gray-400 rounded-md py-1 px-3"
                >
                  <img
                    src="/assets/icon/file.png"
                    className="w-10 h-10 object-contain"
                  />
                  <button className="text-md py-1 px-3 rounded-full text-white bg-black ml-2">
                    view Attachment
                  </button>
                </a>
              ) : (
                <a
                  href="#"
                  className="flex items-center justify-center w-full h-full bg-pure-white hover:bg-blue-200 border-2 border-dashed border-gray-400 rounded-md py-1 px-3"
                >
                  <img
                    src="/assets/icon/file.png"
                    className="w-10 h-10 object-contain"
                  />
                </a>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange(
                setAttachment,
                setAttachmentUrl,
                setAttachmentLoading,
                import.meta.env.VITE_CLOUDINARY_ATTACHMENTS_PRESET
              )}
              className="hidden"
              id="attachments-input"
            />
            {attachmentUrl == "" && (<p className="mt-2 inter">Upload or Drag and Drop Attachment</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLesson