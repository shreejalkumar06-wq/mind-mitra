import { supabase } from '../config/supabase.js';

export async function listChatRooms(req, res) {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('id, name, description, icon, created_at')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  res.json({
    rooms: data,
  });
}

export async function listRoomMessages(req, res) {
  const { roomId } = req.params;
  const limit = Number(req.query.limit || 50);

  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, room_id, user_id, sender_alias, message, created_at')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  res.json({
    messages: data.reverse(),
  });
}
