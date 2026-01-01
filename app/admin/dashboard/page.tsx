'use client';

import { useState, useEffect, Suspense } from 'react';

function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full animate-spin" />
                <div className="text-xl">جاري التحميل...</div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [DashboardComponent, setDashboardComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        // Dynamic import only happens on client side
        import('./DashboardContent').then((mod) => {
            setDashboardComponent(() => mod.default);
        });
    }, []);

    if (!DashboardComponent) {
        return <LoadingSpinner />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DashboardComponent />
        </Suspense>
    );
}
