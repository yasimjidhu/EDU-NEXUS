// MessageInput.tsx
import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-[#f0f0f0] p-2">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
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
          <button type="submit" className="text-[#075e5 4]">
            <Send size={24} />
          </button>
        ) : (
          <button type="button" className="text-[#075e54]">
            <Mic size={24} />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput