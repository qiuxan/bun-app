import { FaRegStar, FaStar } from 'react-icons/fa';

type Props = {
   rating: number;
};

const RatingDisplay = ({ rating }: Props) => {
   const maxRating = 5;
   const safeRating = Math.max(0, Math.min(maxRating, rating));

   return (
      <div className="inline-flex items-center gap-1">
         <span className="inline-flex text-yellow-500">
            {Array.from({ length: maxRating }, (_, index) =>
               index < safeRating ? (
                  <FaStar key={index} />
               ) : (
                  <FaRegStar key={index} className="text-gray-300" />
               )
            )}
         </span>
         <span className="text-sm text-gray-500">({safeRating}/5)</span>
      </div>
   );
};

export default RatingDisplay;
