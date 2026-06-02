import Skeleton from 'react-loading-skeleton';

const ReviewSkeleton = () => {
   return (
      <div className="border p-4 rounded">
         <div className="mb-2">
            <Skeleton width={120} />
         </div>
         <div className="mb-2">
            <Skeleton width={96} />
         </div>
         <div className="mb-2 text-sm">
            <Skeleton width={140} />
         </div>
         <Skeleton count={2} />
      </div>
   );
};

export default ReviewSkeleton;
