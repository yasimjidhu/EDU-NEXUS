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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add Users to Group</h2>
        <div className="overflow-y-auto max-h-60">
          {users.map((user) => (
            <div key={user._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`user-${user._id}`}
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserChange(user._id)}
                className="mr-2"
              />
              <label htmlFor={`user-${user._id}`} className="text-gray-700">
                {`${user.firstName}${user.lastName}`}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUsers}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Add Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
