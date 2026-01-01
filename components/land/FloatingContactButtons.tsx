'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingContactButtons = () => {
  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] flex justify-between items-end pointer-events-none">
      {/* WhatsApp Button - Start (Right in RTL) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="pointer-events-auto relative group"
      >
        <a
          href="https://wa.me/966534309221"
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-[#25D366]/40 flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-1"
          aria-label="تواصل عبر الواتساب"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none">
          واتساب
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
        </span>
      </motion.div>

      {/* Phone Button - End (Left in RTL) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="pointer-events-auto relative group"
      >
        <span className="absolute inset-0 rounded-full bg-[#0d9488] animate-ping opacity-20 duration-1000"></span>
        <a
          href="tel:+966534309221"
          className="relative bg-[#0d9488] hover:bg-[#0f766e] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-[#0d9488]/40 flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-1"
          aria-label="اتصل الآن"
        >
          <Phone className="w-7 h-7 animate-pulse" />
        </a>
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none">
          اتصل الآن
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
        </span>
      </motion.div>
    </div>
  );
};

export default FloatingContactButtons;