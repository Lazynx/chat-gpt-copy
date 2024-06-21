import 'dotenv/config';
import express from 'express';
import globalRouter from './global-router';
import { logger } from './logger';
import http from 'http';
import { wss } from './chat/chat.router';

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

app.use(logger);
app.use(express.json());
app.use('/api/v1/', globalRouter);

const server = http.createServer(app);

// Handle WebSocket connections with origin validation
server.on('upgrade', (request, socket, head) => {
  const origin = request.headers.origin;
  // Validate the origin before proceeding
  if (origin === ALLOWED_ORIGIN) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
