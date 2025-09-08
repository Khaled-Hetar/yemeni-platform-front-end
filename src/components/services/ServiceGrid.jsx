import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';
import ServiceCard from './ServiceCard';
import LoadingState from '../LoadingState'; // افترضيًا موجود
import ErrorState from '../ErrorState';     // افترضيًا موجود

const ServiceGrid = ({ loading, error, services, onResetFilters }) => {
  if (loading) {
    return <LoadingState message="جاري تحميل الخدمات..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (services.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-16 flex flex-col items-center">
        <FiInbox size={48} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">لا توجد خدمات تطابق بحثك</h3>
        <p className="text-gray-500 mt-2 mb-4">حاول تغيير كلمات البحث أو الفئة.</p>
        <button onClick={onResetFilters} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">
          إعادة تعيين الفلاتر
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {services.map(service => (
          <motion.div
            key={service.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ServiceGrid;
