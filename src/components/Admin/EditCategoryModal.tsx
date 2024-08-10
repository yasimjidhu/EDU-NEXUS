import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";
import { BeatLoader } from "react-spinners";

interface Category {
  _id: string|null|undefined;
  name: string;
  description: string;
  image: File | string | null;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  initialData?: Partial<Category>;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData._id || "");
      setCategoryName(initialData.name || "");
      setDescription(initialData.description || "");
      setImage(initialData.image || null);
    }
  }, [initialData]);

  const handleSave = () => {
    onSave({ _id: categoryId, name: categoryName, description, image });
    onClose();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageLoading(true)
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_CATEGORY_PRESET;

      const formDataUpload = new FormData();
      formDataUpload.append("file", e.target.files[0]);
      formDataUpload.append("upload_preset", uploadPreset);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formDataUpload
        );
        const imageUrl: string = response.data.secure_url;
        setImage(imageUrl);
      } catch (error:any) {
        console.error("Image upload failed:", error);
      }finally{
        setImageLoading(false)
      }
    }
  };

  if (!isOpen) return null;

  const MAX_DESCRIPTION_WORDS = 150;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= MAX_DESCRIPTION_WORDS) {
      setDescription(text);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 bg-gray-50 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Category</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                value={categoryName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                onChange={handleDescriptionChange}
                rows={4}
                name="description"
                value={description}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Write category description (max ${MAX_DESCRIPTION_WORDS} words)`}
              />
            </div>
            <div>
            <div className="mt-1 flex items-center justify-center">
                <input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {image && !imageLoading && (
                  <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="Uploaded" width='40%' />
                )}
            
              </div>
              <label
                htmlFor="image"
                className="cursor-pointer mt-4 flex justify-center items-center w-full py-1 bg-black text-white rounded-md hover:bg-gray-900 transition duration-300"
              >
                {image && imageLoading ?  <BeatLoader color={"white"} /> : "Change Image"}
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center space-x-3 p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={imageLoading}
            className="px-4 py-2 bg-medium-rose text-white rounded-md hover:bg-strong-rose transition-colors"
          >
            Save changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditCategoryModal;
