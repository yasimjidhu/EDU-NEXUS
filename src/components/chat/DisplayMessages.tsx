import React, { useEffect, useRef, useState } from 'react'
import AudioPlayer from './AudioPlayer';
import Lightbox from './LightBox';
import { Message } from '../../types/chat';
import { isOnlyEmojis } from '../../utils/CheckIsEmojis';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { useSocket } from '../../contexts/SocketContext';
import { useMessageObserver } from '../../hooks/useMessageObserver';

interface DisplayMessagesProps {
    messages: Message[];
}
export const DisplayMessages: React.FC<DisplayMessagesProps> = ({ messages }) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false)
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    console.log('display message reached')
    const { user } = useSelector((state: RootState) => state.user)
    const { socket } = useSocket()

    useEffect(()=>{
        scrollToBottom()
    },[messages])

    const handleMessageRead = (messageId: string) => {
        if (socket) {
            socket.emit('messageRead', messageId);
        }
    };

    const handleImageClick = (url: string) => {
        setCurrentImageUrl(url)
        setIsLightboxOpen(true);
    };
    
    const handleCloseLightbox = () => {
        setIsLightboxOpen(false);
        setCurrentImageUrl('')
    };
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    

    const messageObserver = useMessageObserver(handleMessageRead);

    return (
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
                            className={`max-w-xs p-3 m-2 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer ${message.senderId === user?._id
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : 'bg-white text-gray-800'
                                }`}
                        >
                            {message.fileUrl ? (
                                message.fileType === 'audio' ? (
                                    <AudioPlayer src={message.fileUrl} />
                                ) : message.fileType === 'image' ? (
                                    <>
                                        <img
                                            src={message.fileUrl}
                                            alt="Uploaded image"
                                            className="w-full rounded"
                                            onClick={() => handleImageClick(message.fileUrl!)} />
                                        {isLightboxOpen && (
                                            <Lightbox imageUrl={currentImageUrl} onClose={handleCloseLightbox} />
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
    )
}
