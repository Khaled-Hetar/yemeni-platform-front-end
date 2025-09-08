import React from 'react';
import { FiCamera } from 'react-icons/fi';

const ProfileImageUploader = ({ preview, onImageChange }) => (
  <div className="flex flex-col items-center mb-8">
    <div className="relative group">
      <img
        src={preview || 'https://via.placeholder.com/150?text=Avatar'}
        alt="معاينة"
        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
      />
      <label
        htmlFor="image-upload"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FiCamera className="text-white text-3xl" />
      </label>
    </div>
    <input
      type="file"
      id="image-upload"
      name="image-upload"
      accept="image/*"
      onChange={onImageChange}
      className="hidden"
    />
    <p className="text-sm text-gray-500 mt-2">انقر على الصورة لتغييرها</p>
  </div>
 );

export default ProfileImageUploader;
