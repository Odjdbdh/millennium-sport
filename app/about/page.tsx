import type { Metadata } from "next";
import Link from "next/link";
import Icon from "../components/Icon";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "درباره میلنیوم اسپرت",
  description: "آشنایی با مسیر خانوادگی، ۲۶ سال تجربه تولید و مدیریت امروز مجموعه میلنیوم اسپرت.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pro-page about-page">
      <SiteHeader active="about" />
      <main id="main-content">
        <section className="inner-hero about-pro-hero">
          <div><span>یک مسیر خانوادگی</span><h1>۲۶ سال تجربه در تولید پوشاک ورزشی</h1><p>میراثی که از نسل پیشین آغاز شد و امروز با تمرکز بر همکاری عمده و تأمین فروشگاه‌های سراسر ایران ادامه دارد.</p></div>
          <div className="inner-hero-fact"><strong>۱۳۷۹</strong><span>آغاز مسیر مجموعه</span><small>دو نسل تجربه تولیدی</small></div>
        </section>

        <section className="story-section">
          <div className="story-emblem" aria-hidden="true"><span>M</span><small>EST. 1379</small></div>
          <div className="story-copy">
            <span>داستان صحیح مجموعه</span>
            <h2>پایه‌گذاری توسط نسل پیشین؛ مدیریت امروز با حسن اصلانی</h2>
            <p>پایه‌گذاری میلنیوم اسپرت به پدر آقای حسن اصلانی و نسل پیشین خانواده بازمی‌گردد. تجربه تولید و شناخت بازار طی سال‌ها در خانواده منتقل شده و امروز مدیریت فروشگاه و ادامه مسیر مجموعه بر عهده آقای حسن اصلانی است.</p>
            <p>تمرکز فعلی مجموعه، تولید و پخش عمده پوشاک ورزشی و ایجاد همکاری مستقیم با فروشگاه‌ها، پخش‌کننده‌ها و مجموعه‌های ورزشی در سراسر ایران است.</p>
          </div>
        </section>

        <section className="about-principles">
          <div className="pro-section-heading pro-section-heading--center"><span>اصول همکاری</span><h2>چیزی که در این مسیر برای ما مهم است</h2></div>
          <div>
            <article><span>۰۱</span><h3>اطلاعات شفاف</h3><p>قیمت، موجودی و جزئیات قابل تأمین پیش از نهایی‌شدن هر سفارش تأیید می‌شود.</p></article>
            <article><span>۰۲</span><h3>ارتباط مستقیم</h3><p>همکاران برای دریافت کاتالوگ و قیمت روز مستقیماً با واحد فروش مجموعه در ارتباط‌اند.</p></article>
            <article><span>۰۳</span><h3>نگاه بلندمدت</h3><p>هدف، شکل‌دادن همکاری پایدار با فروشگاه‌ها و مراکز پخش در سراسر کشور است.</p></article>
          </div>
        </section>

        <section className="about-management">
          <div><span>مدیریت فعلی مجموعه</span><h2>حسن اصلانی</h2><p>مدیر فعلی فروشگاه میلنیوم اسپرت و ادامه‌دهنده مسیر خانوادگی مجموعه.</p></div>
          <blockquote>«تجربه نسل قبل، امروز با تمرکز بر نیاز همکاران و بازار پوشاک ورزشی ادامه پیدا می‌کند.»</blockquote>
        </section>

        <section className="simple-cta"><div><span>شروع همکاری با مجموعه</span><h2>برای دریافت کاتالوگ و قیمت روز آماده‌اید؟</h2></div><Link href="/quote">ثبت درخواست همکاری <Icon name="arrow" /></Link></section>
      </main>
      <SiteFooter />
    </div>
  );
}

