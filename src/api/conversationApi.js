import apiClient from './axiosConfig';

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
    if (conversation && conversation.id) {
      navigate(`/chat/${conversation.id}`);
    } else {
      throw new Error("الخادم لم يرجع محادثة صالحة.");
    }
  } catch (error) {
    console.error("فشل في العثور على محادثة أو إنشائها:", error);
    const message = error.response?.data?.message || "حدث خطأ أثناء محاولة بدء المحادثة.";
    alert(message);
  }
};
