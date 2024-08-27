import React, { useState } from 'react';
import { User } from '../../types/user';

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onAddUsers: (selectedUserIds: string[]) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ isOpen, onClose, users, onAddUsers }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserChange = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleAddUsers = () => {
    onAddUsers(selectedUsers);
    onClose();
  };

  if (!isOpen) return null;

  if(users.length == 0){
    return 
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add Users to Group</h2>
        <div className="overflow-y-auto max-h-60">
          {users.map((user) => (
            <div key={user._id} className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img
                  src={user.profile?.avatar || '/default-avatar.png'}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 font-semibold">{`${user.firstName} ${user.lastName}`}</h3>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <input
                type="checkbox"
                id={`user-${user._id}`}
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserChange(user._id)}
                className="form-checkbox text-blue-500"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUsers}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Add Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;