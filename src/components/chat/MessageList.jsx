// src/components/chat/MessageList.jsx
import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50">
      {messages.length > 0 ? (
        messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwnMessage={msg.user_id === currentUserId} 
          />
        ))
      ) : (
        <div className="text-center text-gray-500 pt-10">
          <p>لا توجد رسائل في هذه المحادثة بعد. ابدأ الحوار!</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
