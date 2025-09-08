// src/pages/ChatInterface.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';

const ChatInterface = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const fetchChatData = useCallback(async () => {
    if (!conversationId) {
      setError("لم يتم تحديد المحادثة المطلوبة.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/conversations/${conversationId}?with=messages.user,participants`);
      const convoData = response.data;
      setConversation(convoData);
      setMessages(convoData.messages || []); 
    } catch (err) {
      setError("لا يمكن تحميل هذه المحادثة.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchChatData();
  }, [isAuthenticated, navigate, fetchChatData]);

  const handleSend = useCallback(async () => {
    if (newMessage.trim() === "" || sending) return;
    
    setSending(true);
    const tempId = Date.now();
    const newMsgObject = {
      id: tempId,
      body: newMessage,
      created_at: new Date().toISOString(),
      user_id: user.id,
      user: { id: user.id, name: user.name, avatar_url: user.avatar_url },
    };

    setMessages(prev => [...prev, newMsgObject]);
    const messageToSend = newMessage;
    setNewMessage("");

    try {
      const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
        body: messageToSend,
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? response.data : msg
      ));
    } catch (error) {
      console.error("فشل في إرسال الرسالة:", error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      alert("فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, conversationId, user]);

  if (loading) return <LoadingState message="جاري تحميل المحادثة..." />;
  if (error) return <ErrorState message={error} onRetry={fetchChatData} />;

  const otherUser = conversation?.participants?.find(p => p.id !== user?.id);

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 py-8 flex justify-center">
      <div className="flex flex-col max-w-4xl w-full h-[85vh] bg-white rounded-2xl shadow-lg overflow-hidden border">
        <ChatHeader otherUser={otherUser} />
        <MessageList messages={messages} currentUserId={user?.id} />
        <MessageInput 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={handleSend}
          isSending={sending}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
