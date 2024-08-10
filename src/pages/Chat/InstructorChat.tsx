import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Paperclip, Smile, StopCircle, Mic, X, Play } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { User } from '../../components/redux/slices/studentSlice';
import { useSocket } from '../../contexts/SocketContext';
import { addMessage, getMessagedStudents, getMessages, sendMessage, updateMessageStatus } from '../../components/redux/slices/chatSlice';
import { useMessageObserver } from '../../hooks/useMessageObserver';
import { ReactMic } from 'react-mic';
import Picker from 'emoji-picker-react'  
import { uploadToCloudinary } from '../../utils/cloudinary';
import { Message } from '../../types/chat';
import Lightbox from '../../components/chat/LightBox';

interface ChatUIProps {
  currentUser?: { id: string; name: string; avatar: string };
  onStartCall?: (studentId: string, type: 'audio' | 'video') => void;
}

const InstructorChat: React.FC<ChatUIProps> = ({ currentUser, onStartCall }) => {
  const [messagedStudents, setMessagedStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLightboxOpen,setIsLightboxOpen] = useState<boolean>(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef(new Audio());

  const { user } = useSelector((state: RootState) => state.user);
  const { messages, loading, error } = useSelector((state: RootState) => state.chat);

  const dispatch: AppDispatch = useDispatch();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getMessagedStudents(user._id)).then((action: any) => {
        if (action.type === getMessagedStudents.fulfilled.type) {
          setMessagedStudents(action.payload);
        }
      });
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (socket) {
      const messageHandler = (newMessage: Message) => {
        dispatch(addMessage(newMessage));
        if (newMessage.senderId !== user?._id) {
          socket.emit('messageDelivered', newMessage._id);
        }
      };

      const messageUpdateHandler = (updatedMessage: Message) => {
        dispatch(updateMessageStatus(updatedMessage));
      };

      const typingHandler = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
        if (userId !== user?._id) {
          setIsTyping(isTyping);
        }
      };

      socket.on('message', messageHandler);
      socket.on('messageStatusUpdated', messageUpdateHandler);
      socket.on('typing', typingHandler);

      return () => {
        socket.off('message', messageHandler);
        socket.off('messageStatusUpdated', messageUpdateHandler);
        socket.off('typing', typingHandler);
      };
    }
  }, [socket, dispatch, user?._id]);

  useEffect(() => {
    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedStudent && socket) {
      const conversationid = [user?._id, selectedStudent._id].sort().join('-');
      setConversationId(conversationid);

      socket.emit('join', conversationid);
      dispatch(getMessages(conversationid));

      return () => {
        socket.emit('leave', conversationid);
      };
    }
  }, [selectedStudent, socket, user?._id, dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if ((inputMessage.trim() || audioBlob || selectedFile) && selectedStudent && socket) {
      let fileUrl = '';
      let fileType = '';

      if (selectedFile) {
        try {
          fileUrl = await uploadToCloudinary(selectedFile, setUploadProgress);
          fileType = selectedFile.type.split('/')[0]; // 'image', 'audio', or 'video'
        } catch (error) {
          console.error('Error uploading file:', error);
          return; // Exit if upload fails
        }
      } else if (audioBlob) {
        try {
          fileUrl = await uploadToCloudinary(new File([audioBlob], 'audio.webm', { type: 'audio/webm' }), setUploadProgress);
          fileType = 'audio';
        } catch (error) {
          console.error('Error uploading audio:', error);
          return; // Exit if upload fails
        }
      }

      const messageData = {
        conversationId,
        senderId: user?._id || '',
        text: inputMessage.trim(),
        fileUrl,
        fileType,
        status: 'sent'
      };

      try {
        const response = await dispatch(sendMessage(messageData));
        const savedMessage = response.payload;

        socket.emit('message', savedMessage);
        setInputMessage('');
        setSelectedFile(null);
        setAudioBlob(null);
        setUploadProgress(0);
        setAudioProgress(0);
        setAudioDuration(0);

        // Clear typing status
        if (typingTimer.current) {
          clearTimeout(typingTimer.current);
        }
        setIsTyping(false);
        socket.emit('typing', { conversationId, userId: user?._id, isTyping: false });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (socket && selectedStudent) {
      setInputMessage(e.target.value);

      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }

      typingTimer.current = setTimeout(() => {
        socket.emit('typing', { conversationId, userId: user?._id, isTyping: false });
      }, 1000);

      if (!isTyping) {
        socket.emit('typing', { conversationId, userId: user?._id, isTyping: true });
      }
    }
  };

  const handleMessageRead = (messageId: string) => {
    if (socket) {
      socket.emit('messageRead', messageId);
    }
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const isOnlyEmojis = (str: string) => {
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?)+$/u;
    return emojiRegex.test(str);
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedBlob: Blob) => {
    // You can use this to visualize the recording if needed
  };

  const onStop = (recordedBlob: { blob: Blob; blobURL: string }) => {
    setAudioBlob(recordedBlob.blob);
  };

  const playRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.play();

      audioRef.current.onloadedmetadata = () => {
        setAudioDuration(audioRef.current.duration);
      };

      audioRef.current.ontimeupdate = () => {
        setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      };

      audioRef.current.onended = () => {
        setAudioProgress(0);
      };
    }
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setAudioBlob(null);
    setAudioProgress(0);
    setAudioDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleImageClick = (url:string) => {
    setCurrentImageUrl(url)
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentImageUrl('')
  };

  const messageObserver = useMessageObserver(handleMessageRead);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {messagedStudents.length > 0 ? (
            messagedStudents.map((student) => (
              <div
                key={student._id}
                className={`flex items-center p-3 border-b border-gray-200 cursor-pointer transition-colors duration-200 ease-in-out
                  ${selectedStudent?._id === student._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedStudent(student)}
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
      </div>
      <div className="flex-1 flex flex-col">
        {selectedStudent ? (
          <>
            <div className="flex items-center p-4 bg-white border-b border-gray-200">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                <img
                  src={selectedStudent.profile?.avatar || '/default-avatar.png'}
                  alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <p className="font-semibold text-gray-800">{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</p>
                <p className="text-sm text-gray-500">
                  {isTyping ? (
                    <p className="text-sm text-black">Typing...</p>
                  ) : (
                    onlineUsers[selectedStudent.email] === 'online' ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Online
                      </span>
                    ) : (
                      'Offline'
                    )
                  )}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => onStartCall?.(selectedStudent._id, 'audio')}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <Phone size={20} />
                </button>
                <button
                  onClick={() => onStartCall?.(selectedStudent._id, 'video')}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <Video size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-gray-100 to-gray-200">
              {messages.map((message) => {
                const onlyEmojis = isOnlyEmojis(message.text || '');
                return (
                  <div
                    key={message._id}
                    className={`flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      data-message-id={message._id}
                      ref={(el) => el && messageObserver.current?.observe(el)}
                      className={`max-w-xs p-3 m-2 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer ${
                        message.senderId === user?._id
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      {message.fileUrl ? (
                        message.fileType === 'audio' ? (
                          <audio controls src={message.fileUrl} className="w-full" />
                        ) : message.fileType === 'image' ? (
                          <>
                          <img
                          src={message.fileUrl}
                          alt="Uploaded image" 
                          className="w-full rounded" 
                          onClick={() => handleImageClick(message.fileUrl)}/>
                          {isLightboxOpen && (
                            <Lightbox imageUrl={currentImageUrl} onClose={handleCloseLightbox}/>
                          )}
                          </>
                        ) : message.fileType === 'video' ? (
                          <video controls src={message.fileUrl} className="w-full rounded" />
                        ) : null
                      ) : (
                        <p className={`inter ${onlyEmojis ? 'text-4xl' : 'text-sm md:text-base'}`}>
                          {message.text}
                        </p>
                      )}
                      <div className="text-xs mt-2 flex items-center justify-between">
                        <span className={`${message.senderId === user?._id ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.senderId === user?._id && (
                          <span className="ml-2 flex items-center">
                            {message.status === 'sent' && <span className="text-xs text-blue-100">✓</span>}
                            {message.status === 'delivered' && <span className="text-xs text-blue-100">✓✓</span>}
                            {message.status === 'read' && (
                              <span className="text-xl text-medium-rose">✓✓</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef}></div>
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <Smile size={24} />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-4">
                    <Picker onEmojiClick={handleEmojiClick} />
                  </div>
                )}

                <div className="flex-grow flex items-center bg-white rounded-full border border-gray-300">
                  {isRecording ? (
                    <div className="flex-grow flex items-center justify-between p-2">
                      <ReactMic
                        record={isRecording}
                        className="d-none"
                        onStop={onStop}
                        onData={onData}
                        mimeType="audio/webm"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-sm text-gray-500">Recording...</span>
                      </div>
                      <button onClick={stopRecording} className="text-red-500 hover:text-red-700">
                        <StopCircle size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {audioBlob || selectedFile ? (
                        <div className="flex-grow flex items-center justify-between p-2">
                          <button onClick={audioBlob ? playRecording : () => {}} className="text-blue-500 hover:text-blue-700">
                            <Play size={20} />
                          </button>
                          <button onClick={() => { setAudioBlob(null); setSelectedFile(null); }} className="text-red-500 hover:text-red-700">
                            <X size={20} />
                          </button>
                          {uploadProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          className="flex-grow px-4 py-2 focus:outline-none"
                          placeholder="Type a message"
                          value={inputMessage}
                          onChange={handleInput}
                          onKeyDown={handleKeyPress}
                        />
                      )}
                    </>
                  )}
                  
                  <button
                    onClick={isRecording ? stopRecording : (audioBlob || selectedFile ? handleSendMessage : startRecording)}
                    className={`p-2 rounded-full focus:outline-none transition duration-300 ${
                      isRecording || audioBlob || selectedFile ? 'bg-green-500 hover:bg-green-600' : 'text-blue-500 hover:text-blue-700'
                    }`}
                  >
                    {isRecording || audioBlob || selectedFile ? (
                      <Send size={20} className="text-white" />
                    ) : (
                      <Mic size={20} />
                    )}
                  </button>
                </div>

                {!isRecording && !audioBlob && !selectedFile && inputMessage.trim() === '' && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,video/*,audio/*"
                    />
                    <Paperclip size={24} className="text-gray-500 hover:text-gray-700" />
                  </label>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">Select a student to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorChat;