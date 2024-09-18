import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types/user';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { Camera, Edit2 } from 'lucide-react';
import { useFileUpload } from '../../hooks/useUploadFile';
import { updateUserDetails } from '../../components/redux/slices/studentSlice';
import { resetPassword } from '../../components/redux/slices/authSlice';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { toast } from 'react-toastify';

const Settings: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploadProgress,handleFileSelect,selectedFile } = useFileUpload();
  useDocumentTitle('Settings')
  
  useEffect(() => {
    if (user) {
      setFormData(user);
      setProfileImage(user.profile.avatar || null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, contact: { ...prev.contact, [name]: value } } : null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    const userUpdateData: Partial<User> = {};
  
    // Prepare user data for update
    if (formData?.firstName !== user?.firstName) userUpdateData.firstName = formData?.firstName;
    if (formData?.lastName !== user?.lastName) userUpdateData.lastName = formData?.lastName;
    if (formData?.email !== user?.email) userUpdateData.email = formData?.email;
    
    if (formData?.contact?.phone !== user?.contact?.phone) {
      userUpdateData.contact = {
        ...user?.contact, // Ensure existing contact data is preserved
        phone: formData?.contact?.phone,
      };
    }
  
    // Handle profile image update
    if (profileImage !== user?.profile?.avatar) {
      try {
        const uploadResult = await uploadFile();
        if (uploadResult) {
          const { fileUrl } = uploadResult;
  
          // Ensure dateOfBirth and gender are defined
          const dateOfBirth = user?.profile?.dateOfBirth ?? "";
          const gender = user?.profile?.gender ?? "";
  
          userUpdateData.profile = {
            ...user?.profile, // Preserve existing profile data
            avatar: fileUrl,
            dateOfBirth,
            gender,
          };
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload profile image.");
      }
    }
  
    // Dispatch the update if there are changes
    if (Object.keys(userUpdateData).length > 0 && user) {
      try {
        await dispatch(updateUserDetails({ email: user.email, updateData: userUpdateData }));
        setSaveSuccess(true);
        toast.success("Profile updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      toast.info("No changes to save.");
    }
  };
  
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newPassword || confirmPassword!){
      setPasswordError('please completes the fields')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (!user) return; // Guard clause for undefined user
    const response = await dispatch(resetPassword({ email: user.email, newPassword }));
    toast.success(response.payload.message)
    setPasswordError('');
    setNewPassword('');
    setConfirmPassword('');
  };


  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('handle file image change',file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfileImage(reader.result as string);
        handleFileSelect(file)
        try {
          console.log('upload file called',selectedFile)
          const uploadResult = await uploadFile();
          if (uploadResult) {
            const { fileUrl } = uploadResult;
            console.log('fileurl is ', fileUrl)
            setProfileImage(fileUrl);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto  max-w-6xl">
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your settings have been saved successfully.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData?.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}

                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData?.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData?.contact?.phone || ''}
                    onChange={handleContactChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  name="address"
                  value={formData?.contact?.address || ''}
                  onChange={handleContactChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              {isEditing && (
                <button
                  className="bg-medium-rose hover:bg-strong-rose text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
            <div className="flex flex-col items-center">
              <div
                className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer relative"
                onClick={handleImageClick}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-4xl">?</span>
                )}

                {uploadProgress > 0 && (
                  <div className="w-full mt-4">
                    <progress value={uploadProgress} max="100" className="w-full">
                      {uploadProgress}%
                    </progress>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <p className="mt-2 text-sm text-gray-600">Click to update profile image</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs italic mb-4">{passwordError}</p>
              )}
              <button
                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
