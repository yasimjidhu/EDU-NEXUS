import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCourseInfo } from "../../components/redux/slices/courseSlice";
import axios from "axios";
import { Image, Video } from "cloudinary-react";
import { RootState } from "../../components/redux/store/store";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

const AddCourse: React.FC = () => {
  
  const { categories } = useSelector((state: RootState) => state.category);

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [trial, setTrial] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categoryRef, setCategoryRef] = useState<string>(categories.length > 0 ? categories[0].id : '');
  const [instructorRef, setInstructorRef] = useState<string>("");
  const [certificationAvailable, setCertificationAvailable] =
    useState<boolean>(false);
  const [pricing, setPricing] = useState<"free" | "paid">("free");
  const [courseAmount, setCourseAmount] = useState<number | null>(null);
  const [imageLoading, setimageLoading] = useState<boolean>(false);
  const [videoLoading, setvideoLoading] = useState<boolean>(false);

  const { loading } = useSelector((state: RootState) => state.course);

  const { user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const thumbnailPreset = import.meta.env.VITE_CLOUDINARY_THUMBNAILS_PRESET;
  const videosPreset = import.meta.env.VITE_CLOUDINARY_VIDEO_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const handleThumbnailChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setimageLoading(true);
    setInstructorRef(user._id);
    const file = e.target.files?.[0];
    if (!file) {
      
      setimageLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", thumbnailPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      setThumbnail(response.data.secure_url);
    } catch (error:any) {
      toast.error(error.response.data.error.message)
      console.error("Error uploading thumbnail:", error);
    } finally {
      setimageLoading(false);
    }
  };

  const handleVideoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setvideoLoading(true);

    const file = e.target.files?.[0];
    if (!file) {
      setvideoLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", videosPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData
      );
      console.log("response of video upload", response);
      setTrial(response.data.secure_url);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error uploading video:", error);
    } finally {
      setvideoLoading(false);
    }
  };

  const handleNext = () => {
    dispatch(
      setCourseInfo({
        thumbnail,
        trial,
        title,
        description,
        category,
        categoryRef,
        instructorRef,
        certificationAvailable,
        pricing,
        courseAmount,
      })
    );
    console.log("instructor ref", instructorRef);
    navigate("/instructor/add-lesson");
  };

  const handleInputClick = (id: string) => {
    document.getElementById(id)?.click();
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory =
      categories.find((cat) => cat.id === selectedCategoryId)?.name || "";
    console.log("selected category", selectedCategory);
    console.log("selected categoryid", selectedCategoryId);
    setCategoryRef(selectedCategoryId);
    setCategory(selectedCategory);
  };

  const handleCertificationAvailableChange = () => {
    setCertificationAvailable(!certificationAvailable);
  };

  const handlePricingChange = (price: "free" | "paid") => {
    setPricing(price);
  };

  return (
    <div className="ml-52">
      <div className="grid grid-cols-12 space-x-4">
        <div className="col-span-7 space-y-2 p-4">
          <section>
            <h6 className="inter-sm text-blue-700">Course Thumbnail</h6>
            <div
              className="cursor-pointer w-full max-w-md bg-pure-white border-2 border-dashed border-gray-400 h-64 text-center overflow-hidden mt-1 flex justify-center items-center"
              onClick={() => handleInputClick("thubmnail-input")}
            >
              {imageLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <BeatLoader color="#9A1750" />
                </div>
              ) : (
                <>
                  {thumbnail ? (
                    <Image
                      cloudName={cloudName}
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
                className="hidden input-file "
                id="thubmnail-input"
              />
            </div>
          </section>
          <section>
            <h6 className="inter-sm text-blue-700">Course Trial</h6>
            <div
              className="cursor-pointer w-full max-w-md bg-pure-white border-2 border-dashed border-gray-400 h-64 text-center overflow-hidden mt-1 flex justify-center items-center"
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
                      cloudName={cloudName}
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
          </section>
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
              placeholder="Data structured and algorithms"
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
              className="mt-2 w-full bg-pure-white rounded-lg py-2 px-3 text-md"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-start items-center space-x-4 mt-10">
            <input
              type="checkbox"
              checked={certificationAvailable}
              onChange={handleCertificationAvailableChange}
              className="w-4 h-4 cursor-pointer"
            />
            <p className="inter-sm">Certification available</p>
          </div>
          <div className="mt-6">
            <p className="inter-sm">Pricing</p>
            <div className="flex justify-between space-x-8 mt-2">
              <div className="mt-1 w-1/2">
                <button
                  className={`py-1 w-full px-10 border-gray-300 border-2 rounded-md inter-sm ${
                    pricing === "free"
                      ? "bg-blue-500 text-white"
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
                    pricing === "paid"
                      ? "bg-blue-500 text-white"
                      : "bg-pure-white"
                  }`}
                  onClick={() => handlePricingChange("paid")}
                >
                  Paid
                </button>
              </div>
            </div>
            {pricing == "paid" && (
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
            <div className="w-full mt-8">
              <button
                className="bg-medium-rose py-1 w-full px-10 text-white inter rounded-md"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <BeatLoader color="white" /> : "Save & Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
