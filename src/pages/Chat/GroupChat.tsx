import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { UserPlus, LogOut, MoreVertical } from 'lucide-react';
import { Group, Message } from '../../types/chat';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import MessageList from '../../components/chat/MessageList';
import MessageInput, { message } from '../../components/chat/MessageInput';
import { useLocation } from 'react-router-dom';
import { getGroup, getGroupMessages, sendMessage } from '../../components/redux/slices/chatSlice';

// Import custom hooks
import { useTypingStatus } from '../../hooks/useTypingStatus';
import { useFileUpload } from '../../hooks/useUploadFile';
import { useAudioRecording } from '../../hooks/useAudioRecording';

interface GroupChatProps {
  id: string;
  userId:string;
}

const GroupChat: React.FC<GroupChatProps> = ({ id,userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupData, setGroupData] = useState<Group | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [groupMessages, setGroupMessages] = useState<Message[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, onlineUsers } = useSocket();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const groupId = location.state ? location.state : id;

  // Use custom hooks
  const { isTyping, handleTyping } = useTypingStatus(socket, groupId, user?._id || '');
  const { selectedFile, setSelectedFile, uploadProgress,setUploadProgress, handleFileSelect, uploadFile } = useFileUpload();
  const { audioBlob, setAudioBlob, audioProgress, audioDuration, handleRecordedAudio, uploadAudio, setAudioProgress, setAudioDuration } = useAudioRecording();

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
  
    console.log('joining group', groupId);
    socket.emit('joinGroup', groupId);
  
    socket.on('groupMessage', (msg: Message) => {
      console.log('group message received from socket', msg);
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
        senderProfile:user?.profile.avatar,
        senderName:`${user?.firstName} ${user?.lastName}`,
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
    console.log('emoji selected got inc callback', message)
    if (message.audioBlob) {
      setAudioBlob(message.audioBlob)
    } else if (message.file) {
      setSelectedFile(message.file)
    } else if (message.text) {
      setInputMessage(message.text)
    }
  }

  return (
    <div className="flex h-screen bg-[#e5ddd5]">
      <div className="flex flex-col flex-grow">
        {/* Group header */}
        <div className="bg-[#075e54] p-3 text-white flex items-center justify-between rounded-xs">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
              <img src={groupData?.image} alt="" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{groupData?.name}</h2>
              <p className="text-sm">{groupData?.members.length} participants</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <UserPlus size={20}  className="cursor-pointer" />
            <LogOut size={20}className="cursor-pointer" />
            <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </div>

        {/* Message list */}
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          <MessageList currentUserId={userId} messages={groupMessages} key={user?._id} />
          <div ref={messagesEndRef} />
        </div>

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