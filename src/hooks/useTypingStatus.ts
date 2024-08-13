import { useEffect, useRef, useState } from "react";

export const useTypingStatus = (socket: any, conversationId: string, userId: string) => {
    const [isTyping, setIsTyping] = useState(false);
    const typingTimer = useRef<NodeJS.Timeout | null>(null);
  
    const handleTyping = () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
  
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing', { conversationId, userId, isTyping: true });
      }
  
      typingTimer.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', { conversationId, userId, isTyping: false });
      }, 1000);
    };
  
    useEffect(() => {
      return () => {
        if (typingTimer.current) {
          clearTimeout(typingTimer.current);
        }
      };
    }, []);
  
    return { isTyping, handleTyping };
  };

