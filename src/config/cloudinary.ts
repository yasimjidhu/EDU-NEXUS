const cloudinaryConfig = {
    cloud_name: import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: import.meta.env.REACT_APP_CLOUDINARY_API_SECRET
  };
  console.log('cloudinarydata',cloudinaryConfig)
  export default cloudinaryConfig;
  