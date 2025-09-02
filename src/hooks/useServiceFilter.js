import { useState, useMemo, useEffect } from 'react';
import { services as initialServices } from '../data/services';

// Debounce function
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Custom Hook
export function useServiceFilter() {
  const [draft, setDraft] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(() => localStorage.getItem('serviceCategory') || 'الكل');
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('serviceSortBy') || 'latest');

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  useEffect(() => {
    const storedDraft = localStorage.getItem("draftService");
    if (storedDraft) {
      setDraft({ ...JSON.parse(storedDraft), isDraft: true });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('serviceCategory', activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    localStorage.setItem('serviceSortBy', sortBy);
  }, [sortBy]);

  const categories = ["الكل", ...new Set(initialServices.map(s => s.category))];

  const filteredAndSortedServices = useMemo(() => {
    const activeServices = initialServices.filter(s => !s.isDraft);
    let allServices = draft ? [draft, ...activeServices] : activeServices;

    // Filtering
    if (debouncedSearchTerm || activeCategory !== 'الكل') {
      allServices = allServices.filter(service => {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesCategory = activeCategory === 'الكل' || service.category === activeCategory;
        const matchesSearch = !debouncedSearchTerm || (
          service.title.toLowerCase().includes(searchLower) ||
          (service.description && service.description.toLowerCase().includes(searchLower)) ||
          (service.tags && service.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
        return matchesCategory && matchesSearch;
      });
    }

    // Sorting
    allServices.sort((a, b) => {
      if (sortBy === 'rating') {
        const ratingA = a.ratings ? a.ratings.reduce((x, y) => x + y, 0) / a.ratings.length : 0;
        const ratingB = b.ratings ? b.ratings.reduce((x, y) => x + y, 0) / b.ratings.length : 0;
        return ratingB - ratingA;
      }
      // 'latest' is default
      return b.id - a.id;
    });

    return allServices;
  }, [debouncedSearchTerm, activeCategory, sortBy, draft]);

  const deleteDraft = () => {
    localStorage.removeItem("draftService");
    setDraft(null);
  };

  const resetFilters = () => {
    setActiveCategory("الكل");
    setSearchTerm("");
    setSortBy("latest");
  };

  return {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    categories,
    filteredAndSortedServices,
    deleteDraft,
    resetFilters
  };
}