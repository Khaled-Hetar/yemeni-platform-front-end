import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiInbox, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ServiceCard from "../components/ServiceCard";
import apiClient from '../api/axiosConfig';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/services?with=user');

      setServices(response.data);
      
      } catch (err) {
      setError("حدث خطأ أثناء جلب الخدمات. يرجى المحاولة مرة أخرى.");
      console.error("فشل جلب الخدمات:", err);
    } finally {
      setLoading(false);
    }
  };

    fetchServices();
  }, []);

  const filteredAndSortedServices = useMemo(() => {
    return services
      .filter(service => {
        if (activeCategory !== "الكل" && service.category?.name !== activeCategory) {
          return false;
        }
        if (searchTerm && !service.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          const ratingA = a.reviews?.reduce((acc, r) => acc + r.rating, 0) / (a.reviews?.length || 1);
          const ratingB = b.reviews?.reduce((acc, r) => acc + r.rating, 0) / (b.reviews?.length || 1);
          return ratingB - ratingA;
        }
        return b.id - a.id;
      });
  }, [services, searchTerm, activeCategory, sortBy]);

  const categories = useMemo(() => ["الكل", ...new Set(services.map(s => s.category?.name).filter(Boolean))], [services]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="animate-spin text-cyan-600 text-4xl" />
        <p className="mt-4 text-gray-600">جاري تحميل الخدمات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FiAlertTriangle className="text-red-500 text-4xl" />
        <p className="mt-4 text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">اكتشف الخدمات الإبداعية</h1>
            <p className="mt-3 max-w-2xl mx-auto text-md text-gray-500">ابحث عن الخدمة المثالية لمشروعك القادم.</p>
          </div>

          <div className="mb-10 space-y-6">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="ابحث بالعنوان..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 
                  rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center flex-wrap gap-2">
                {categories.map(category => (
                  <button key={category} onClick={() => setActiveCategory(category)} 
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 
                      ${activeCategory === category ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-2 pr-8 
                    text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="latest">الأحدث</option>
                  <option value="rating">الأعلى تقييمًا</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-4 text-sm text-gray-600">
          <strong>{filteredAndSortedServices.length}</strong> خدمة متاحة
        </div>
        
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredAndSortedServices.length > 0 ? (
              filteredAndSortedServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="col-span-full text-center py-16 flex flex-col items-center">
                  <FiInbox size={48} className="text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600">لا توجد خدمات تطابق بحثك</h3>
                  <p className="text-gray-500 mt-2 mb-4">حاول تغيير كلمات البحث أو الفئة.</p>
                  <button onClick={() => { setSearchTerm(''); setActiveCategory('الكل'); }}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">
                    إعادة تعيين الفلاتر
                  </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;
