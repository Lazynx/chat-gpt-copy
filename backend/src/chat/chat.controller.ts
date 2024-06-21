import ChatService from './chat.service';

class ChatController {
  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  async handleWebSocketConnection(ws: WebSocket, userPrompt: string) {
    try {
      await this.chatService.create(userPrompt, (data) => {
        ws.send(data);
      });
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Failed to process OpenAI stream' }));
    }
  }
}

export default ChatController;
