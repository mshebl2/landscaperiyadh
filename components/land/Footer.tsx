import React from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Facebook,
  Instagram,
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'من نحن', href: '/about' },
    { name: 'خدماتنا', href: '/services' },
    { name: 'معرض الأعمال', href: '/portfolio' },
    { name: 'المدونة', href: '/blog' },
    { name: 'تواصل معنا', href: '/contact' }
  ];

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img
                src="/logo-landscape-masters.png copy.jpg"
                alt="لاندسكيب ماسترز بالرياض"
                className="h-10 w-auto ml-3 opacity-90 hover:opacity-100 transition-opacity"
              />
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">لاندسكيب ماسترز بالرياض</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed font-light">
              شركة رائدة في تصميم وتنسيق الحدائق في المملكة العربية السعودية،
              نحول أحلامك إلى حدائق خضراء مبهرة بأعلى معايير الجودة والإبداع.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="https://www.facebook.com/profile.php?id=100081155241953"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-[#1877F2] p-2.5 rounded-full transition-all duration-300 text-gray-400 hover:text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/landscape_masters_riyadh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-[#E4405F] p-2.5 rounded-full transition-all duration-300 text-gray-400 hover:text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-100 border-b border-gray-800 pb-2 inline-block">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#0d9488] transition-all duration-200 hover:translate-x-[-4px] inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-100 border-b border-gray-800 pb-2 inline-block">معلومات التواصل</h4>
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-lg ml-3 group-hover:bg-[#0d9488]/20 transition-colors">
                  <Phone className="w-5 h-5 text-[#0d9488] flex-shrink-0" />
                </div>
                <a href="tel:+966534309221" className="text-gray-400 hover:text-white transition-colors duration-200" dir="ltr">
                  +966 53 430 9221
                </a>
              </div>

              <div className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-lg ml-3 group-hover:bg-[#0d9488]/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#0d9488] flex-shrink-0" />
                </div>
                <a href="https://wa.me/966534309221" className="text-gray-400 hover:text-white transition-colors duration-200">
                  واتساب
                </a>
              </div>

              <div className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-lg ml-3 group-hover:bg-[#0d9488]/20 transition-colors">
                  <Mail className="w-5 h-5 text-[#0d9488] flex-shrink-0" />
                </div>
                <a href="mailto:shazash09@gmail.com" className="text-gray-400 hover:text-white transition-colors duration-200" dir="ltr">
                  shazash09@gmail.com
                </a>
              </div>

              <div className="flex items-start group">
                <div className="bg-gray-800 p-2 rounded-lg ml-3 group-hover:bg-[#0d9488]/20 transition-colors mt-1">
                  <MapPin className="w-5 h-5 text-[#0d9488] flex-shrink-0" />
                </div>
                <span className="text-gray-400 mt-2">
                  الرياض، المملكة العربية السعودية
                </span>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="mt-8 space-y-3">
              <a
                href="tel:+966534309221"
                className="block bg-[#0d9488] hover:bg-[#0f766e] text-white text-center py-3 px-4 rounded-xl transition-all duration-200 text-sm font-bold shadow-lg hover:shadow-teal-900/50 hover:-translate-y-0.5"
              >
                اتصل الآن
              </a>
              <a
                href="https://wa.me/966534309221"
                className="block bg-gray-800 hover:bg-gray-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-200 text-sm font-bold border border-gray-700 hover:border-gray-600"
              >
                واتساب
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-right">
              جميع الحقوق محفوظة لدى لاندسكيب ماسترز بالرياض © 2025.
            </p>
            <div className="flex space-x-6 space-x-reverse text-sm">
              <a href="#" className="text-gray-500 hover:text-[#0d9488] transition-colors duration-200">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-gray-500 hover:text-[#0d9488] transition-colors duration-200">
                شروط الاستخدام
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-xs">
              تم التصميم والأرشفة بواسطة
              <a
                href="https://wa.me/966541430116/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0d9488] hover:underline mx-1 font-medium"
              >
                مؤسسة رواد الرقمية
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
