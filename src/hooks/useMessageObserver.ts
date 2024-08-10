// import { useState, useRef, useEffect, MutableRefObject } from 'react';

// export const useMessageObserver = (onMessageRead: (messageId: string) => void): MutableRefObject<IntersectionObserver | null> => {
//   const [observedMessages, setObservedMessages] = useState<Set<string>>(new Set());

//   const messageObserver = useRef<IntersectionObserver | null>(null);

//   useEffect(() => {
//     console.log("Setting up message observer");
//     messageObserver.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           console.log('entry intersecting is ',entry.isIntersecting)
//           if (entry.isIntersecting) {
//             const messageId = entry.target.getAttribute('data-message-id');
//             console.log(`Message ${messageId} intersection: ${entry.isIntersecting}`);
//             if (messageId && !observedMessages.has(messageId)) {
//               console.log("Calling onMessageRead for:", messageId);
//               onMessageRead(messageId);
//               setObservedMessages((prev) => new Set(prev).add(messageId));
//             }
//           }
//         });
//       },
//       { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
//     );

//     return () => {
//       console.log("Disconnecting message observer");
//       messageObserver.current?.disconnect();
//     };
//   }, [observedMessages, onMessageRead]);

//   return messageObserver;
// };

import { useState, useRef, useEffect, MutableRefObject } from 'react';

export const useMessageObserver = (onMessageRead: (messageId: string) => void): MutableRefObject<IntersectionObserver | null> => {
  const [observedMessages, setObservedMessages] = useState<Set<string>>(new Set());

  const messageObserver = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    messageObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            if (messageId && !observedMessages.has(messageId)) {
              onMessageRead(messageId);
              setObservedMessages((prev) => new Set([...prev, messageId]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    return () => {
      messageObserver.current?.disconnect();
    };
  }, [observedMessages, onMessageRead]);

  return messageObserver;
};
