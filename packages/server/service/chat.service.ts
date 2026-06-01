import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';
import { llmClient } from '../llm/client';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
   console.error(
      'Error: OPENAI_API_KEY is not set in the environment variables.'
   );
   process.exit(1);
}

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

const client = new OpenAI({
   apiKey: OPENAI_API_KEY,
});

interface ChatResponse {
   id: string;
   message: string;
}

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationID: string
   ): Promise<ChatResponse> {
      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions,
         prompt,
         temperature: 0.2,
         max_output_tokens: 200,
         previousResponseId:
            conversationRepository.getPreviousResponseId(conversationID),
      });

      conversationRepository.setPreviousResponseId(conversationID, response.id);
      return {
         id: response.id,
         message: response.message,
      };
   },
};
