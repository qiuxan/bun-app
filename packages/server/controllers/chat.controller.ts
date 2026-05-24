import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../service/chat.service';

const ChatRequestSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt cannot be empty')
      .max(1000, 'Prompt cannot exceed 1000 characters'),
   conversationID: z.uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = ChatRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
         res.status(400).json({ error: z.treeifyError(parseResult.error) });
         return;
      }

      try {
         const { prompt, conversationID } = parseResult.data;
         const response = await chatService.sendMessage(prompt, conversationID);
         res.json({ response: response.message });
      } catch (error) {
         console.error('Error processing chat request:', error);
         res.status(500).json({ error: 'Internal Server Error' });
      }
   },
};
