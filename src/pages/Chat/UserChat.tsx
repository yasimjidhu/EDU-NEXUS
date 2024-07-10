import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'instructor';
  timestamp: Date;
}

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface ChatUIProps {
  currentUser?: { id: string; name: string; avatar: string };
  instructors?: Instructor[];
  onSendMessage?: (instructorId: string, message: string) => void;
  onStartCall?: (instructorId: string, type: 'audio' | 'video') => void;
}

const ChatUI: React.FC<ChatUIProps> = ({ currentUser, instructors, onSendMessage, onStartCall }) => {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedInstructor) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      onSendMessage(selectedInstructor.id, inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Instructor List */}
      <div className="w-1/4 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <div className="overflow-y-auto h-full">
  {instructors && instructors.length > 0 ? (
    instructors.map((instructor) => (
      <div
        key={instructor.id}
        className={`flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
          selectedInstructor?.id === instructor.id ? 'bg-blue-50' : ''
        }`}
        onClick={() => setSelectedInstructor(instructor)}
      >
        <img
          src={instructor.avatar}
          alt={instructor.name}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{instructor.name}</p>
          <p className="text-sm text-gray-500">{instructor.status}</p>
        </div>
      </div>
    ))
  ) : (
    <h1>no data found</h1>
  )}
</div>

      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedInstructor ? (
          <>
            <div className="flex justify-between items-center border-b border-gray-200 p-4 bg-white">
              <div className="flex items-center">
                <img
                  src={selectedInstructor.avatar}
                  alt={selectedInstructor.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-lg font-semibold">{selectedInstructor.name}</h2>
                  <p className="text-sm text-gray-500">{selectedInstructor.status}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onStartCall(selectedInstructor.id, 'audio')}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Phone size={20} />
                </button>
                <button
                  onClick={() => onStartCall(selectedInstructor.id, 'video')}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Video size={20} />
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block max-w-xs md:max-w-md p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    {message.text}
                    <div className="text-xs opacity-75 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center">
                <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                  <Smile size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-gray-50">
            <p className="text-xl text-gray-500">Select an instructor to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;