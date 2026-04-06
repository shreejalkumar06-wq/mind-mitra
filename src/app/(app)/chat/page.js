'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

const ROOMS = [
  { id: 'general', name: 'General Support', desc: 'A safe space for anything on your mind', icon: '💬' },
  { id: 'anxiety', name: 'Anxiety & Stress', desc: 'Share and cope together', icon: '🌊' },
  { id: 'selfcare', name: 'Self-Care Corner', desc: 'Tips, wins, and encouragement', icon: '✨' },
  { id: 'night', name: 'Night Owls', desc: "For when sleep won't come", icon: '🌙' },
];

const BOT_RESPONSES = [
  "That sounds really tough. I'm glad you shared that here. 💙",
  "You're not alone in feeling that way. We're here for you.",
  "Thank you for being so open. That takes courage.",
  "I hear you. It's okay to feel that way — your feelings are valid.",
  "Sending you a virtual hug. You've got this. 🤗",
  "That's a really beautiful perspective. Thanks for sharing.",
  "I've been there too. It does get better, I promise.",
  "Remember: progress isn't always linear. Be gentle with yourself.",
  "What a great insight! Self-awareness is a real strength.",
  "You deserve all the good things coming your way. ✨",
];

const BOT_NAMES = ['Gentle Breeze', 'Calm River', 'Warm Light', 'Kind Cloud', 'Soft Dawn'];

function getBotReply() {
  return {
    id: Date.now() + Math.random(),
    text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
    sender: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
    isBot: true,
    time: new Date().toISOString(),
  };
}

export default function ChatPage() {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mindmitra-chat') || '{}');
    setMessages(saved);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeRoom]);

  const saveMessages = (updated) => {
    setMessages(updated);
    localStorage.setItem('mindmitra-chat', JSON.stringify(updated));
  };

  const sendMessage = () => {
    if (!input.trim() || !activeRoom) return;
    const roomMsgs = messages[activeRoom] || [];
    const newMsg = {
      id: Date.now(),
      text: input.trim(),
      sender: user?.displayName || 'Anonymous',
      isBot: false,
      time: new Date().toISOString(),
    };
    const updated = { ...messages, [activeRoom]: [...roomMsgs, newMsg] };
    saveMessages(updated);
    setInput('');

    // Simulate a reply after 1-3 seconds
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      setMessages(prev => {
        const reply = getBotReply();
        const u = { ...prev, [activeRoom]: [...(prev[activeRoom] || []), reply] };
        localStorage.setItem('mindmitra-chat', JSON.stringify(u));
        return u;
      });
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const roomMessages = activeRoom ? (messages[activeRoom] || []) : [];

  // Room list view
  if (!activeRoom) {
    return (
      <div className={styles.page}>
        <h2 className={styles.title}>Anonymous Chat</h2>
        <p className={styles.sub}>Talk openly. No one knows who you are.</p>
        <div className={styles.roomList}>
          {ROOMS.map(r => (
            <button key={r.id} className={styles.roomCard} onClick={() => { setActiveRoom(r.id); setTimeout(() => inputRef.current?.focus(), 100); }}>
              <span className={styles.roomIcon}>{r.icon}</span>
              <div className={styles.roomInfo}>
                <p className={styles.roomName}>{r.name}</p>
                <p className={styles.roomDesc}>{r.desc}</p>
              </div>
              <div className={styles.roomMeta}>
                <span className={styles.onlineDot} />
                <span className={styles.onlineCount}>{Math.floor(Math.random() * 15) + 2}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </div>
        <div className={styles.safetyNote}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>All chats are anonymous and moderated for safety</span>
        </div>
      </div>
    );
  }

  // Chat view
  const room = ROOMS.find(r => r.id === activeRoom);

  return (
    <div className={styles.chatView}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <button className={styles.backBtn} onClick={() => setActiveRoom(null)} aria-label="Back to rooms">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div>
          <p className={styles.chatRoomName}>{room?.icon} {room?.name}</p>
          <p className={styles.chatRoomSub}>{Math.floor(Math.random() * 10) + 3} people here</p>
        </div>
        <button className={styles.exitBtn} onClick={() => setActiveRoom(null)} aria-label="Exit chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Exit
        </button>
      </div>

      {/* Messages */}
      <div className={styles.messageArea}>
        {roomMessages.length === 0 && (
          <div className={styles.emptyChat}>
            <p>No messages yet. Say hello! 👋</p>
            <p className={styles.emptySub}>This is a safe, judgment-free space.</p>
          </div>
        )}
        {roomMessages.map((msg) => (
          <div key={msg.id} className={`${styles.message} ${msg.isBot ? styles.msgOther : styles.msgSelf}`}>
            {msg.isBot && <span className={styles.msgSender}>{msg.sender}</span>}
            <div className={styles.msgBubble}>
              <p>{msg.text}</p>
            </div>
            <span className={styles.msgTime}>
              {new Date(msg.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputBar}>
        <input
          ref={inputRef}
          className={styles.chatInput}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
        />
        <button className={styles.sendBtn} onClick={sendMessage} disabled={!input.trim()} aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}
