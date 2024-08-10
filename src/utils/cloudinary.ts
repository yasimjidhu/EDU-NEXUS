// utils/cloudinary.ts

export const uploadToCloudinary = async (file: File, setUploadProgress: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_CHAT_FILES_PRESET); // Replace with your Cloudinary upload preset
  
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, true); // Use correct Cloudinary cloud name
  
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress); // Update progress state
        }
      };
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      };
  
      xhr.onerror = () => {
        reject(new Error('Upload failed'));
      };
  
      xhr.send(formData);
    });
  };
  