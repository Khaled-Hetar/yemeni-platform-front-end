// src/pages/ServicesPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/axiosConfig';

// استيراد المكونات
import ServiceCard from '../components/services/ServiceCard';
import ServiceFilters from '../components/services/ServiceFilters';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/conversations/EmptyState';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState("latest");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/services?_expand=user');
      setServices(response.data || []);
    } catch (err) {
      setError("حدث خطأ أثناء جلب الخدمات. يرجى التأكد من أن الخادم يعمل.");
      console.error("فشل جلب الخدمات:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredAndSortedServices = useMemo(() => {
    return services
      .filter(service => {
        const matchesCategory = activeCategory === "الكل" || service.category?.name === activeCategory;
        const matchesSearch = !searchTerm || service.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating': { // استخدام الأقواس المعقوفة لحل مشكلة النطاق
            const ratingA = a.average_rating || 0;
            const ratingB = b.average_rating || 0;
            return ratingB - ratingA;
          }
          case 'price_asc':
            return (a.price || 0) - (b.price || 0);
          case 'price_desc':
            return (b.price || 0) - (a.price || 0);
          case 'latest':
          default:
            return (b.id || 0) - (a.id || 0);
        }
      });
  }, [services, searchTerm, activeCategory, sortBy]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(services.map(s => s.category?.name).filter(Boolean));
    return ["الكل", ...uniqueCategories];
  }, [services]);

  if (loading) return <LoadingState message="جاري تحميل الخدمات..." />;
  if (error) return <ErrorState message={error} onRetry={fetchServices} />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">اكتشف الخدمات الإبداعية</h1>
            <p className="mt-3 max-w-2xl mx-auto text-md text-gray-500">ابحث عن الخدمة المثالية لمشروعك القادم.</p>
          </div>

          <ServiceFilters
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortBy={sortBy}
            onSortChange={(e) => setSortBy(e.target.value)}
          />
        </motion.div>

        <div className="mb-4 text-sm text-gray-600">
          <strong>{filteredAndSortedServices.length}</strong> خدمة متاحة
        </div>
        
        <div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredAndSortedServices.length > 0 ? (
              filteredAndSortedServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full"
              >
                <EmptyState
                  message="لا توجد خدمات تطابق بحثك"
                  actionText="إعادة تعيين الفلاتر"
                  onAction={() => {
                    setSearchTerm('');
                    setActiveCategory('الكل');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
