import React, { useEffect, useState } from 'react';
import { User } from '../redux/slices/studentSlice';
import { Group } from '../../types/chat'; // Assuming you have a Group type defined
import { AppDispatch, RootState } from '../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getUserJoinedGroups } from '../redux/slices/chatSlice';

interface ChatSidebarProps {
  messagedStudents: User[];
  joinedGroups: Group[];
  onlineUsers: { [email: string]: string };
  onSelectStudent: (student: User) => void;
  onSelectGroup: (group: Group) => void;
  onClickEntity:(item:'students' | 'group' | 'instructor')=>void;
  selectedStudent: User | null;
  selectedGroup: Group | null; 
  user:'student'|'instructor';
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messagedStudents,
  joinedGroups,
  onlineUsers,
  onSelectStudent,
  onSelectGroup,
  onClickEntity,
  selectedStudent,
  selectedGroup,
  user
}) => {
  const [showGroups, setShowGroups] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  const { messages,groups } = useSelector((state: RootState) => state.chat);
  const userData = useSelector((state:RootState)=>state.user)

  useEffect(() => {
    if (userData.user?._id) {
      dispatch(getUserJoinedGroups(userData.user._id))
    }
  }, [dispatch, userData.user?._id])

  const handleClickEntity = (item: 'students' | 'group') => {
      if (item === 'students') {
        setShowGroups(false);
        onClickEntity(item)
      } else if (item === 'group') {
        setShowGroups(true);
        onClickEntity(item)
      }
  };
  

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 px-4 font-semibold ${!showGroups ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          onClick={()=>handleClickEntity('students')}
        >
          {user == 'student' ? 'Instructors' : 'Students'}
          
        </button>
        <button
          className={`flex-1 py-2 px-4 font-semibold ${showGroups ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          onClick={()=>handleClickEntity('group')}
        >
          Groups
        </button>
      </div>
      <div className="overflow-y-auto flex-grow">
        {showGroups ? (
          groups && groups.length > 0 ? (
            groups.map((group) => (
              <div
                key={group._id}
                className={`flex items-center p-3 border-b border-gray-200 cursor-pointer transition-colors duration-200 ease-in-out
                  ${selectedGroup?._id === group._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => onSelectGroup(group)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                  <img
                    src={group.image || '/default-group-avatar.png'}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="font-semibold text-gray-800">{group.name}</p>
                  <p className="text-sm text-gray-500">{group.members.length} members</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">You haven't joined any groups yet.</div>
          )
        ) : (
          messagedStudents.length > 0 ? (
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
          )
        )}
      </div>
    </div>
  );
};