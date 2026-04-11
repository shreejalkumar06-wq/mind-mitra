import { io } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
const SOCKET_PATH =
  process.env.NEXT_PUBLIC_SOCKET_PATH || '/socket.io';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }

  return socket;
}
