// src/components/conversations/ConversationList.jsx
import React from 'react';
import ConversationItem from './ConversationItem';
import EmptyState from './EmptyState'; // سنقوم بإنشاء هذا المكون

const ConversationList = ({ conversations, currentUserId }) => {
  if (conversations.length === 0) {
    return <EmptyState message="لا توجد لديك أي محادثات حتى الآن." />;
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {conversations.map((convo) => (
          <ConversationItem 
            key={convo.id} 
            conversation={convo} 
            currentUserId={currentUserId} 
          />
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
