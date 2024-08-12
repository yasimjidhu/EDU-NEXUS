import React from 'react';
import { User } from '../redux/slices/studentSlice';

interface ChatSidebarProps {
  messagedStudents: User[];
  onlineUsers: { [email: string]: string };
  onSelectStudent:(student:User)=> void;
  selectedStudent:User | null;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messagedStudents,
  onlineUsers,
  onSelectStudent,
  selectedStudent
}) => {

  return (
    <div className="overflow-y-auto h-full">
      {messagedStudents.length > 0 ? (
        messagedStudents.map((student) => (
          <div
            key={student._id}
            className={`flex items-center p-3 border-b border-gray-200 cursor-pointer transition-colors duration-200 ease-in-out
              ${selectedStudent?._id === student._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            onClick={() => onSelectStudent(student)}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
              <img
                src={student.profile?.avatar || '/default-avatar.png'}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 flex-grow">
              <p className="font-semibold text-gray-800">{`${student.firstName} ${student.lastName}`}</p>
              <p className="text-sm text-gray-500">
                {onlineUsers[student.email] === 'online' ? (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </span>
                ) : (
                  'Offline'
                )}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No students have messaged you yet.</div>
      )}
    </div>
  );
};
