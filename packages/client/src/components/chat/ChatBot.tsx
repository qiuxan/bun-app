import axios from 'axios';
import { useRef, useState } from 'react';
import ChatMessages, { type ChatMessage } from './ChatMessages';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import type { ChatInputFormData } from './ChatInput';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;
const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
   response: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');
   const conversationID = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatInputFormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);

      setError('');
      popAudio.play();
      try {
         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationID: conversationID.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.response, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (err) {
         setError('Failed to fetch response. Please try again.');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-4 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && (
               <div className="px-4 py-2 rounded-xl max-w-[80%] bg-red-300 text-red-800 self-start">
                  {error}
               </div>
            )}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
