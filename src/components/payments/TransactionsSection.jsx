// src/components/payments/TransactionsSection.jsx
import React from 'react';
import TransactionItem from './TransactionItem';

const TransactionsSection = ({ transactions }) => (
  <section className="bg-white border border-gray-200 rounded-2xl shadow p-6">
    <h2 className="text-lg font-semibold text-neutral-700 mb-4">سجل المعاملات</h2>
    <div className="space-y-5">
      {transactions.length > 0 ? (
        transactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
      ) : (
        <p className="text-gray-500 text-center py-4">لا توجد معاملات لعرضها.</p>
      )}
    </div>
  </section>
);

export default TransactionsSection;
