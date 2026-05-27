import React, { useEffect, type ClipboardEvent, type RefObject } from 'react';
import ReactMarkdown from 'react-markdown';

export type ChatMessage = {
   content: string;
   role: 'user' | 'bot';
};

type ChatMessagesProps = {
   messages: ChatMessage[];
};

const ChatMessages = ({ messages }: ChatMessagesProps) => {
   const lastMessageRef: RefObject<HTMLDivElement | null> = React.createRef();

   useEffect(() => {
      if (lastMessageRef.current) {
         lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   const onCopySelection = (e: ClipboardEvent<HTMLDivElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.clipboardData.setData('text/plain', selection);
         e.preventDefault();
      }
   };

   return (
      <>
         {messages.map((message, index) => (
            <div
               onCopy={onCopySelection}
               key={index}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               className={`
							px-4 py-2 rounded-xl max-w-md
							${
                        message.role === 'user'
                           ? 'bg-blue-500 text-white self-end'
                           : 'bg-gray-300 text-gray-800 self-start'
                     }`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
      </>
   );
};

export default ChatMessages;
