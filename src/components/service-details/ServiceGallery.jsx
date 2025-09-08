import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ServiceGallery = ({ mainImage, galleryImages }) => {
  const images = useMemo(() => {
    const allImages = [mainImage, ...(galleryImages || [])].filter(Boolean);
    return allImages.length > 0 ? allImages : ['https://via.placeholder.com/800x450?text=No+Image'];
  }, [mainImage, galleryImages] );

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      className="w-full rounded-2xl shadow-lg mb-8 bg-gray-100"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img src={img} alt={`صورة عرض ${index + 1}`} className="w-full h-auto max-h-[450px] object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServiceGallery;
