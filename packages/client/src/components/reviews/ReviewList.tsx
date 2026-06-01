import axios from 'axios';
import { useEffect, useState } from 'react';

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

   const fetchReviews = async () => {
      try {
         const response = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
         );
         setReviewData(response.data);
      } catch (error) {
         console.error('Failed to fetch reviews:', error);
      }
   };

   useEffect(() => {
      fetchReviews();
   }, [productId]);

   return (
      <div className="flex flex-col gap-4">
         {reviewData?.reviews.map((review) => (
            <div key={review.id} className="border p-4 rounded">
               <div className="font-semibold">{review.author}</div>
               <div>
                  {'⭐'.repeat(review.rating)}{' '}
                  <span className="text-sm text-gray-500">
                     ({review.rating}/5)
                  </span>
               </div>
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
