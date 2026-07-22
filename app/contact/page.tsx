import type { Metadata } from "next";
import Link from "next/link";
import Icon from "../components/Icon";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import StoreMap, { neshanUrl, storeAddress } from "../components/StoreMap";

const telegramUrl = "https://t.me/Millenniumsport";
const instagramUrl = "https://instagram.com/mill_spo0rt";

export const metadata: Metadata = {
  title: "تماس و آدرس فروشگاه",
  description: "راه‌های رسمی ارتباط با واحد فروش عمده میلنیوم اسپرت و مسیریابی فروشگاه در تهران با نشان یا گوگل‌مپ.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="contact-page pro-page">
      <SiteHeader active="contact" />
      <main id="main-content">
        <section className="inner-hero contact-pro-hero">
          <div><span>تماس و مراجعه حضوری</span><h1>برای همکاری عمده، مستقیم با ما در تماس باشید.</h1><p>دریافت کاتالوگ، استعلام قیمت همکاری و هماهنگی مراجعه حضوری به فروشگاه میلنیوم اسپرت.</p></div>
          <Link className="inner-hero-action" href="/quote">ثبت درخواست پیش‌فاکتور <Icon name="arrow" /></Link>
        </section>

        <section className="contact-pro-grid" aria-label="راه‌های ارتباطی میلنیوم اسپرت">
          <a href="tel:+989120935534"><span><Icon name="phone" /></span><small>تماس مستقیم با واحد فروش</small><strong dir="ltr">0912 093 5534</strong><p>پیگیری سفارش و هماهنگی خرید عمده</p><i>تماس تلفنی</i></a>
          <a href={telegramUrl} target="_blank" rel="noreferrer"><span><Icon name="send" /></span><small>فروش عمده در تلگرام</small><strong dir="ltr">@Millenniumsport</strong><p>استعلام قیمت، موجودی و دریافت کاتالوگ روز</p><i>باز کردن تلگرام</i></a>
          <a href={instagramUrl} target="_blank" rel="noreferrer"><span><Icon name="shirt" /></span><small>اینستاگرام رسمی</small><strong dir="ltr">@mill_spo0rt</strong><p>مشاهده مدل‌ها و فعالیت‌های مجموعه</p><i>باز کردن اینستاگرام</i></a>
          <a href={neshanUrl} target="_blank" rel="noreferrer"><span><Icon name="pin" /></span><small>مراجعه حضوری همکاران</small><strong>مرکز خرید گردون، پلاک ۱۲۲</strong><p>{storeAddress}</p><i>مسیریابی با نشان</i></a>
        </section>

        <section className="contact-guidance">
          <div><span>برای پاسخ دقیق‌تر</span><h2>هنگام تماس چه اطلاعاتی بفرستیم؟</h2><p>نام فروشگاه، شهر، محصول یا دسته موردنظر و تعداد تقریبی را بنویسید تا بررسی موجودی و قیمت سریع‌تر انجام شود.</p></div>
          <Link href="/quote">آماده‌سازی متن درخواست <Icon name="arrow" /></Link>
        </section>

        <StoreMap />
      </main>
      <SiteFooter />
    </div>
  );
}
