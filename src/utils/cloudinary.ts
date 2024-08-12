

export const uploadToCloudinary = async (file: File, setUploadProgress: (progress: number) => void): Promise<string> => {
  console.log('cloudinary chat preset',import.meta.env.VITE_CLOUDINARY_CHAT_FILES_PRESET)
  console.log('cloudinary cloud name',import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
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
              try {
                  const response = JSON.parse(xhr.responseText);
                  resolve(response.secure_url);
              } catch (error) {
                  console.error('Error parsing response:', error);
                  reject(new Error('Error parsing response'));
              }
          } else {
              console.error('Upload failed with status:', xhr.status);
              console.error('Response text:', xhr.responseText);
              reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
      };

      xhr.onerror = () => {
          console.error('Network error occurred during upload');
          reject(new Error('Network error occurred during upload'));
      };

      xhr.send(formData);
  });
};
