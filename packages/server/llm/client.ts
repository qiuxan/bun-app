import OpenAI from 'openai';

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
      const response = await client.responses.create({
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
};
