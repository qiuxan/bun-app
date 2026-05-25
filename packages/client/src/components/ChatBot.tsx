import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

const ChatBot = () => {
   return (
      <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
         <textarea
            className="border-0 focus:outline-none p-2 w-full resize-none"
            placeholder="Type your message here..."
            maxLength={1000}
         />
         <Button className="rounded-full w-10 h-10 p-0">
            <FaArrowUp />
         </Button>
      </div>
   );
};

export default ChatBot;
