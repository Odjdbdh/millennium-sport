import type { Metadata } from "next";
import Link from "next/link";
import Icon from "../components/Icon";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "راهنمای خرید عمده",
  description: "مراحل استعلام موجودی، قیمت همکاری، پیش‌فاکتور و ارسال سفارش عمده پوشاک ورزشی میلنیوم اسپرت.",
  alternates: { canonical: "/wholesale" },
};

const steps = [
  ["۰۱", "مدل یا دسته را مشخص کنید", "از کاتالوگ سایت انتخاب کنید یا از واحد فروش کاتالوگ و موجودی روز بخواهید."],
  ["۰۲", "نیاز خرید را بفرستید", "نام فروشگاه، شهر، مدل موردنظر و تعداد تقریبی را در درخواست خود بنویسید."],
  ["۰۳", "اطلاعات روز تأیید می‌شود", "واحد فروش قیمت همکاری، موجودی، سایز و جزئیات قابل تأمین را اعلام می‌کند."],
  ["۰۴", "پیش‌فاکتور را بررسی کنید", "اقلام و جزئیات سفارش را پیش از تأیید نهایی بررسی و با واحد فروش هماهنگ کنید."],
  ["۰۵", "ارسال هماهنگ می‌شود", "پس از نهایی‌شدن سفارش، شیوه و جزئیات ارسال متناسب با مقصد هماهنگ خواهد شد."],
];

export default function WholesalePage() {
  return (
    <div className="pro-page wholesale-page">
      <SiteHeader active="wholesale" />
      <main id="main-content">
        <section className="inner-hero wholesale-pro-hero">
          <div><span>راهنمای همکاری عمده</span><h1>خرید عمده روشن و مرحله‌به‌مرحله</h1><p>هرآنچه پیش از استعلام، پیش‌فاکتور و نهایی‌کردن سفارش پوشاک ورزشی نیاز دارید در این صفحه آمده است.</p></div>
          <Link className="inner-hero-action" href="/quote">شروع درخواست خرید <Icon name="arrow" /></Link>
        </section>

        <section className="wholesale-audience">
          <div className="pro-section-heading"><span>این همکاری مناسب چه کسانی است؟</span><h2>ساخته‌شده برای خریداران حرفه‌ای</h2></div>
          <div>
            <article><Icon name="shirt" /><h3>فروشگاه‌های پوشاک ورزشی</h3><p>برای تکمیل ویترین با مدل‌های قابل تأمین و قیمت همکاری.</p></article>
            <article><Icon name="box" /><h3>پخش‌کننده‌ها</h3><p>برای بررسی مدل‌ها و هماهنگی سفارش در تعداد عمده.</p></article>
            <article><Icon name="users" /><h3>مجموعه‌های ورزشی</h3><p>برای خرید سازمانی یا تجهیز مجموعه با هماهنگی واحد فروش.</p></article>
          </div>
        </section>

        <section className="wholesale-process" id="process">
          <div className="pro-section-heading pro-section-heading--center"><span>فرایند سفارش</span><h2>از اولین پیام تا ارسال سفارش</h2><p>جزئیات نهایی هر مرحله، متناسب با محصول و سفارش شما توسط واحد فروش تأیید می‌شود.</p></div>
          <ol>{steps.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
        </section>

        <section className="wholesale-clarity">
          <div><span>اطلاعاتی که پیش از خرید تأیید می‌شود</span><h2>قیمت، موجودی و شرایط هر سفارش</h2><p>به‌دلیل تغییر موجودی و شرایط تولید، اطلاعات نهایی به‌صورت موردی در پیش‌فاکتور اعلام می‌شود.</p></div>
          <ul><li><Icon name="check" /> قیمت همکاری روز</li><li><Icon name="check" /> مدل، رنگ و سایز قابل تأمین</li><li><Icon name="check" /> تعداد و اقلام نهایی سفارش</li><li><Icon name="check" /> جزئیات و شیوه ارسال</li></ul>
        </section>

        <section className="faq-page-section" id="faq">
          <div className="pro-section-heading"><span>سؤال‌های متداول</span><h2>پاسخ به پرسش‌های خرید عمده</h2></div>
          <div className="faq-list">
            <details open><summary>آیا از سایت می‌توان خرید تکی انجام داد؟</summary><p>خیر. سایت میلنیوم اسپرت برای فروش عمده و همکاری با واحدهای صنفی، پخش‌کننده‌ها و مجموعه‌ها طراحی شده است.</p></details>
            <details><summary>چطور قیمت همکاری را دریافت کنم؟</summary><p>از فرم درخواست پیش‌فاکتور، محصول و نیاز تقریبی خود را ثبت کنید؛ سپس متن آماده را در تلگرام برای واحد فروش بفرستید.</p></details>
            <details><summary>آیا قیمت و موجودی سایت قطعی است؟</summary><p>خیر. قیمت، موجودی، رنگ و تعداد قابل تأمین پیش از ثبت نهایی سفارش توسط واحد فروش تأیید می‌شود.</p></details>
            <details><summary>حداقل تعداد سفارش چقدر است؟</summary><p>تعداد قابل سفارش به مدل و موجودی روز وابسته است. برای دریافت عدد دقیق، محصول و تعداد تقریبی مدنظر را در درخواست خود ذکر کنید.</p></details>
            <details><summary>امکان ارسال به شهرستان وجود دارد؟</summary><p>بله، سفارش‌های عمده پس از هماهنگی برای همکاران در سراسر ایران ارسال می‌شوند.</p></details>
            <details><summary>می‌توانم حضوری مراجعه کنم؟</summary><p>بله. آدرس و دکمه مسیریابی با نشان در صفحه تماس قرار دارد. بهتر است برای بررسی موجودی مدل موردنظر، پیش از مراجعه هماهنگ کنید.</p></details>
            <details><summary>چطور کاتالوگ کامل‌تر را ببینم؟</summary><p>محصولات ثبت‌شده در صفحه کاتالوگ دیده می‌شوند. برای مدل‌ها و موجودی‌های روز، از واحد فروش کاتالوگ همکاری بخواهید.</p></details>
          </div>
        </section>

        <section className="simple-cta"><div><span>قدم بعدی</span><h2>نیاز فروشگاهتان را برای ما بنویسید.</h2></div><Link href="/quote">ثبت درخواست پیش‌فاکتور <Icon name="arrow" /></Link></section>
      </main>
      <SiteFooter />
    </div>
  );
}

