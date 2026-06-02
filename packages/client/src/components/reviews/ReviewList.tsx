import axios from 'axios';
import { useEffect, useState } from 'react';
import RatingDisplay from './RatingDisplay';

import Skeleton from 'react-loading-skeleton';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

const ReviewList = ({ productId }: Props) => {
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const fetchReviews = async () => {
      setIsLoading(true);
      try {
         const response = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
         );
         setReviewData(response.data);
      } catch (error) {
         console.error('Failed to fetch reviews:', error);
         setError('Failed to load reviews. Please try again later.');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchReviews();
   }, [productId]);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
               <div
                  key={`skeleton-review-${index}`}
                  className="border p-4 rounded"
               >
                  <div className="mb-2">
                     <Skeleton width={120} />
                  </div>
                  <div className="mb-2">
                     <Skeleton width={96} />
                  </div>
                  <div className="mb-2 text-sm text-gray-500">
                     <Skeleton width={140} />
                  </div>
                  <Skeleton count={2} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return <div className="text-red-500">{error}</div>;
   }
   return (
      <div className="flex flex-col gap-4">
         {reviewData?.reviews.map((review) => (
            <div key={review.id} className="border p-4 rounded">
               <div className="font-semibold">{review.author}</div>
               <RatingDisplay rating={review.rating} />
               <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
               </div>
               <p>{review.content}</p>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;
