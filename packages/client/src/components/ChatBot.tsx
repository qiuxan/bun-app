import { Button } from './ui/button';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';

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
   const conversationID = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationID: conversationID.current,
      });
      setMessages((prev) => [...prev, { content: data.response, role: 'bot' }]);
   };

   const onKyeDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-4 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  className={`
                     px-4 py-2 rounded-xl max-w-[80%] 
                     ${
                        message.role === 'user'
                           ? 'bg-blue-500 text-white self-end'
                           : 'bg-gray-300 text-gray-800 self-start'
                     }`}
               >
                  {message.content}
               </p>
            ))}
         </div>
         <form
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKyeDown}
         >
            <textarea
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
