import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { registerChatHandlers } from './socket/chatSocket.js';

const app = createApp();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.frontendOrigins,
    credentials: true,
  },
  path: env.socketPath,
});

registerChatHandlers(io);

server.listen(env.port, () => {
  console.log(`MindMitra backend listening on port ${env.port}`);
});
