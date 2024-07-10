import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { addCategory, getAllCategories } from "../redux/slices/adminSlice";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: Category) => void;
}

export interface Category {
  _id:string;
  name: string;
  description: string;
  image: File | string|null;
}

const MAX_DESCRIPTION_WORDS = 150; // Adjust as needed

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | string>("");
  const [imagePreview, setImagePreview] = useState("");

  const { loading } = useSelector((state: RootState) => state.category);
  const dispatch: AppDispatch = useDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= MAX_DESCRIPTION_WORDS) {
      setDescription(text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "" || description.trim() === "" || !image) {
      toast.error("Please fill in all the fields");
      return;
    }

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_CATEGORY_PRESET;

      const formDataUpload = new FormData();
      formDataUpload.append("file", image as File);
      formDataUpload.append("upload_preset", uploadPreset);
      formDataUpload.append("cloud_name", cloudName);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formDataUpload
      );
      const imageUrl = response.data.secure_url;

      const payload = {
        name,
        description,
        image: imageUrl,
      };

      const data = await dispatch(addCategory(payload))
      console.log('response of add cateogory in modal',data)
      if(data.payload.error){
        toast.error(data.payload.error)
        return
      }
      await dispatch(getAllCategories())
      toast.success("Category added successfully");
      onAddCategory(payload);
    } catch (error) {
      console.log("Error in frontend:", error);
      if(error instanceof AxiosError){
        const err = error.response.data.error.message
        toast.error(err)
        return
      }
      toast.error(error);
    }

    setName("");
    setDescription("");
    setImage("");
    setImagePreview("");
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          id="crud-modal"
          tabIndex={-1}
          aria-hidden="false"
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-700 bg-opacity-50"
        >
          <div className="relative p-4 h-[90%] w-full  max-w-md bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Category
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                data-modal-toggle="crud-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type category name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Image
                  </label>
                  <div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      name="image"
                      id="image"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                    <div className="flex justify-center w-full ">
                      <div className="w-24 h-24">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-2  w-full h-full object-cover "
                        />
                      )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    rows={4}
                    maxLength={MAX_DESCRIPTION_WORDS}
                    name="description"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Write category description (max ${MAX_DESCRIPTION_WORDS} words)`}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center justify-center bg-black w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {loading ? <BeatLoader color="white" /> : " Add new Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryModal;
