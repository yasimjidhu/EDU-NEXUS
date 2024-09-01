import React, { useEffect, useRef, useState } from 'react'
import AudioPlayer from './AudioPlayer';
import Lightbox from './LightBox';
import { Message } from '../../types/chat';
import { isOnlyEmojis } from '../../utils/CheckIsEmojis';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { useSocket } from '../../contexts/SocketContext';
import { updateMessageStatus } from '../redux/slices/chatSlice';

interface DisplayMessagesProps {
    messages: Message[];
}
export const DisplayMessages: React.FC<DisplayMessagesProps> = ({ messages }) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false)
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
    const [readMessages, setReadMessages] = useState<Set<string>>(new Set());

    const messageObserver = useRef<IntersectionObserver | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const dispatch: AppDispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.user)
    const { socket } = useSocket()

    const handleMessageRead = (messageId: string, userId: string) => {
        if (!readMessages.has(messageId)) {
            setReadMessages((prevReadMessages) => {
                const updatedReadMessages = new Set(prevReadMessages);
                updatedReadMessages.add(messageId);
                return updatedReadMessages;
            });

            if (socket) {
                socket.emit('messageRead', { messageId, userId });
            }
        }
    };

    useEffect(() => {
        const options: IntersectionObserverInit = {
            root: null,
            threshold: 0.5,
        };

        messageObserver.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const messageId = entry.target.getAttribute('data-message-id');
                    const senderId = entry.target.getAttribute('data-sender-id');
                    if (messageId && senderId !== user?._id) {
                        handleMessageRead(messageId, user?._id!);
                    }
                }
            });
        }, options);

        const messageElements = document.querySelectorAll('.chat-message');
        messageElements.forEach((element) => {
            messageObserver.current?.observe(element);
        });

        return () => {
            messageObserver.current?.disconnect();
        };
    }, [messages, readMessages]);



    useEffect(() => {
        scrollToBottom()
    }, [messages])


    useEffect(() => {
        if (socket) {
            socket.on('messageStatusUpdated', (updatedMessage: Message) => {
                dispatch(updateMessageStatus(updatedMessage));
            });
        }

        return () => {
            socket?.off('messageStatusUpdated');
        };
    }, [socket, dispatch]);

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

    return (
        <div className="flex-1 overflow-y-auto p-3   pb-16">
            {messages.map((message) => {
                const onlyEmojis = isOnlyEmojis(message.text || '');
                return (
                    <div
                        key={message._id}
                        className={`flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            data-message-id={message._id}
                            data-sender-id={message.senderId}
                            className={`chat-message max-w-xs p-3 m-2 mb-5 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer ${message.senderId === user?._id
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
                                <div className={`inter ${onlyEmojis ? 'text-4xl' : 'text-sm md:text-base'}`}>
                                    {message.text}
                                </div>
                            )}
                            <div className="text-xs mt-2 flex items-center justify-between">
                                <span className={`${message.senderId === user?._id ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {message.senderId === user?._id && (
                                    <span className="ml-2 flex items-center">
                                        {message.status === 'sent' && <span className="text-xs text-gray-400">✓</span>}
                                        {message.status === 'delivered' && <span className="text-xs text-gray-400">✓✓</span>}
                                        {message.status === 'read' && (
                                            <span className="text-xs text-white">✓✓</span>
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
    );

}
