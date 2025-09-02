import React, { useState } from "react";
import axios from "axios";

const IdentityVerification = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("يرجى اختيار ملف الهوية");

    const formData = new FormData();
    formData.append("identity_file", file);

    try {
      setUploading(true);
      const response = await axios.post("/api/user/verify-id", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("تم رفع مستند الهوية بنجاح، سيتم التحقق منه قريباً");
    } catch (error) {
      alert("حدث خطأ أثناء رفع مستند الهوية");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow max-w-md mx-auto">
      <h2 className="mb-4 text-cyan-700 font-bold text-xl">توثيق الهوية</h2>
      <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
      <button
        type="submit"
        disabled={uploading}
        className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded"
      >
        {uploading ? "جارٍ الرفع..." : "رفع المستند"}
      </button>
    </form>
  );
};

export default IdentityVerification;