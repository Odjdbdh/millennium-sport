import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import "./light-theme.css";
import "./pro-site.css";
import "./stories.css";
import "./blog/blog.css";

const siteUrl = "https://millenniumsport.ir";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "میلنیوم اسپرت | پخش عمده پوشاک ورزشی", template: "%s | میلنیوم اسپرت" },
  description: "تأمین عمده پوشاک ورزشی زنانه و مردانه با قیمت همکاری، مستقیم از تولیدکننده و ارسال به سراسر ایران.",
  applicationName: "میلنیوم اسپرت",
  keywords: ["پخش عمده پوشاک ورزشی", "تولیدی لباس ورزشی", "خرید عمده لباس ورزشی", "میلنیوم اسپرت"],
  authors: [{ name: "گروه تولیدی میلنیوم اسپرت" }],
  creator: "گروه تولیدی میلنیوم اسپرت",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: siteUrl,
    siteName: "میلنیوم اسپرت",
    title: "میلنیوم اسپرت | تولید و پخش عمده پوشاک ورزشی",
    description: "تأمین عمده پوشاک ورزشی برای فروشگاه‌ها و پخش‌کننده‌ها در سراسر ایران.",
    images: [{ url: "/images/millennium-logo-social.webp", width: 1200, height: 1200, alt: "نشان میلنیوم اسپرت" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/millennium-logo-social.webp"] },
  icons: { icon: "/images/millennium-logo-icon.png", apple: "/images/millennium-logo-icon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

const organizationData = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "ClothingStore"],
  name: "گروه تولیدی میلنیوم اسپرت",
  alternateName: "Millennium Sport",
  url: siteUrl,
  logo: `${siteUrl}/images/millennium-logo-social.webp`,
  description: "تولید و پخش عمده پوشاک ورزشی برای همکاران سراسر ایران.",
  telephone: "+989120935534",
  foundingDate: "2000",
  sameAs: ["https://t.me/Millenniumsport", "https://instagram.com/mill_spo0rt"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "پایین‌تر از میدان جمهوری، جنب متروی نواب، مرکز خرید گردون، طبقه همکف، پلاک ۱۲۲",
    addressLocality: "تهران",
    addressCountry: "IR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 35.6942822, longitude: 51.3792333 },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
