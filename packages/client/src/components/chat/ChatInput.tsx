import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

export type ChatInputFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatInputFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } =
      useForm<ChatInputFormData>();

   const handleFormSubmit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleFormSubmit();
      }
   };

   return (
      <form
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         onSubmit={handleFormSubmit}
         onKeyDown={handleKeyDown}
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
   );
};

export default ChatInput;
