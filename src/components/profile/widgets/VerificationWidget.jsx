import React from 'react';
import { Link } from 'react-router-dom';
import { FaMobileAlt } from "react-icons/fa";
import { HiOutlineIdentification } from "react-icons/hi";
import { BsShieldLock } from "react-icons/bs";

const VerificationItem = ({ label, isVerified, linkTo, icon, isOwner }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="font-semibold text-neutral-700">{label}</p>
        <p className={`text-sm ${isVerified ? 'text-green-600' : 'text-neutral-500'}`}>
          {isVerified ? 'موثّق' : 'لم يتم التوثيق بعد'}
        </p>
      </div>
    </div>
    {!isVerified && isOwner && (
      <Link to={linkTo} className="text-cyan-600 text-sm hover:underline">توثيق الآن</Link>
    )}
  </div>
);

const VerificationWidget = ({ verifications, isOwner }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border">
    <div className="flex items-center gap-2 mb-4 border-b pb-2">
      <BsShieldLock className="text-cyan-600 text-xl" />
      <h3 className="text-lg font-semibold text-cyan-700">توثيق الحساب</h3>
    </div>
    <div className="space-y-4">
      <VerificationItem 
        label="الهاتف المحمول"
        isVerified={verifications.phone_verified}
        linkTo="/verify/phone"
        icon={<FaMobileAlt className="text-2xl text-neutral-600" />}
        isOwner={isOwner}
      />
      <VerificationItem 
        label="الهوية"
        isVerified={verifications.identity_verified}
        linkTo="/verify/identity"
        icon={<HiOutlineIdentification className="text-2xl text-neutral-600" />}
        isOwner={isOwner}
      />
    </div>
  </div>
);

export default VerificationWidget;
