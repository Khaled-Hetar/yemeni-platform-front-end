import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const TransactionItem = ({ transaction: tx }) => {
  const isDeposit = tx.type === "deposit";
  const iconBgClass = isDeposit ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  const amountClass = isDeposit ? "text-green-600" : "text-red-600";
  const amountSign = isDeposit ? "+" : "-";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full mt-1 ${iconBgClass}`}>
          {isDeposit ? <FaArrowDown /> : <FaArrowUp />}
        </div>
        <div>
          <p className="text-neutral-700 font-medium">{tx.description}</p>
          <p className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleDateString('ar-EG')}</p>
          {tx.service_id && (
            <p className="text-sm mt-1 text-neutral-600">
              <span className="font-semibold">الخدمة ID:</span>{" "}
              <Link to={`/services/${tx.service_id}`} className="text-sky-600 hover:underline">
                {tx.service_id}
              </Link>
            </p>
          )}
        </div>
      </div>
      <div className={`font-semibold text-lg ${amountClass}`}>
        {amountSign}${Number(tx.amount).toFixed(2)}
      </div>
    </div>
  );
};

export default TransactionItem;
