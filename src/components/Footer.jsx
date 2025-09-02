import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
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
      { text: 'مستويات المستخدمين', link: '/levels' },
    ]
  },
  {
    title: 'مدونة المنصة اليمنية',
    items: [
      { text: 'كيف تبيع أول خدمة على منصة المنصة اليمنية؟ (8 نصائح مهمة)', link: '/blog/sell-first-service' },
      { text: 'لماذا منصة المنصة اليمنية هي الاختيار الأمثل للمستقلين؟', link: '/blog/why-us' },
      { text: 'الخدمات الصغيرة المفصلة لرواد الأعمال', link: '/blog/micro-services' },
      { text: '7 أساطير خاطئة عن العمل عبر الإنترنت', link: '/blog/myths' },
    ]
  }
];

const Footer = () => {
  return (
    <div className="w-full mt-24 bg-neutral-100 text-neutral-700 px-4">
      <div className="grid grid-cols-2 mx-auto max-w-[1240px] border-b border-sky-200 py-8 gap-6 md:grid-cols-4">
        {sections.map((section, index) => (
          <div key={index}>
            <h6 className="text-cyan-600 text-xl font-bold pt-2 pb-2">{section.title}</h6>
            <ul>
              {section.items.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.link}
                    className="block py-1 text-neutral-600 hover:text-cyan-600 transition cursor-pointer"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-cyan-600 text-lg mb-3 font-semibold">وسائل الدفع</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            <a href="https://kuraimibank.com" target="_blank" rel="noopener noreferrer">
              <img src="src\assets\image\money\KuraimiBank.png" alt="بنك الكريمي" title='بنك الكريمي' className="w-10 h-10 object-contain" />
            </a>
            <a href="https://onecasyemen.com" target="_blank" rel="noopener noreferrer">
              <img src="src\assets\image\money\ONECash.png" alt="ون كاش" title='One كاش' className="w-10 h-10 object-contain" />
            </a>
            <a href="https://jawalycash.com" target="_blank" rel="noopener noreferrer">
              <img src="src\assets\image\money\jawaly.png" alt="جوالي" title='جوالي' className="w-10 h-10 object-contain" />
            </a>
          </div>

          <h3 className="text-cyan-600 text-lg mb-3 font-semibold">وسائل السحب</h3>
          <div className="flex flex-wrap gap-3">
            <a href="https://kuraimibank.com" target="_blank" rel="noopener noreferrer">
              <img src="src\assets\image\money\KuraimiBank.png" alt="بنك الكريمي" title='بنك الكريمي' className="w-10 h-10 object-contain" />
            </a>
            <a href="https://onecasyemen.com" target="_blank" rel="noopener noreferrer">
              <img src="src\assets\image\money\ONECash.png" alt="ون كاش" title='One كاش' className="w-10 h-10 object-contain" />
            </a>
            <a href="https://jawalycash.com" target="_blank" rel="noopener noreferrer">
              <img src="src\assets\image\money\jawaly.png" alt="جوالي" title='جوالي' className="w-10 h-10 object-contain" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center px-2 py-4 mx-auto text-center text-gray-500 sm:flex-row">
        <p className="font-bold">
          جميع الحقوق محفوظة © المنصة اليمنية {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;