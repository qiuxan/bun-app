import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './service/chat.service';

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, World!' });
});

const ChatRequestSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt cannot be empty')
      .max(1000, 'Prompt cannot exceed 1000 characters'),
   conversationID: z.uuid(),
});

app.post('/api/chat', express.json(), async (req: Request, res: Response) => {
   const parseResult = ChatRequestSchema.safeParse(req.body);

   if (!parseResult.success) {
      res.status(400).json({ error: z.treeifyError(parseResult.error) });
      return;
   }

   try {
      const { prompt, conversationID } = req.body;
      const response = await chatService.sendMessage(prompt, conversationID);
      res.json({ response: response.message });
   } catch (error) {
      console.error('Error processing chat request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
