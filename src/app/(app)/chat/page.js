'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import styles from './page.module.css';

const ROOM_ICONS = {
  chat: '💬',
  wave: '🌊',
  spark: '✨',
  moon: '🌙',
};

function normalizeMessage(message, currentUserId) {
  return {
    id: message.id,
    roomId: message.room_id,
    text: message.message,
    sender: message.sender_alias,
    isSelf: message.user_id === currentUserId,
    time: message.created_at,
  };
}

export default function ChatPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await apiRequest('/chat/rooms');
        setRooms(response.rooms.map((room) => ({
          ...room,
          iconGlyph: ROOM_ICONS[room.icon] || '💬',
        })));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load chat rooms.');
      }
    };

    loadRooms();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const socket = getSocket();
    socketRef.current = socket;

    const handleMessage = (message) => {
      if (message.room_id !== activeRoom) {
        return;
      }

      setRoomMessages((currentMessages) => [
        ...currentMessages,
        normalizeMessage(message, user.id),
      ]);
    };

    const handleError = (payload) => {
      setError(payload?.message || 'Chat connection issue.');
    };

    socket.on('chat:message', handleMessage);
    socket.on('chat:error', handleError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('chat:message', handleMessage);
      socket.off('chat:error', handleError);
      socket.disconnect();
    };
  }, [user?.id, activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages, activeRoom]);

  useEffect(() => {
    const loadRoomMessages = async () => {
      if (!activeRoom || !user?.id) {
        return;
      }

      try {
        setError('');
        const response = await apiRequest(`/chat/rooms/${activeRoom}/messages?limit=50`);
        setRoomMessages(response.messages.map((message) => normalizeMessage(message, user.id)));
        socketRef.current?.emit('chat:join', {
          roomId: activeRoom,
          userId: user.id,
        });
        setTimeout(() => inputRef.current?.focus(), 100);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load room messages.');
      }
    };

    loadRoomMessages();

    return () => {
      if (activeRoom) {
        socketRef.current?.emit('chat:leave', { roomId: activeRoom });
      }
    };
  }, [activeRoom, user?.id]);

  const sendMessage = () => {
    if (!input.trim() || !activeRoom || !user?.id) {
      return;
    }

    socketRef.current?.emit('chat:message', {
      roomId: activeRoom,
      userId: user.id,
      displayName: user.displayName,
      message: input.trim(),
    });

    setInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!activeRoom) {
    return (
      <div className={styles.page}>
        <h2 className={styles.title}>Anonymous Chat</h2>
        <p className={styles.sub}>Talk openly. No one knows who you are.</p>
        {error && <p className={styles.sub}>{error}</p>}
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <button key={room.id} className={styles.roomCard} onClick={() => setActiveRoom(room.id)}>
              <span className={styles.roomIcon}>{room.iconGlyph}</span>
              <div className={styles.roomInfo}>
                <p className={styles.roomName}>{room.name}</p>
                <p className={styles.roomDesc}>{room.description}</p>
              </div>
              <div className={styles.roomMeta}>
                <span className={styles.onlineDot} />
                <span className={styles.onlineCount}>{Math.floor(Math.random() * 15) + 2}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          ))}
        </div>
        <div className={styles.safetyNote}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span>All chats are anonymous and moderated for safety</span>
        </div>
      </div>
    );
  }

  const room = rooms.find((item) => item.id === activeRoom);

  return (
    <div className={styles.chatView}>
      <div className={styles.chatHeader}>
        <button className={styles.backBtn} onClick={() => setActiveRoom(null)} aria-label="Back to rooms">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>
        <div>
          <p className={styles.chatRoomName}>{room?.iconGlyph} {room?.name}</p>
          <p className={styles.chatRoomSub}>{room?.description}</p>
        </div>
        <button className={styles.exitBtn} onClick={() => setActiveRoom(null)} aria-label="Exit chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Exit
        </button>
      </div>

      <div className={styles.messageArea}>
        {roomMessages.length === 0 && (
          <div className={styles.emptyChat}>
            <p>No messages yet. Say hello!</p>
            <p className={styles.emptySub}>This is a safe, judgment-free space.</p>
          </div>
        )}
        {roomMessages.map((message) => (
          <div key={message.id} className={`${styles.message} ${message.isSelf ? styles.msgSelf : styles.msgOther}`}>
            {!message.isSelf && <span className={styles.msgSender}>{message.sender}</span>}
            <div className={styles.msgBubble}>
              <p>{message.text}</p>
            </div>
            <span className={styles.msgTime}>
              {new Date(message.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p className={styles.chatRoomSub}>{error}</p>}

      <div className={styles.inputBar}>
        <input
          ref={inputRef}
          className={styles.chatInput}
          placeholder="Type a message..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
        />
        <button className={styles.sendBtn} onClick={sendMessage} disabled={!input.trim()} aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  );
}
