import React, { useState, useEffect } from 'react';
import { User as UserType } from '../redux/slices/studentSlice';
import { useAxios } from '../../hooks/useAxios';
import { User, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';

interface CreateGroupModalProps {
  show: boolean;
  handleClose: () => void;
  students: UserType[];
  onCreateGroup: (data: any) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ show, handleClose, students, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const {user}  = useSelector((state:RootState)=>state.user)
  const { response, error, loading: uploadLoading, sendRequest } = useAxios({
    method: 'POST',
    url: import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  });

  useEffect(() => {
    if (user?._id) {
      setSelectedStudents([user._id]);
    }
  }, [user]);

  useEffect(() => {
    if (response && response.secure_url) {
      setUploadedImageUrl(response.secure_url);
    }
  }, [response]);

  useEffect(() => {
    if (uploadedImageUrl) {
      onCreateGroup({
        name: groupName,
        description: groupDescription,
        image: uploadedImageUrl,
        members: selectedStudents,
      });
      setLoading(false);
      handleClose();
    }
  }, [uploadedImageUrl, groupName, groupDescription, selectedStudents, onCreateGroup, handleClose]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setGroupImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (groupImage) {
      const formData = new FormData();
      formData.append('file', groupImage);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      try {
        await sendRequest({ data: formData });
      } catch (err) {
        console.error('Image upload failed:', error);
        setLoading(false);
      }
    } else {
      // If no image to upload, create group immediately
      onCreateGroup({
        name: groupName,
        description: groupDescription,
        image: null,
        members: selectedStudents,
      });
      setLoading(false);
      handleClose();
    }
  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!show) {
      setGroupName('');
      setGroupDescription('');
      setSelectedStudents([]);
      setGroupImage(null);
      setImageUrl(null);
      setUploadedImageUrl(null);
    }
  }, [show]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 inter text-gray-900" id="modal-title">
                  Create New Group
                </h3>
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="groupName" className="block text-sm text-gray-700 inter">
                      Group Name
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="groupImage" className="block text-sm inter text-gray-700">
                      Group Image
                    </label>
                    <div className="mt-1 flex items-center">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Group" className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <label htmlFor="file-upload" className="ml-5 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className='inter'>Change</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="groupDescription" className="block text-sm inter text-gray-700">
                      Group Description
                    </label>
                    <textarea
                      id="groupDescription"
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm inter text-gray-700">
                      Select Students
                    </label>
                    <div className="mt-1 max-h-48 overflow-y-auto border border-gray-300 rounded-md">
                      {students.map(student => (
                        <div
                          key={student._id}
                          onClick={() => handleStudentSelection(student._id)}
                          className={`flex items-center p-2 cursor-pointer hover:bg-gray-50 ${selectedStudents.includes(student._id) ? 'bg-indigo-50' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => {}}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label className="ml-3 block text-sm font-medium text-gray-700">
                            {student.firstName} {student.lastName}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                      disabled={loading || uploadLoading}
                    >
                      {loading || uploadLoading ? 'Creating...' : 'Create Group'}
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
