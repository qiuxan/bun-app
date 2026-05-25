import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
   prompt: string;
};

const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = (data: FormData) => {
      console.log(data);
      reset();
   };

   const onKyeDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
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
   );
};

export default ChatBot;
