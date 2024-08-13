

export const uploadToCloudinary = async (file: File, setUploadProgress: (progress: number) => void): Promise<string> => {
  
  return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_CHAT_FILES_PRESET); // Replace with your Cloudinary upload preset

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, true); // Use correct Cloudinary cloud name

      xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100)
              setUploadProgress(progress);
          }
      };

      xhr.onload = () => {
          if (xhr.status === 200) {
              try {
                  const response = JSON.parse(xhr.responseText);
                  setUploadProgress(0);  
                  resolve(response.secure_url);
              } catch (error) {
                  console.error('Error parsing response:', error);
                  reject(new Error('Error parsing response'));
              }
          } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
      };

      xhr.onerror = () => {
          reject(new Error('Network error occurred during upload'));
      };

      xhr.send(formData);
  });
};
