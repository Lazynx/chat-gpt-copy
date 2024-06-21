import { Router } from 'express';
import { Server, WebSocket } from 'ws';
import ChatService from './chat.service';
import ChatController from './chat.controller';

const chatRouter = Router();

const chatService = new ChatService();
const chatController = new ChatController(chatService);

const wss = new Server({ noServer: true });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (message: string) => {
    const userPrompt = message.toString();
    await chatController.handleWebSocketConnection(ws, userPrompt);
  });

  ws.send('Connected to WebSocket server');
});

chatRouter.get('/roadmaps', (req, res) => {
  res.send('Roadmap API is running');
});

export { chatRouter, wss };
