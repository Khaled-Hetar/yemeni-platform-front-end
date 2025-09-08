// src/components/chat/MessageInput.jsx
import React from 'react';
import { FaPaperPlane } from "react-icons/fa";

const MessageInput = ({ value, onChange, onSend, isSending }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center p-4 border-t bg-white">
      <textarea
        placeholder="اكتب رسالتك هنا..."
        value={value}
        onChange={onChange}
        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500 resize-none"
        rows={1}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={onSend}
        disabled={isSending || !value.trim()}
        className="mr-3 bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full transition disabled:opacity-50"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default MessageInput;
