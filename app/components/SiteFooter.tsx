import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import { neshanUrl, storeAddress } from "./StoreMap";

const telegramUrl = "https://t.me/Millenniumsport";
const instagramUrl = "https://instagram.com/mill_spo0rt";

export default function SiteFooter() {
  return (
    <footer className="site-footer pro-footer">
      <div className="pro-footer-grid">
        <div className="pro-footer-about">
          <Link className="brand footer-brand" href="/">
            <span className="brand-logo-wrap"><Image src="/images/millennium-logo-mark.webp" alt="" width={48} height={48} unoptimized /></span>
            <span className="brand-copy"><strong>میلنیوم اسپرت</strong><small>تولید و پخش عمده از سال ۱۳۷۹</small></span>
          </Link>
          <p>تولید و تأمین عمده پوشاک ورزشی برای فروشگاه‌ها، پخش‌کننده‌ها و مجموعه‌های ورزشی سراسر ایران.</p>
          <Link className="footer-primary-link" href="/quote">ثبت درخواست همکاری <Icon name="arrow" /></Link>
        </div>
        <nav className="footer-links" aria-label="دسترسی سریع">
          <strong>دسترسی سریع</strong>
          <Link href="/shop">کاتالوگ عمده</Link>
          <Link href="/wholesale">راهنمای خرید عمده</Link>
          <Link href="/blog">مجله و راهنماها</Link>
          <Link href="/about">درباره مجموعه</Link>
          <Link href="/contact">تماس و آدرس</Link>
        </nav>
        <nav className="footer-links" aria-label="خدمات فروش عمده">
          <strong>خدمات همکاری</strong>
          <Link href="/quote">درخواست پیش‌فاکتور</Link>
          <Link href="/wholesale#process">مراحل ثبت سفارش</Link>
          <Link href="/wholesale#faq">سؤال‌های متداول</Link>
          <a href={telegramUrl} target="_blank" rel="noreferrer">فروش عمده در تلگرام</a>
        </nav>
        <div className="footer-contact">
          <strong>مراجعه و ارتباط</strong>
          <a href={neshanUrl} target="_blank" rel="noreferrer"><Icon name="pin" /><span>{storeAddress}</span></a>
          <a href="tel:+989120935534"><Icon name="phone" /><span dir="ltr">0912 093 5534</span></a>
          <a href={telegramUrl} target="_blank" rel="noreferrer"><span dir="ltr">@Millenniumsport</span></a>
          <a href={instagramUrl} target="_blank" rel="noreferrer"><span dir="ltr">@mill_spo0rt</span></a>
        </div>
      </div>
      <div className="footer-bottom pro-footer-bottom"><span>تمامی حقوق برای گروه تولیدی میلنیوم اسپرت محفوظ است.</span><span>فروش فقط به‌صورت عمده و همکاری</span></div>
    </footer>
  );
}
