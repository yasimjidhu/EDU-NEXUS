// MessageList.tsx
import React, { useRef, useEffect } from 'react';
import { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-2">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[70%] rounded-lg p-2 ${msg.senderId === currentUserId ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
            {msg.senderId !== currentUserId && <p className="text-xs font-semibold text-[#075e54]">{msg.senderId}</p>}
            <p>{msg.text}</p>
            <p className="text-xs text-gray-500 text-right">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
