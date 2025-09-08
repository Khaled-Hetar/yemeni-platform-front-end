import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { FiPhone, FiBriefcase, FiLayers } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";
import { BsClipboardCheck } from "react-icons/bs";

const CompletionStep = ({ text, completed, icon, linkTo, isOwner }) => {
  const content = (
    <div className={`flex items-center gap-3 transition ${completed ? 'text-gray-400' : 'text-neutral-700'} ${!completed && isOwner ? 'hover:text-cyan-600 cursor-pointer' : ''}`}>
      <span className="flex-shrink-0">{completed ? <FaCheckCircle className="text-green-500 text-xl" /> : icon}</span>
      <span className={`text-base ${completed ? 'line-through' : ''}`}>{text}</span>
    </div>
  );
  if (!completed && isOwner) return <Link to={linkTo}>{content}</Link>;
  return content;
};

const CompletionWidget = ({ profile, servicesCount, projectsCount, isOwner }) => {
  const completionSteps = useMemo(() => [
    { text: "التحقق من رقم الهاتف", completed: profile.verifications?.phone_verified || false, icon: <FiPhone className="text-cyan-600 text-xl" />, linkTo: "/verify/phone" },
    { text: "توثيق الهوية", completed: profile.verifications?.identity_verified || false, icon: <HiOutlineIdentification className="text-cyan-600 text-xl" />, linkTo: "/verify/identity" },
    { text: "أضف مهاراتك", completed: (profile.skills?.length || 0) > 0, icon: <FaStar className="text-cyan-600 text-xl" />, linkTo: "/edit-profile" },
    { text: "أضف أعمال لمعرضك", completed: projectsCount > 0, icon: <FiBriefcase className="text-cyan-600 text-xl" />, linkTo: "/projects/new" },
    { text: "أضف أول خدمة لك", completed: servicesCount > 0, icon: <FiLayers className="text-cyan-600 text-xl" />, linkTo: "/add-service" },
  ], [profile, servicesCount, projectsCount]);

  const completedCount = completionSteps.filter(step => step.completed).length;
  const completionPercentage = Math.round((completedCount / completionSteps.length) * 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <BsClipboardCheck className="text-cyan-600 text-xl" />
        <h2 className="text-cyan-700 text-lg font-semibold">إكمال الملف الشخصي</h2>
      </div>
      <div className="my-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-gray-700">نسبة الاكتمال</span>
          <span className="text-sm font-bold text-cyan-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
        {completionSteps.map((step, index) => (
          <li key={index}><CompletionStep {...step} isOwner={isOwner} /></li>
        ))}
      </ul>
    </div>
  );
};

export default CompletionWidget;
