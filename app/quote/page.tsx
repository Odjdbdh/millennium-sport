import type { Metadata } from "next";
import Icon from "../components/Icon";
import QuoteForm from "../components/QuoteForm";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "درخواست پیش‌فاکتور عمده",
  description: "نیاز خرید عمده پوشاک ورزشی خود را ثبت و متن آماده درخواست را برای واحد فروش میلنیوم اسپرت ارسال کنید.",
  alternates: { canonical: "/quote" },
  robots: { index: true, follow: true },
};

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product = "" } = await searchParams;
  return (
    <div className="pro-page quote-page">
      <SiteHeader active="quote" />
      <main id="main-content">
        <section className="inner-hero quote-pro-hero">
          <div><span>درخواست خرید عمده</span><h1>نیازتان را بنویسید؛ متن آماده تحویل بگیرید.</h1><p>فرم زیر به شما کمک می‌کند اطلاعات لازم را کامل کنید و درخواست مرتب و قابل بررسی برای واحد فروش بفرستید.</p></div>
          <div className="quote-privacy"><Icon name="check" /><span><strong>بدون ثبت اطلاعات روی سایت</strong><small>ارسال نهایی فقط با انتخاب خود شما در تلگرام</small></span></div>
        </section>
        <section className="quote-page-content"><QuoteForm initialProduct={product} /></section>
      </main>
      <SiteFooter />
    </div>
  );
}
