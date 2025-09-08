// src/components/services/ServiceFilters.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const ServiceFilters = ({
  searchTerm,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="mb-10 space-y-6">
      <div className="relative">
        <FiSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="ابحث بالعنوان..."
          className="w-full pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={onSortChange}
            className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="latest">الأحدث</option>
            <option value="rating">الأعلى تقييمًا</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ServiceFilters;
