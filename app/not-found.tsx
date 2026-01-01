'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
            <h1 className="text-6xl md:text-8xl font-bold text-[#FFDD00] mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">الصفحة غير موجودة</h2>
            <p className="text-white/70 text-center mb-8 max-w-md">
                عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </p>
            <Link
                href="/"
                className="inline-block bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFDD00]/30"
            >
                العودة للرئيسية
            </Link>
        </div>
    );
}
