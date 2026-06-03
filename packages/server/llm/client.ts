import OpenAI from 'openai';

import { InferenceClient } from '@huggingface/inference';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
   console.error(
      'Error: OPENAI_API_KEY is not set in the environment variables.'
   );
   process.exit(1);
}
const openAIClient = new OpenAI({
   apiKey: OPENAI_API_KEY,
});

const hfClient = new InferenceClient(process.env.HF_TOKEN);

const HF_SUMMARY_MODEL_MAX_INPUT_TOKENS = 1024;
const APPROX_CHARS_PER_TOKEN = 4;

function limitInputToApproxTokens(input: string, maxTokens: number): string {
   const approxMaxChars = maxTokens * APPROX_CHARS_PER_TOKEN;

   if (input.length <= approxMaxChars) {
      return input;
   }

   const truncated = input.slice(0, approxMaxChars);
   const lastWhitespaceIndex = truncated.lastIndexOf(' ');

   if (lastWhitespaceIndex <= 0) {
      return truncated;
   }

   return truncated.slice(0, lastWhitespaceIndex);
}

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   temperature?: number;
   max_output_tokens?: number;
   instructions?: string;
   previousResponseId?: string;
};

type GenerateTextResult = {
   id: string;
   message: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-4o-mini',
      prompt,
      temperature = 0.7,
      instructions,
      max_output_tokens = 300,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await openAIClient.responses.create({
         model: model,
         input: prompt,
         instructions,
         temperature: temperature,
         max_output_tokens: max_output_tokens,
         previous_response_id: previousResponseId,
      });

      return {
         id: response.id,
         message: response.output_text,
      };
   },

   async generateSummaryWithHuggingFace(inputs: string) {
      const limitedInputs = limitInputToApproxTokens(
         inputs,
         HF_SUMMARY_MODEL_MAX_INPUT_TOKENS
      );

      const output = await hfClient.summarization({
         model: 'facebook/bart-large-cnn',
         inputs: limitedInputs,
         provider: 'hf-inference',
      });

      return output.summary_text;
   },
};
