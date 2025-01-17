import {  useRef, useEffect, MutableRefObject } from 'react';

export const useMessageObserver = (onMessageRead: (messageId: string,userId:string) => void): MutableRefObject<IntersectionObserver | null> => {
  const observedMessages = useRef<Set<string>>(new Set());
  const messageObserver = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    console.log('observing')
    messageObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('intersecting')
            const messageId = entry.target.getAttribute('data-message-id');
            const userId = entry.target.getAttribute('data-user-id');
            if (messageId) {
              console.log('on message read and observed',messageId)
              onMessageRead(messageId,userId!);
              observedMessages.current.add(messageId); // Update the ref directly
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    return () => {
      messageObserver.current?.disconnect();
    };
  }, [onMessageRead]);

  return messageObserver;
};
