import React from 'react';
import { FiSave, FiXCircle } from 'react-icons/fi';

const FormActions = ({ onCancel, isSaving, hasChanged }) => (
  <div className="flex justify-end gap-4 pt-4 border-t mt-8">
    <button 
      type="button" 
      onClick={onCancel} 
      disabled={isSaving} 
      className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition"
    >
      <FiXCircle />
      <span>إلغاء</span>
    </button>
    <button
      type="submit"
      disabled={!hasChanged || isSaving}
      className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FiSave />
      <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</span>
    </button>
  </div>
);

export default FormActions;
