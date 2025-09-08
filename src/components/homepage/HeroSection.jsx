// src/components/homepage/HeroSection.jsx
import React from 'react';
import heroImage from '../../assets/image/new/hello.svg'; // استيراد الصورة

const HeroSection = () => (
  <section className="bg-cyan-800 text-white py-20 px-6 md:px-20">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
      <div className="md:w-1/2 space-y-6 text-center md:text-right">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
          أهلاً بك في{" "}
          <span className="text-orange-400 block mt-2">المنصة اليمنية</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-lg mx-auto md:mx-0 drop-shadow-sm">
          أنجز مشاريعك باحترافية عبر الإنترنت مع نخبة من أفضل المستقلين في الوطن العربي، بكل سهولة وأمان.
        </p>
      </div>
      <div className="md:w-1/2 max-w-lg">
        <img
          src={heroImage}
          alt="شخص يعمل على حاسوبه المحمول في مساحة عمل مريحة"
          className="w-full rounded-xl shadow-2xl"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
