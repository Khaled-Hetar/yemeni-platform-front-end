import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export const findOrCreateConversation = async (otherUserId, navigate) => {
  if (!otherUserId) {
    console.error("المستخدم الآخر غير محدد.");
    alert("حدث خطأ، لا يمكن بدء المحادثة.");
    return;
  }

  try {
    const response = await apiClient.post('/conversations/find-or-create', {
    other_user_id: otherUserId,
  });

    const conversation = response.data;
    console.log("تم العثور على محادثة أو إنشاؤها:", conversation);
    navigate(`/chat/${conversation.id}`);

  } catch (error) {
    console.error("فشل في العثور على محادثة أو إنشائها:", error);
    const message = error.response?.data?.message || "حدث خطأ أثناء محاولة بدء المحادثة.";
    alert(message);
  }
};

const ConversationsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/user/conversations');
        setConversations(response.data);
      } catch (err) {
        setError("فشل في تحميل المحادثات.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div className="p-8 text-center">جاري تحميل محادثاتك...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-sky-700 mb-6">صندوق الوارد</h1>
      
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        {conversations.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {conversations.map((convo) => {
              const otherUser = convo.participants?.find(p => p.id !== user.id);
              if (!otherUser) return null;

              return (
                <li key={convo.id}>
                  <Link 
                    to={`/chat/${convo.id}`} 
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
                        {convo.last_message?.createdAt && (
                          <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {new Date(convo.last_message.createdAt).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {convo.last_message?.body || 'لا توجد رسائل بعد'}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>لا توجد لديك أي محادثات حتى الآن.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
