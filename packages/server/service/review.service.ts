import { OpenAI } from 'openai/index.js';
import type { Review } from '../generated/prisma/browser';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviewsByProductId(productId: number): Promise<Review[]> {
      return reviewRepository.getReviewsByProductId(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviewsByProductId(
         productId,
         10
      );
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      const prompt = `Summarize the following reviews for product ${productId} into a short paragraph highlighting the key themes, both positive and negative:\n\n ${joinedReviews}`;

      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 200,
      });

      return response.output_text;
   },
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
   console.error(
      'Error: OPENAI_API_KEY is not set in the environment variables.'
   );
   process.exit(1);
}
const client = new OpenAI({
   apiKey: OPENAI_API_KEY,
});
