import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { UserPlus, LogOut, MoreVertical } from 'lucide-react';
import { Group, Message } from '../../types/chat';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import MessageList from '../../components/chat/MessageList';
import MessageInput, { message } from '../../components/chat/MessageInput';
import { useLocation } from 'react-router-dom';
import { addUsersToGroup, getGroup, getGroupMessages, removeUserFromGroup, sendMessage } from '../../components/redux/slices/chatSlice';
import AddMembersModal from '../../components/chat/AddMembersModal';
import { useMessagedStudents } from '../../contexts/messagedStudentsContext';
import { toast } from 'react-toastify';
import { showAlert } from '../../utils/alert';

// Import custom hooks
import { useTypingStatus } from '../../hooks/useTypingStatus';
import { useFileUpload } from '../../hooks/useUploadFile';
import { useAudioRecording } from '../../hooks/useAudioRecording';


interface GroupChatProps {
  id: string;
  userId: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ id, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupData, setGroupData] = useState<Group | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [groupMessages, setGroupMessages] = useState<Message[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // contexts
  const { socket, onlineUsers } = useSocket();
  const { messagedStudents, loading } = useMessagedStudents()

  // store
  const { user } = useSelector((state: RootState) => state.user);
  const { group } = useSelector((state: RootState) => state.chat);

  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const groupId = location.state ? location.state : id;

  // custom hooks
  const { isTyping, handleTyping } = useTypingStatus(socket, groupId, user?._id || '');
  const { selectedFile, setSelectedFile, uploadProgress, setUploadProgress, handleFileSelect, uploadFile } = useFileUpload();
  const { audioBlob, setAudioBlob, audioProgress, audioDuration, handleRecordedAudio, uploadAudio, setAudioProgress, setAudioDuration } = useAudioRecording();

  const userName = `${user?.firstName} ${user?.lastName}`

  useEffect(() => {
    if (groupId) {
      fetchGroupData(groupId);
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    fetchGroupMessages(groupId)
  }, [groupId, dispatch])

  useEffect(() => {
    if (audioBlob || selectedFile || inputMessage.trim() !== '') {
      handleSendMessage()
    }
  }, [audioBlob, selectedFile, inputMessage.trim()])

  useEffect(() => {
    if (!socket || !groupId) return;

    socket.emit('joinGroup', groupId);

    socket.on('groupMessage', (msg: Message) => {
      console.log('group message in group chat',msg)
      setGroupMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('groupMessage');
      socket.emit('leaveGroup', groupId);
    };
  }, [socket, groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchGroupData = async (groupId: string) => {
    try {
      const response = await dispatch(getGroup(groupId));
      setGroupData(response.payload.group);
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchGroupMessages = async (groupId: string) => {
    try {
      const response = await dispatch(getGroupMessages(groupId));
      setGroupMessages(response.payload.messages);
    } catch (error: any) {
      console.log(error);
    }
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const handleSendMessage = async () => {
    if ((inputMessage.trim() || audioBlob || selectedFile) && socket) {
      let fileData;

      if (selectedFile) {
        fileData = await uploadFile();
        setUploadProgress(0);
      } else if (audioBlob) {
        fileData = await uploadAudio();
        setAudioProgress(0);
      }

      const messageData: Message = {
        conversationId: groupData?._id!,
        senderId: user?._id || '',
        senderProfile: user?.profile.avatar,
        senderName: `${user?.firstName} ${user?.lastName}`,
        text: inputMessage.trim() || undefined,
        fileUrl: fileData?.fileUrl || undefined,
        fileType: fileData?.fileType as 'audio' | 'image' | 'video' | undefined,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
        isGroup: true,
      };

      try {
        const response = await dispatch(sendMessage(messageData));
        const savedMessage = response.payload;
        console.log('saved message form group chat',savedMessage,groupData?._id)
        socket.emit('groupMessage', groupData?._id, savedMessage);

        // Reset input and file states
        setInputMessage('');
        handleFileSelect(null);
        setAudioBlob(null)
        handleRecordedAudio(null);
        setAudioProgress(0);
        setUploadProgress(0);
        setAudioDuration(0);
        setSelectedFile(null)

        handleTyping();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    handleTyping();
  };

  const handleOnSendMessage = (message: message) => {
    if (message.audioBlob) {
      setAudioBlob(message.audioBlob)
    } else if (message.file) {
      setSelectedFile(message.file)
    } else if (message.text) {
      setInputMessage(message.text)
    }
  }

  const handleAddStudents = () => {
    setIsAddModalOpen(true)
  }
  
  const handleOnAddStudents = async (userIds: string[]) => {
    try {
      await dispatch(addUsersToGroup({ groupId: groupData?._id!, userIds }));

      setGroupData((prev) => {
        if (prev) {
          // Add new users to the members list
          const updatedMembers = [...prev.members, ...userIds];
          return { ...prev, members: updatedMembers };
        }
        return prev;
      });

      // Show success toast message
      toast.success('Students added to group successfully');
    } catch (error) {
      console.error('Failed to add students to the group:', error);
      toast.error('Failed to add students to the group');
    } finally {
      setIsAddModalOpen(false);
    }
  }
  const handleLeaveGroup = () => {
    showAlert('Leave Group').then((result: any) => {
      if (result.isConfirmed) {
        if (socket) {
          socket.emit('leaveGroup', groupId, userId, userName);
          dispatch(removeUserFromGroup({ groupId, userId }));
          fetchGroupData(groupId)
        }
      }
    });
  };

  // Logic to get unjoined users
  const unjoinedUsersInGroup = () => {
    if (!groupData || !messagedStudents) return [];

    // Filter messagedStudents to get users not in groupData.members
    const unjoinedUsers = messagedStudents.filter(student =>
      !groupData.members.includes(student._id)
    );

    return unjoinedUsers;
  };



  return (
    <div className="flex h-screen bg-slate-200">
      <div className="flex flex-col flex-grow">
        {/* Group header */}
        <div className="bg-slate-50 p-3 text-black flex items-center justify-between rounded-xs">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
              <img src={groupData?.image} alt="" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{groupData?.name}</h2>
              <p className="text-sm">{group?.members.length} participants</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <UserPlus size={20} className="cursor-pointer" onClick={handleAddStudents} />
            <LogOut size={20} className="cursor-pointer" onClick={handleLeaveGroup} />
            <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </div>

        {/* Message list */}
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          <MessageList currentUserId={userId} messages={groupMessages} key={user?._id} />
          <div ref={messagesEndRef} />
        </div>

        {/* Modal for adding students to group */}
        {isAddModalOpen &&
          <AddMembersModal
            isOpen={isAddModalOpen}
            users={unjoinedUsersInGroup()}
            onAddUsers={handleOnAddStudents}
            onClose={() => setIsAddModalOpen(false)} />
        }

        {/* Loading Indicator */}
        {(uploadProgress > 0 || audioProgress > 0) && (
          <div className="flex items-center justify-center bg-gray-200 p-2">
            <div className="text-gray-700">Uploading... {uploadProgress || audioProgress}%</div>
          </div>
        )}

        {/* Message input */}
        <MessageInput
          onSendMessage={handleOnSendMessage}
        />

        {/* Alert message */}
        {alertMessage && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded-full shadow-lg">
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;