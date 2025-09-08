import React from 'react';
import { Link } from 'react-router-dom';

const ConversationItem = ({ conversation, currentUserId }) => {
  const otherUser = conversation.participants?.find(p => p.id !== currentUserId);
  if (!otherUser) return null; // لا تعرض المحادثة إذا لم يتم العثور على الطرف الآخر

  return (
    <li>
      <Link 
        to={`/chat/${conversation.id}`} 
        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition cursor-pointer"
      >
        <img 
          src={otherUser.avatar_url} 
          alt={otherUser.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-neutral-800 truncate">{otherUser.name}</h3>
            {conversation.last_message?.created_at && (
              <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                {new Date(conversation.last_message.created_at).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-1">
            {conversation.last_message?.body || 'لا توجد رسائل بعد'}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default ConversationItem;
