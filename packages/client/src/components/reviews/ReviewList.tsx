import axios from 'axios';
import RatingDisplay from './RatingDisplay';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@base-ui/react/button';
import { HiSparkles } from 'react-icons/hi2';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';

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

type SummarizeReviewsResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const [summary, setSummary] = useState('');
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
   const [summaryError, setSummaryError] = useState('');

   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const handleSummarize = async () => {
      try {
         setSummaryError('');
         setIsSummaryLoading(true);
         const response = await axios.post<SummarizeReviewsResponse>(
            `/api/products/${productId}/reviews/summarize`
         );
         setSummary(response.data.summary);
      } catch (err) {
         console.error('Error summarizing reviews:', err);
         setSummaryError('Error summarizing reviews. Please try again later.');
      } finally {
         setIsSummaryLoading(false);
      }
   };

   const fetchReviews = async () => {
      const response = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return response.data;
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
               <div
                  key={`skeleton-review-${index}`}
                  className="border p-4 rounded"
               >
                  <ReviewSkeleton />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-red-500">
            Could not load reviews. Please try again later.
         </div>
      );
   }

   const displaySummary = summary || reviewData?.summary;
   return (
      <div>
         <div className="bm-5">
            {displaySummary ? (
               <div className="bg-gray-100 p-4 rounded mb-6">
                  <p>{displaySummary}</p>
               </div>
            ) : (
               <div>
                  <Button
                     className="cursor-pointer mb-2 inline-flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                     onClick={handleSummarize}
                     disabled={isSummaryLoading}
                  >
                     <span className="inline-flex items-center gap-2">
                        <HiSparkles aria-hidden="true" className="h-4 w-4" />
                        <span>Summarize</span>
                     </span>
                  </Button>
                  {isSummaryLoading && (
                     <div className="py-3 ">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryError && (
                     <div className="text-red-500">{summaryError}</div>
                  )}
               </div>
            )}
         </div>

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
      </div>
   );
};

export default ReviewList;
