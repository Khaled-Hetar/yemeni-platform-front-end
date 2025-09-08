// src/components/chat/ChatHeader.jsx
import React from 'react';

const ChatHeader = ({ otherUser }) => (
  <header className="flex items-center gap-4 bg-cyan-600 p-4 text-white rounded-t-2xl">
    {otherUser ? (
      <>
        <img
          src={otherUser.avatar_url}
          alt={otherUser.name}
          className="w-14 h-14 rounded-full border-2 border-white"
        />
        <div>
          <h2 className="text-xl font-semibold">{otherUser.name}</h2>
          <p className="text-xs text-cyan-100">متصل الآن</p> {/* يمكن ربطها بحالة فعلية لاحقًا */}
        </div>
      </>
    ) : (
      <h2 className="text-xl font-semibold">محادثة</h2>
    )}
  </header>
);

export default ChatHeader;
