import React, { useMemo } from 'react';
import kuraimiBankImg from '../../assets/image/money/KuraimiBank.png';
import oneCashImg from '../../assets/image/money/ONECash.png';
import jawalyImg from '../../assets/image/money/jawaly.png';
import FooterSection from './FooterSection';
import PaymentMethods from './PaymentMethods';

const Footer = () => {
  const footerData = useMemo(() => ({
    sections: [
      {
        title: 'المساعدة والدعم',
        items: [
          { text: 'مركز المساعدة', link: '/help-center' },
          { text: 'الأسئلة الشائعة', link: '/faq' },
          { text: 'تواصل معنا', link: '/contact' }
        ]
      },
      {
        title: 'المنصة اليمنية',
        items: [
          { text: 'شروط الخدمة', link: '/terms' },
          { text: 'الخصوصية', link: '/privacy' },
          { text: 'عن المنصة اليمنية', link: '/about' },
          { text: 'كيف يضمن المنصة اليمنية حقوقك؟', link: '/guarantee' },
          { text: 'التسويق بالعمولة', link: '/affiliate' },
          { text: 'ملتقى المنصة اليمنية', link: '/forum' },
          { text: 'مستويات المستخدمين', link: '/levels' }
        ]
      },
      {
        title: 'مدونة المنصة اليمنية',
        items: [
          { text: 'كيف تبيع أول خدمة على منصة المنصة اليمنية؟ (8 نصائح مهمة)', link: '/blog/sell-first-service' },
          { text: 'لماذا منصة المنصة اليمنية هي الاختيار الأمثل للمستقلين؟', link: '/blog/why-us' },
          { text: 'الخدمات الصغيرة المفصلة لرواد الأعمال', link: '/blog/micro-services' },
          { text: '7 أساطير خاطئة عن العمل عبر الإنترنت', link: '/blog/myths' }
        ]
      },
    ],
    paymentMethods: [
      { name: 'بنك الكريمي', link: 'https://kuraimibank.com', image: kuraimiBankImg },
      { name: 'ون كاش', link: 'https://onecasyemen.com', image: oneCashImg },
      { name: 'جوالي', link: 'https://jawalycash.com', image: jawalyImg },
    ]
  } ), []);

  return (
    // التحسين الهيكلي: استخدام footer بدلاً من div
    <footer className="w-full mt-24 bg-neutral-100 text-neutral-700 px-4">
      <div className="grid grid-cols-2 mx-auto max-w-[1240px] border-b border-sky-200 py-8 gap-6 md:grid-cols-4">
        {footerData.sections.map((section, index) => (
          <FooterSection key={index} title={section.title} items={section.items} />
        ))}
        <div className="space-y-6">
          <PaymentMethods title="وسائل الدفع" methods={footerData.paymentMethods} />
          <PaymentMethods title="وسائل السحب" methods={footerData.paymentMethods} />
        </div>
      </div>
      <div className="flex items-center justify-center px-2 py-4 mx-auto text-center text-gray-500 sm:flex-row">
        <p className="font-bold">
          جميع الحقوق محفوظة © المنصة اليمنية {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
