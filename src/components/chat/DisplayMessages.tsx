import React, { useEffect, useRef, useState } from 'react';
import AudioPlayer from './AudioPlayer';
import Lightbox from './LightBox';
import { Message } from '../../types/chat';
import { isOnlyEmojis } from '../../utils/CheckIsEmojis';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { useSocket } from '../../contexts/SocketContext';
import { deleteMessage, resetUnreadCount, updateMessageStatus } from '../redux/slices/chatSlice';
import { Reply, Trash2, X } from 'lucide-react';

interface DisplayMessagesProps {
    messages: Message[];
    onReply? : (message:Message)=>void
}

export const DisplayMessages: React.FC<DisplayMessagesProps> = ({ messages,onReply }) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [readMessages, setReadMessages] = useState<Set<string>>(new Set());

    const messageObserver = useRef<IntersectionObserver | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const dispatch: AppDispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.user);
    const { socket } = useSocket();

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
                    const conversationId = entry.target.getAttribute('data-conversation-id');
                    if (messageId && senderId !== user?._id) {
                        handleMessageRead(messageId, user?._id!, conversationId!);
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
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket) {
            socket.on('messageStatusUpdated', (updatedMessage: Message) => {
                dispatch(updateMessageStatus(updatedMessage));
            });
            socket.on('messageDeleted', (message: Message) => {
                dispatch(deleteMessage(message._id));
            });
        }

        return () => {
            socket?.off('messageStatusUpdated');
            socket?.off('messageDeleted');
        };
    }, [socket, dispatch]);

    const handleMessageRead = (messageId: string, userId: string, conversationId: string) => {
        if (!readMessages.has(messageId)) {
            setReadMessages((prevReadMessages) => {
                const updatedReadMessages = new Set(prevReadMessages);
                updatedReadMessages.add(messageId);
                dispatch(resetUnreadCount(conversationId));
                return updatedReadMessages;
            });

            if (socket) {
                socket.emit('messageRead', { messageId, userId });
            }
        }
    };

    const handleImageClick = (url: string) => {
        setCurrentImageUrl(url);
        setIsLightboxOpen(true);
    };

    const handleCloseLightbox = () => {
        setIsLightboxOpen(false);
        setCurrentImageUrl('');
    };

    const handleDeleteMessage = (messageId: string) => {
        if (socket) {
            socket.emit('deleteMessage', { messageId });
        }
    };

    const handleReply = (message: Message) => {
        setReplyingTo(message);
        onReply(message)
        const inputField = document.getElementById('chat-input');
        if (inputField) {
            inputField.focus();
        }
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const ReplyPreview = ({ message }: { message: Message }) => (
        <div className="bg-gray-100 p-2 rounded-lg mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Reply size={16} className="text-blue-500" />
                <span className="text-sm text-gray-600 truncate">{message.text}</span>
            </div>
            <button onClick={cancelReply} className="text-gray-500 hover:text-gray-700">
                <X size={16} />
            </button>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto p-3 pb-16">
            {replyingTo && <ReplyPreview message={replyingTo} />}
            {messages.map((message) => {
                const onlyEmojis = isOnlyEmojis(message.text || '');
                const isCurrentUser = message.senderId === user?._id;
                const isHovered = hoveredMessageId === message._id;
                return (
                    <div
                        key={message._id}
                        className={`flex relative ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            data-message-id={message._id}
                            data-sender-id={message.senderId}
                            data-conversation-id={message.conversationId}
                            className={`chat-message relative max-w-xs p-3 m-2 mb-5 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg ${isCurrentUser
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                    : 'bg-white text-gray-800'
                                }`}
                            onMouseEnter={() => setHoveredMessageId(message._id)}
                            onMouseLeave={() => setHoveredMessageId(null)}
                        >
                            {message.replyTo?.text && (
                                <div className={`text-xs mb-2 p-2 rounded ${isCurrentUser ? 'bg-blue-400' : 'bg-gray-200'}`}>
                                    <p className="font-semibold">Replying to:</p>
                                    <p className="truncate">{message.replyTo.text}</p>
                                </div>
                            )}
                            {message.fileUrl ? (
                                message.fileType === 'audio' ? (
                                    <AudioPlayer src={message.fileUrl} />
                                ) : message.fileType === 'image' ? (
                                    <img
                                        src={message.fileUrl}
                                        alt="Uploaded image"
                                        className="w-full rounded cursor-pointer"
                                        onClick={() => handleImageClick(message.fileUrl)}
                                    />
                                ) : message.fileType === 'video' ? (
                                    <video controls src={message.fileUrl} className="w-full rounded" />
                                ) : null
                            ) : (
                                <div className={`inter ${onlyEmojis ? 'text-4xl' : 'text-sm md:text-base'}`}>
                                    {message.text}
                                </div>
                            )}
                            <div className="text-xs mt-2 flex items-center justify-between">
                                <span className={isCurrentUser ? 'text-blue-100' : 'text-gray-500'}>
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div className="flex items-center space-x-2">
                                    {!isCurrentUser && (
                                        <button
                                            onClick={() => handleReply(message)}
                                            className={`reply-button ml-4 transition-colors duration-300  ${isHovered ? 'text-blue-500' : 'text-gray-400'
                                                }`}
                                        >
                                            <Reply size={16} />
                                        </button>
                                    )}
                                    {isCurrentUser && (
                                        <>
                                            {message.status === 'sent' && <span className="text-xs text-gray-400">✓</span>}
                                            {message.status === 'delivered' && <span className="text-xs text-gray-400">✓✓</span>}
                                            {message.status === 'read' && <span className="text-xs text-white">✓✓</span>}
                                            <button
                                                onClick={() => handleDeleteMessage(message._id || '')}
                                                className={`p-1 rounded-full transition-all duration-300 ${isHovered ? 'bg-red-500 text-white' : 'bg-transparent text-gray-400'
                                                    }`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef}></div>
            {isLightboxOpen && (
                <Lightbox imageUrl={currentImageUrl} onClose={handleCloseLightbox} />
            )}
        </div>
    );
};