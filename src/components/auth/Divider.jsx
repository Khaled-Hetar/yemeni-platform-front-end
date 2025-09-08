import React from 'react';

const Divider = ({ text }) => (
  <div className="flex items-center gap-4 my-6">
    <hr className="flex-grow border-t border-gray-300" />
    <span className="text-gray-500 text-sm">{text}</span>
    <hr className="flex-grow border-t border-gray-300" />
  </div>
);

export default Divider;
