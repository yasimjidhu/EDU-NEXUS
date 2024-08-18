import { uploadToCloudinary } from "../utils/cloudinary";
import { useState } from "react";

export const useFileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
  
    const handleFileSelect = (file: File |null) => {
      console.log('handle file selected',file)
      if (file) {
        setSelectedFile(file);
      }
    };
  
    const uploadFile = async () => {
      console.log('upload file in useupload file',selectedFile)
      if (selectedFile) {
        try {
          const fileUrl = await uploadToCloudinary(selectedFile, setUploadProgress);
          const fileType = selectedFile.type.split('/')[0];
          return { fileUrl, fileType };
        } catch (error) {
          console.error('Error uploading file:', error);
          return null;
        }
      }
      return null;
    };
  
    return { selectedFile, uploadProgress,setUploadProgress, handleFileSelect, uploadFile,setSelectedFile};
  };

  