type DotProps = {
   className?: string;
};

const Dot = ({ className = '' }: DotProps) => {
   return (
      <span
         className={`h-2 w-2 rounded-full bg-gray-500 animate-pulse ${className}`.trim()}
      />
   );
};

const TypingIndicator = () => {
   return (
      <div className="px-4 py-2 rounded-xl max-w-[80%] bg-gray-300 text-gray-800 self-start">
         <span className="inline-flex items-center gap-1">
            <Dot />
            <Dot className="delay-150" />
            <Dot className="delay-300" />
         </span>
      </div>
   );
};

export default TypingIndicator;
