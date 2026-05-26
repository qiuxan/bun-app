import { Button } from './ui/button';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   response: string;
};

type ChatMessage = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const conversationID = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      reset({ prompt: '' });
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationID: conversationID.current,
      });
      setMessages((prev) => [...prev, { content: data.response, role: 'bot' }]);
      setIsBotTyping(false);
   };

   const onKyeDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   useEffect(() => {
      if (lastMessageRef.current) {
         lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   const onCopySelection = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.clipboardData.setData('text/plain', selection);
         e.preventDefault();
      }
   };
   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-4 mb-10 overflow-y-auto">
            {messages.map((message, index) => (
               <div
                  onCopy={onCopySelection}
                  key={index}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className={`
                     px-4 py-2 rounded-xl max-w-[80%] 
                     ${
                        message.role === 'user'
                           ? 'bg-blue-500 text-white self-end'
                           : 'bg-gray-300 text-gray-800 self-start'
                     }`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </div>
            ))}
            {isBotTyping && (
               <div className="px-4 py-2 rounded-xl max-w-[80%] bg-gray-300 text-gray-800 self-start">
                  <span className="inline-flex items-center gap-1">
                     <span className="h-2 w-2 rounded-full bg-gray-500 animate-pulse" />
                     <span className="h-2 w-2 rounded-full bg-gray-500 animate-pulse delay-150" />
                     <span className="h-2 w-2 rounded-full bg-gray-500 animate-pulse delay-300" />
                  </span>
               </div>
            )}
         </div>
         <form
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKyeDown}
         >
            <textarea
               autoFocus
               {...register('prompt', {
                  required: true,
                  validate: (value) => value.trim() !== '',
               })}
               className="border-0 focus:outline-none p-2 w-full resize-none"
               placeholder="Type your message here..."
               maxLength={1000}
            />
            <Button
               type="submit"
               className="rounded-full w-10 h-10 p-0"
               disabled={!formState.isValid}
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
