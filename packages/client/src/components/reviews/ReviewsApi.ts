import axios from 'axios';

export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

export type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

export type SummarizeReviewsResponse = {
   summary: string;
};

const summarizeReviews = (productId: number) => {
   return axios
      .post<SummarizeReviewsResponse>(
         `/api/products/${productId}/reviews/summarize`
      )
      .then((response) => response.data);
};

const getReviews = (productId: number) => {
   return axios
      .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
      .then((response) => response.data);
};

export const reviewsApi = {
   summarizeReviews,
   getReviews,
};
