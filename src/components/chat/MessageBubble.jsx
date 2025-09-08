// src/components/chat/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message, isOwnMessage }) => {
  const bubbleClasses = isOwnMessage
    ? "bg-cyan-500 text-white rounded-br-none"
    : "bg-white text-neutral-900 rounded-bl-none border";

  return (
    <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
      <div className={`rounded-2xl px-4 py-2 shadow max-w-[75%] ${bubbleClasses}`}>
        <p className="text-sm">{message.body}</p>
        <p className="text-xs text-right mt-1 opacity-70">
          {new Date(message.created_at).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
