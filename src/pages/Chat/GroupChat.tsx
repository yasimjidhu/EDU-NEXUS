import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { Send, UserPlus, LogOut, MoreVertical, Paperclip, Mic } from 'lucide-react';
import { Message } from '../../types/chat';
import { useSelector } from 'react-redux';
import { RootState } from '@/components/redux/store/store';

const GroupChat = () => {
  const [groupName, setGroupName] = useState('Group Name');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, onlineUsers } = useSocket();
  const {user} = useSelector((state:RootState)=>state.user)

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinGroup = () => {
    if (!socket) return;
    socket.emit('joinGroup', groupName);
    showAlertMessage(`Joined group: ${groupName}`);
  };

  const leaveGroup = () => {
    if (!socket) return;
    socket.emit('leaveGroup', groupName);
    showAlertMessage(`Left group: ${groupName}`);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !message.trim()) return;
    socket.emit('groupMessage', groupName, message);
    setMessage('');
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5]">
      <div className="bg-[#075e54] p-3 text-white flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
          <div>
            <h2 className="text-lg font-semibold">{groupName}</h2>
            <p className="text-sm">{onlineUsers.length} participants</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <UserPlus size={20} onClick={joinGroup} className="cursor-pointer" />
          <LogOut size={20} onClick={leaveGroup} className="cursor-pointer" />
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-2 ${msg.senderId === user?._id ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
              {msg.senderId !== user?._id && <p className="text-xs font-semibold text-[#075e54]">{msg.senderId}</p>}
              <p>{msg.text}</p>
              <p className="text-xs text-gray-500 text-right">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#f0f0f0] p-2">
        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <button type="button" className="text-gray-600">
            <Paperclip size={24} />
          </button>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 rounded-full bg-white"
          />
          {message.trim() ? (
            <button type="submit" className="text-[#075e54]">
              <Send size={24} />
            </button>
          ) : (
            <button type="button" className="text-[#075e54]">
              <Mic size={24} />
            </button>
          )}
        </form>
      </div>

      {alertMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded-full shadow-lg">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default GroupChat;