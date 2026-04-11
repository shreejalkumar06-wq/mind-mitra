import { supabase } from '../config/supabase.js';

export function registerChatHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('chat:join', async ({ roomId, userId }) => {
      if (!roomId) {
        socket.emit('chat:error', { message: 'roomId is required' });
        return;
      }

      socket.data.userId = userId || null;
      socket.data.roomId = roomId;
      socket.join(roomId);
      socket.emit('chat:joined', { roomId });
    });

    socket.on('chat:leave', ({ roomId }) => {
      if (!roomId) {
        return;
      }

      socket.leave(roomId);
      socket.emit('chat:left', { roomId });
    });

    socket.on('chat:message', async (payload) => {
      try {
        const roomId = payload.roomId || socket.data.roomId;
        const userId = payload.userId || socket.data.userId || null;
        const senderAlias = payload.displayName?.trim() || 'Anonymous';
        const message = payload.message?.trim();

        if (!roomId || !message) {
          socket.emit('chat:error', { message: 'roomId and message are required' });
          return;
        }

        const { data, error } = await supabase
          .from('chat_messages')
          .insert({
            room_id: roomId,
            user_id: userId,
            sender_alias: senderAlias,
            message,
          })
          .select('id, room_id, user_id, sender_alias, message, created_at')
          .single();

        if (error) {
          throw new Error(error.message);
        }

        io.to(roomId).emit('chat:message', data);
      } catch (error) {
        socket.emit('chat:error', {
          message: error.message || 'Unable to send message',
        });
      }
    });
  });
}
