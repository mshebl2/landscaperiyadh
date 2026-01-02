import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/land/Header";
import Footer from "@/components/land/Footer";
import FloatingContactButtons from "@/components/land/FloatingContactButtons";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "لاندسكيب ماسترز بالرياض | تنسيق حدائق بالرياض وتصميم حدائق فاخرة – خصم 30%",
    template: "%s | لاندسكيب ماسترز بالرياض",
  },
  description:
    "لاندسكيب ماسترز بالرياض – الشركة الأولى في تصميم وتنسيق الحدائق بالرياض. نقدم تنسيق حدائق فاخرة ومنزلية بالرياض، تركيب عشب صناعي بالرياض، جلسات خارجية وغرف زجاجية بالرياض، شلالات ونوافير بالرياض، بديل الخشب بالرياض، تكسيات جدارية بالرياض، ديكور حدائق حديث بالرياض، أحواض ديكور وزراعة طبيعية وصناعية بالرياض. خصم 30% على جميع الخدمات.",
  keywords: [
    "تنسيق حدائق بالرياض",
    "تصميم حدائق بالرياض",
    "شركة تنسيق حدائق بالرياض",
    "شركة تصميم حدائق بالرياض",
    "افضل شركة حدائق بالرياض",
    "شركات تصميم حدائق بالرياض",
    "تنسيق حدائق فاخرة بالرياض",
    "تنسيق حدائق منزلية بالرياض",
    "تصميم حدائق منزلية بالرياض",
    "جلسات خارجية بالرياض",
    "جلسات حدائق بالرياض",
    "جلسات خشب بالرياض",
    "تركيب جلسات خارجية بالرياض",
    "غرف زجاجية بالرياض",
    "غرف ألمنيوم بالرياض",
    "غرف خارجية بالرياض",
    "عشب صناعي بالرياض",
    "تركيب عشب صناعي بالرياض",
    "عشب جداري بالرياض",
    "عشب جداري خارجي بالرياض",
    "أحواض ديكور بالرياض",
    "ديكور حدائق بالرياض",
    "تنسيق ديكور حدائق بالرياض",
    "شلالات بالرياض",
    "شلالات ثابتة بالرياض",
    "شلالات فايبر جلاس بالرياض",
    "نوافير بالرياض",
    "مجرى مائي بالرياض",
    "ديكور مائي بالرياض",
    "بديل الخشب بالرياض",
    "بديل خشب خارجي بالرياض",
    "بديل خشب داخلي بالرياض",
    "بديل خشب للواجهات بالرياض",
    "بديل خشب للجدران بالرياض",
    "تكسيات جدارية بالرياض",
    "ديكور تحت الدرج بالرياض",
    "زراعة طبيعية بالرياض",
    "زراعة صناعية بالرياض",
    "تنسيق مسطحات خضراء بالرياض",
    "أحجار الديكور بالرياض",
    "ارضيات خارجية بالرياض",
    "باركيه خارجي بالرياض",
    "تصميم حدائق فلل بالرياض",
    "تنسيق فلل بالرياض",
    "تنسيق حدائق حديثة بالرياض",
    "تنسيق حدائق راقية بالرياض",
    "تنسيق حدائق مودرن بالرياض",
    "تركيب شبكات ري بالرياض",
    "كافة خدمات الحدائق بالرياض"
  ],
  authors: [{ name: "لاندسكيب ماسترز بالرياض" }],
  openGraph: {
    title: "لاندسكيب ماسترز بالرياض | أفضل شركة تنسيق حدائق بالرياض – خصم 30%",
    description:
      "تصميم وتنسيق حدائق بالرياض — جلسات خارجية، عشب صناعي، غرف زجاجية، شلالات ونوافير، بديل الخشب، تكسيات جدارية، ديكور حدائق فاخرة بالرياض. خصم 30% الآن!",
    url: SITE_URL,
    siteName: "لاندسكيب ماسترز بالرياض",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "لاندسكيب ماسترز بالرياض | تخصص تصميم وتنسيق حدائق – خصم 30%",
    description:
      "تنسيق حدائق بالرياض | تصميم حدائق | عشب صناعي | جلسات خارجية | شلالات وديكور حدائق بالرياض. خصم 30%.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "لاندسكيب ماسترز بالرياض",
              url: SITE_URL,
              telephone: "+966534309221",
              address: {
                "@type": "PostalAddress",
                addressCountry: "SA",
                addressRegion: "Riyadh",
                addressLocality: "Riyadh"
              },
              areaServed: ["Riyadh"],
              openingHours: "Mo-Su 00:00-23:59",
            }),
          }}
        />
      </head>
      <body className="antialiased font-['Cairo'] bg-white text-gray-900">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G2GS5KT3R3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G2GS5KT3R3');
          `}
        </Script>

        <LanguageProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <FloatingContactButtons />
        </LanguageProvider>
      </body>
    </html>
  );
}
