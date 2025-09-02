import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { FiLoader, FiAlertTriangle } from "react-icons/fi";
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("--- Debug Start ---");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("conversationId from URL:", conversationId);
    console.log("Current user object:", user);

    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to /login");
      navigate('/login');
      return;
    }

    const fetchChatData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/conversations/${conversationId}?with=messages,participants`);
        
        const convoData = response.data;
        setConversation(convoData);
        setMessages(convoData.messages || []); 

      } catch (err) {
        console.error("An error occurred during fetch:", err);
        setError("لا يمكن تحميل هذه المحادثة.");
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchChatData();
    } else {
      console.error("No conversationId provided in the URL.");
      setError("لم يتم تحديد المحادثة المطلوبة.");
      setLoading(false);
    }
  }, [conversationId, isAuthenticated, navigate, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() === "" || sending) return;
    
    setSending(true);
    const tempId = Date.now();
    const newMsgObject = {
      id: tempId,
      body: newMessage,
      createdAt: new Date().toISOString(),
      user: { id: user.id, name: user.name, avatar_url: user.avatar_url },
      userId: user.id,
    };

    setMessages(prev => [...prev, newMsgObject]);
    setNewMessage("");

    try {
      const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
        body: newMsgObject.body,
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-cyan-600 text-4xl" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <FiAlertTriangle className="text-red-500 text-4xl mb-3" />
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  const otherUser = conversation?.participants?.find(p => p.id !== user?.id);

  return (
    <div className="flex flex-col max-w-4xl mx-auto h-[80vh] bg-white rounded-2xl shadow-lg overflow-hidden border">
      <div className="flex items-center gap-4 bg-cyan-600 p-4 text-white rounded-t-2xl">
        {otherUser ? (
          <>
            <img
              src={otherUser.avatar_url}
              alt={otherUser.name}
              className="w-14 h-14 rounded-full border-2 border-white"
            />
            <div>
              <h2 className="text-xl font-semibold">{otherUser.name}</h2>
              <p className="text-xs text-cyan-100">متصل الآن</p>
            </div>
          </>
        ) : (
          <h2 className="text-xl font-semibold">محادثة</h2>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50">
        {messages.length > 0 ? messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.userId === user.id ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-2 shadow max-w-[75%] ${
                msg.userId === user.id
                  ? "bg-cyan-500 text-white rounded-br-none"
                  : "bg-white text-neutral-900 rounded-bl-none border"
              }`}
            >
              <p className="text-sm">{msg.body}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 pt-10">
            <p>لا توجد رسائل في هذه المحادثة بعد. ابدأ الحوار!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center p-4 border-t bg-white">
        <textarea
          placeholder="اكتب رسالتك هنا..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMessage.trim()}
          className="mr-3 bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full transition disabled:opacity-50"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
