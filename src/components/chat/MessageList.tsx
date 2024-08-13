import React, { useRef, useEffect } from 'react';
import { Message } from '../../types/chat';
import { isOnlyEmojis } from '../../utils/CheckIsEmojis';
import { useMessageObserver } from '../../hooks/useMessageObserver';
import { useSocket } from '../../contexts/SocketContext';

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageRead = (messageId: string) => {
    if (socket) {
      socket.emit('messageRead', messageId);
    }
  };

  const messageObserver = useMessageObserver(handleMessageRead)

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-2">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => {
          const onlyEmojis = isOnlyEmojis(msg.text!)

          return (
            <div key={index} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div
                data-message-id={msg._id}
                ref={(el) => el && messageObserver.current?.observe(el)}
                className={`max-w-xs p-2 m-2 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer ${msg.senderId === currentUserId
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-white text-gray-800'
                  }`}>
                    
                <p className={`inter ${onlyEmojis ? 'text-4xl' : 'text:sm md:text-base'}`}>{msg.text}</p>
                {msg.senderId !== currentUserId && <p className="text-xs font-semibold text-[#075e54]">{msg.senderId}</p>}
                <div className='flex justify-end space-x-2'>
                  <p className="text-xs text-gray-500  mt-2">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {msg.senderId === currentUserId && (
                    <span className="ml-2">
                      {msg.status === 'sent' && <span className="text-xs">✓</span>}
                      {msg.status === 'delivered' && <span className="text-xs">✓✓</span>}
                      {msg.status === 'read' && (
                        <span className="text-blue-500 text-xs">✓✓</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>)
        })
      ) : (
        <>
          <div className='flex justify-center items-center'>
            <p className='text-md text-black'>Send a message to start the conversation 🙌</p>
          </div>
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
