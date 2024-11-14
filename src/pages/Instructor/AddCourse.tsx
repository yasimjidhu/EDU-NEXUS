import React, { useState, ChangeEvent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Pricing,
  getCourse,
  setCourseInfo,
  updateCourse,
} from "../../components/redux/slices/courseSlice";
import axios from "axios";
import { Image, Video } from "cloudinary-react";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

const AddCourse: React.FC = () => {
  const { categories } = useSelector((state: RootState) => state.category);
  const { user } = useSelector((state: RootState) => state.user);


  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [trial, setTrial] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [category, setCategory] = useState<string>("");
  const [categoryRef, setCategoryRef] = useState<string>(
    categories.length > 0 && categories[0].id ? categories[0].id : ""
  );
  
  const [level, setLevel] = useState<"beginner" | "intermediate" | "expert">(
    "beginner"
  );
  const [instructorRef, setInstructorRef] = useState<string>("");
  const [certificationAvailable, setCertificationAvailable] =
    useState<boolean>(false);
  const [pricing, setPricing] = useState<Pricing>({ type: "free", amount: 0 });
  const [courseAmount, setCourseAmount] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [updateLoading, setUpdateLoading] = useState<boolean>(false); 
  const [mode,setMode]=useState<"add"|"edit">("add")

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    if(location.state){
      setMode("edit")
    }
  },[])


  useEffect(() => {
    if (location.state ) {
      dispatch(getCourse(location.state)).then((res) => {
        const course = res.payload.course;
        setThumbnail(course.thumbnail);
        setTrial(course.trial.video);
        setTitle(course.title);
        setDescription(course.description);
        setCategory(course.category);
        setCategoryRef(course.categoryRef);
        setLevel(course.level);
        setInstructorRef(course.instructorRef);
        setCertificationAvailable(course.certificationAvailable);
        setPricing(course.pricing);
        setCourseAmount(course?.pricing?.amount);
        setLanguage(course.language)
      });
    } else {

      setTitle("");
      setDescription("");
      setCategoryRef(categories.length > 0 && categories[0].id ? categories[0].id : "");
      setInstructorRef(user?._id!)
      setLevel("beginner");
      setCertificationAvailable(false);
      setPricing({ type: "free", amount: 0 });
      setCourseAmount(null);
      setLanguage("English"); // Reset to default
    }
  }, [dispatch, location.state, categories]);

  const handleThumbnailChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageLoading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setImageLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_THUMBNAILS_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      setThumbnail(response.data.secure_url);
    } catch (error: any) {
      toast.error(error.response.data.error.message);
      console.error("Error uploading thumbnail:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleVideoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setVideoLoading(true);

    const file = e.target.files?.[0];
    if (!file) {
      setVideoLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_VIDEO_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData
      );

      setTrial(response.data.secure_url);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error uploading video:", error);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleUpdateCourse = async ()=>{
    setUpdateLoading(true)

    const courseInfo = {
      thumbnail,
      trial,
      title,
      description,
      category,
      categoryRef,
      instructorRef,
      certificationAvailable,
      pricing,
      level,
      courseAmount,
      language,
    };

    try{

      const response = await dispatch(updateCourse({courseId:location.state,course:courseInfo}))
      toast.success(response.payload.message)
      navigate('/instructor/courses')
    }catch(error:any){
      console.log(error)
      toast.error(error.message)
    }finally{
      setUpdateLoading(false)
    }

  }

  const handleNext = async () => {
    setLoading(true); 

    const courseInfo = {
      courseId: location.state? location.state : null,
      thumbnail,
      trial,
      title,
      description,
      category,
      categoryRef,
      instructorRef,
      certificationAvailable,
      pricing,
      level,
      courseAmount,
      language
    };

    try {
      await dispatch(setCourseInfo( courseInfo ));
      navigate("/instructor/add-lesson",{state:location.state});
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error saving course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputClick = (id: string) => {
    document.getElementById(id)?.click();
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory =
      categories.find((cat) => cat.id === selectedCategoryId)?.name || "";
    setCategoryRef(selectedCategoryId);
    setCategory(selectedCategory);
  };

  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLevel = e.target.value;
    setLevel(selectedLevel as "beginner" | "intermediate" | "expert");
  };

  const handleCertificationAvailableChange = () => {
    setCertificationAvailable(!certificationAvailable);
  };

  const handlePricingChange = (type: "free" | "paid") => {
    setPricing({ type, amount: type === "free" ? 0 : courseAmount || 0 });
  };

  useEffect(() => {
    if (pricing.type === "paid" && courseAmount !== null) {
      setPricing((prevPricing) => ({ ...prevPricing, amount: courseAmount }));
    }
  }, [courseAmount]);

  return (
    <div className="">
      <h6 className="inter text-xl text-black text-center">Add Course</h6>
      <div className="grid grid-cols-12 space-x-4">
        <div className="col-span-7 space-y-2 p-4 ">
          <section>
            <h6 className="inter-sm text-blue-700">Course Thumbnail</h6>
            <div
              className="cursor-pointer w-full max-w-md bg-pure-white border-2 border-dashed border-gray-400 h-48  text-center overflow-hidden mt-1 flex justify-center items-center"
              onClick={() => handleInputClick("thumbnail-input")}
            >
              {imageLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <BeatLoader color="#9A1750" />
                </div>
              ) : (
                <>
                  {thumbnail ? (
                    <Image
                      cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
                      publicId={thumbnail}
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
                </>
              )}
              <input
                type="file"
                onChange={handleThumbnailChange}
                className="hidden input-file"
                id="thumbnail-input"
              />
          
            </div>
            {mode == "edit" && (
                <button className="w-full mt-4 sm:w-auto bg-black hover:bg-strong-rose text-white font-bold py-1 px-4 rounded-full" onClick={()=>handleInputClick('thumbnail-input')} type="button">
                Change Thumbnail
              </button>
            )}
          
          </section>
          <section>
            <h6 className="inter-sm text-blue-700">Course Trial</h6>
            <div
              className="cursor-pointer w-full max-w-md bg-pure-white border-2 border-dashed border-gray-400 h-48 text-center overflow-hidden mt-1 flex justify-center items-center"
              onClick={() => handleInputClick("video-input")}
            >
              {videoLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <BeatLoader color="#9A1750" />
                </div>
              ) : (
                <>
                  {trial ? (
                    <Video
                      cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
                      publicId={trial}
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
                </>
              )}
              <input
                type="file"
                onChange={handleVideoChange}
                className="hidden input-file"
                id="video-input"
              />
            </div>
            {mode == "edit" && (
                <button className="w-full mt-4 sm:w-auto bg-black hover:bg-strong-rose text-white font-bold py-1 px-4 rounded-full" onClick={()=>handleInputClick('video-input')} type="button">
                Change Trial
              </button>
            )}
          </section>
          <div className="flex justify-start items-center space-x-4 mt-16 ">
            <input
              type="checkbox"
              checked={certificationAvailable}
              onChange={handleCertificationAvailableChange}
              className="w-4 h-4 cursor-pointer"
            />
            <p className="inter-sm mt-4">Certification available</p>
          </div>
          <div className="mt-8 w-full max-w-md">
            <p className="inter-sm">Pricing</p>
            <div className="flex justify-between space-x-8 mt-2">
              <div className="mt-1 w-1/2">
                <button
                  className={`py-1 w-full px-10 border-gray-300 border-2 rounded-md inter-sm ${
                    pricing?.type === "free"
                      ? "bg-black text-white"
                      : "bg-pure-white"
                  }`}
                  onClick={() => handlePricingChange("free")}
                >
                  Free
                </button>
              </div>
              <div className="mt-1 w-1/2">
                <button
                  className={`py-1 w-full px-10 border-gray-300 border-2 rounded-md inter-sm ${
                    pricing?.type === "paid"
                      ? "bg-blue-500 text-white"
                      : "bg-pure-white"
                  }`}
                  onClick={() => handlePricingChange("paid")}
                >
                  Paid
                </button>
              </div>
            </div>
            {pricing.type === "paid" && (
              <div className="w-full mt-4">
                <label htmlFor="amount" className="text-sm">
                  Amount
                </label>
                <input
                  type="number"
                  value={courseAmount || ""}
                  onChange={(e) =>
                    setCourseAmount(
                      e.target.value !== ""
                        ? parseInt(e.target.value, 10)
                        : null
                    )
                  }
                  className="mt-2 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
                  placeholder="4000"
                />
              </div>
            )}
        
          </div>
        </div>
        <div className="col-span-5 p-4">
          <div>
            <label htmlFor="title" className="text-sm">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
              placeholder="Data structures and algorithms"
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm">
              Course Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
            />
          </div>
          <div>
            <label htmlFor="category" className="text-sm">
              Category
            </label>
            <select
              id="category"
              value={categoryRef}
              onChange={handleCategoryChange}
              className="mt-2 mb-4 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <label htmlFor="level" className="text-sm ">
              Level
            </label>
            <select
              id="course-level"
              className="mt-2 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
              value={level}
              onChange={handleLevelChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <label htmlFor="language" className=" mt-3 block text-sm font-medium text-gray-700">Language</label>
            <select
              id="language"
              name="language"
              className="mt-2 mb-4 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div className="w-full mt-8 flex justify-between space-x-2">
              <button
                className="bg-black py-2 w-full px-5 text-white inter rounded-md"
                onClick={handleUpdateCourse}
                disabled={loading}
              >
                {updateLoading ? <BeatLoader color="white" /> : "Update"}
              </button>
              <button
                className="bg-medium-rose py-2 w-full px-5 text-white inter rounded-md"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <BeatLoader color="white" /> : "Save & Next"}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
