import apiClient from './axiosConfig';

/**
 * @param {string} currentUserId
 * @param {string} otherUserId
 * @returns {Promise<object|null>}
 */
export const findOrCreateConversation = async (currentUserId, otherUserId) => {
  if (!currentUserId || !otherUserId) {
    console.error("IDs are required to find or create a conversation.");
    return null;
  }

  try {
    const response = await apiClient.get('/conversations');
    const conversations = response.data;

    const existingConversation = conversations.find(convo =>
      convo.participants &&
      convo.participants.some(p => p.id === currentUserId) &&
      convo.participants.some(p => p.id === otherUserId)
    );

    if (existingConversation) {
      return existingConversation;
    }

    const [currentUserRes, otherUserRes] = await Promise.all([
      apiClient.get(`/users/${currentUserId}`),
      apiClient.get(`/users/${otherUserId}`)
    ]);

    const newConversationData = {
      participants: [currentUserRes.data, otherUserRes.data],
      createdAt: new Date().toISOString(),
      last_message: null
    };

    const createResponse = await apiClient.post('/conversations', newConversationData);
    return createResponse.data;

  } catch (error) {
    console.error("Error in findOrCreateConversation:", error);
    return null;
  }
};
