// src/services/userService.js
import apiClient from '@/api/axiosConfig';
/**
 * دالة لتحديث بيانات المستخدم، بما في ذلك الصورة الرمزية.
 * @param {string} userId - معرّف المستخدم
 * @param {object} formData - بيانات النموذج النصية
 * @param {File|null} imageFile - ملف الصورة الجديد (إن وجد)
 * @returns {Promise<object>} - بيانات المستخدم المحدثة من الخادم
 */
export const updateUserProfile = async (userId, formData, imageFile) => {
  try {
    let finalAvatarUrl = formData.avatar_url; // ابدأ بالصورة القديمة

    // الخطوة 1: رفع الصورة إذا تم اختيار صورة جديدة
    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append('avatar', imageFile);

      const uploadResponse = await apiClient.post('/upload-avatar', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      finalAvatarUrl = uploadResponse.data.avatar_url; // الحصول على الرابط الجديد
    }

    // الخطوة 2: تجهيز البيانات النهائية للتحديث
    const dataToSend = {
      ...formData,
      name: `${formData.firstname.trim()} ${formData.lastname.trim()}`,
      avatar_url: finalAvatarUrl,
    };

    // الخطوة 3: إرسال طلب PATCH لتحديث بيانات المستخدم
    const updateUserResponse = await apiClient.patch(`/users/${userId}`, dataToSend);
    
    // الخطوة 4: إرجاع بيانات المستخدم المحدثة
    return updateUserResponse.data.user || updateUserResponse.data;

  } catch (error) {
    console.error("Error in updateUserProfile service:", error);
    // إعادة رمي الخطأ للسماح للمكون بمعالجته (مثل عرض رسالة للمستخدم)
    throw error;
  }
};
