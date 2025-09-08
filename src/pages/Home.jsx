import React from "react";
import HeroSection from '../components/homepage/HeroSection';
import HowItWorksSection from '../components/homepage/HowItWorksSection';
import WhyUsSection from '../components/homepage/WhyUsSection';
import CategoriesSection from '../components/homepage/CategoriesSection';
import CallToActionSection from '../components/homepage/CallToActionSection';

const HomePage = () => {
  return (
    <main className="bg-white font-sans text-gray-800 leading-relaxed mt-22">
      <HeroSection />
      <HowItWorksSection />
      <WhyUsSection />
      <CategoriesSection />
      <CallToActionSection />
    </main>
  );
};

export default HomePage;
