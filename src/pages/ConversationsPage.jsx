// src/pages/ConversationsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ConversationList from '../components/conversations/ConversationList';

const ConversationsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [isAuthenticated, navigate, fetchConversations]);

  if (loading) return <LoadingState message="جاري تحميل محادثاتك..." />;
  if (error) return <ErrorState message={error} onRetry={fetchConversations} />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-sky-700">صندوق الوارد</h1>
        </header>
        <main>
          <ConversationList conversations={conversations} currentUserId={user?.id} />
        </main>
      </div>
    </div>
  );
};

export default ConversationsPage;
