import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUnreadMessages, getUserJoinedGroups } from '../redux/slices/chatSlice';
import { User } from '../redux/slices/studentSlice';
import { Group, Message } from '../../types/chat';
import { AppDispatch, RootState } from '../redux/store/store';

interface ChatSidebarProps {
  messagedStudents: User[];
  onlineUsers: { [email: string]: string };
  onSelectStudent: (student: User) => void;
  onSelectGroup: (group: Group) => void;
  onClickEntity: (item: 'students' | 'group' | 'instructor') => void;
  selectedStudent: User | null;
  selectedGroup: Group | null;
  user: 'student' | 'instructor';
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messagedStudents,
  onlineUsers,
  onSelectStudent,
  onSelectGroup,
  onClickEntity,
  selectedStudent,
  selectedGroup,
  user,
}) => {
  const [showGroups, setShowGroups] = useState(false);
  const [userJoinedGroups,setUserJoinedGroups] = useState<Group[]>([])

  const dispatch: AppDispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);
  const { messages, groups, unreadCounts } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (userData.user?._id) {
      dispatch(getUserJoinedGroups(userData.user._id));
      dispatch(getUnreadMessages(userData.user._id));
    }
  }, [dispatch, userData.user?._id]);

  const handleClickEntity = (item: 'students' | 'group') => {
    setShowGroups(item === 'group');
    onClickEntity(item);
  };

  const getUnreadCount = useCallback(
    (studentId?: string, groupId?: string) => {
      if (studentId) {
        const conversationId = [userData.user?._id, studentId].sort().join('-');
        return unreadCounts[conversationId] || 0;
      } else if (groupId) {
        return unreadCounts[groupId] || 0;
      }
      return 0;
    },
    [unreadCounts, userData.user?._id]
  );

  const getLatestMessageTimestamp = useCallback(
    (conversationId: string) => {
      const latestMessage = messages
        .filter((msg) => msg.conversationId === conversationId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      return latestMessage ? new Date(latestMessage.createdAt).getTime() : 0;
    },
    [messages]
  );

  const sortedMessagedStudents = useMemo(() => {
    return [...messagedStudents].sort((a, b) => {
      const conversationIdA = [userData.user?._id, a._id].sort().join('-');
      const conversationIdB = [userData.user?._id, b._id].sort().join('-');
      const timestampA = getLatestMessageTimestamp(conversationIdA);
      const timestampB = getLatestMessageTimestamp(conversationIdB);
      return timestampB - timestampA;
    });
  }, [messagedStudents, getLatestMessageTimestamp, userData.user?._id]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 px-4 font-semibold ${!showGroups ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          onClick={() => handleClickEntity('students')}
        >
          {user === 'student' ? 'Instructors' : 'Students'}
        </button>
        <button
          className={`flex-1 py-2 px-4 font-semibold ${showGroups ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          onClick={() => handleClickEntity('group')}
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
                  {/* {renderLatestMessage(group._id!)} */}
                </div>
                {getUnreadCount(undefined, group._id!) > 0 && (
                  <span className="relative inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-green-500 rounded-full shadow-md hover:scale-105 transition-transform duration-200">
                    {getUnreadCount(undefined, group._id!)}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">You haven't joined any groups yet.</div>
          )
        ) : (
          sortedMessagedStudents.length > 0 ? (
            sortedMessagedStudents.map((student) => (
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
                  {/* {renderLatestMessage([userData.user?._id, student._id].sort().join('-'))} */}
                </div>
                {getUnreadCount(student._id) > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-4 h-4 text-sm p-2 font-medium text-white bg-green-500 rounded-full">
                    {getUnreadCount(student._id)}
                  </span>
                )}
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
