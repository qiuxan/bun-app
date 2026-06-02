import axios from 'axios';
import RatingDisplay from './RatingDisplay';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@base-ui/react/button';
import { HiSparkles } from 'react-icons/hi2';
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
   const summarizeMutation = useMutation<SummarizeReviewsResponse>({
      mutationFn: async () => summarize(),
   });

   const reviewQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const summarize = async () => {
      const response = await axios.post<SummarizeReviewsResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return response.data;
   };

   const fetchReviews = async () => {
      const response = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return response.data;
   };

   if (reviewQuery.isLoading) {
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

   if (reviewQuery.error) {
      return (
         <div className="text-red-500">
            Could not load reviews. Please try again later.
         </div>
      );
   }

   const displaySummary =
      summarizeMutation.data?.summary || reviewQuery.data?.summary;
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
                     onClick={() => summarizeMutation.mutate()}
                     disabled={summarizeMutation.isPending}
                  >
                     <span className="inline-flex items-center gap-2">
                        <HiSparkles aria-hidden="true" className="h-4 w-4" />
                        <span>Summarize</span>
                     </span>
                  </Button>
                  {summarizeMutation.isPending && (
                     <div className="py-3 ">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summarizeMutation.error && (
                     <div className="text-red-500">
                        Could not summarize reviews. Please try again later.
                     </div>
                  )}
               </div>
            )}
         </div>

         <div className="flex flex-col gap-4">
            {reviewQuery.data?.reviews.map((review) => (
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
