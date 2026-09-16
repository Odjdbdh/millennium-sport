import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import StoryBar from "./StoryBar";

export type ActivePage = "home" | "shop" | "wholesale" | "about" | "contact" | "quote" | "blog";

const navigation: { href: string; label: string; key: ActivePage }[] = [
  { href: "/", label: "خانه", key: "home" },
  { href: "/shop", label: "کاتالوگ عمده", key: "shop" },
  { href: "/wholesale", label: "راهنمای خرید عمده", key: "wholesale" },
  { href: "/blog", label: "مجله", key: "blog" },
  { href: "/about", label: "درباره ما", key: "about" },
  { href: "/contact", label: "تماس با ما", key: "contact" },
];

const telegramUrl = "https://t.me/Millenniumsport";

export default function SiteHeader({ active }: { active: ActivePage }) {
  return (
    <>
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <div className="announcement">
        <span>تأمین عمده پوشاک ورزشی برای سراسر ایران</span>
        <span className="announcement-dot" />
        <span>قیمت همکاری مستقیم از تولیدکننده</span>
      </div>
      <header className="site-header pro-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="میلنیوم اسپرت؛ صفحه اصلی">
            <span className="brand-logo-wrap"><Image src="/images/millennium-logo-mark.webp" alt="" width={48} height={48} priority unoptimized /></span>
            <span className="brand-copy"><strong>میلنیوم اسپرت</strong><small>تولید و پخش عمده پوشاک ورزشی</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="منوی اصلی">
            {navigation.map((item) => <Link key={item.key} className={active === item.key ? "active" : undefined} href={item.href}>{item.label}</Link>)}
          </nav>
          <div className="header-actions">
            <a className="wholesale-header-cta" href={telegramUrl} target="_blank" rel="noreferrer">گفت‌وگو در تلگرام <Icon name="send" /></a>
            <details className="mobile-menu">
              <summary aria-label="باز کردن منوی سایت"><Icon name="menu" /></summary>
              <nav aria-label="منوی موبایل">
                {navigation.map((item) => <Link key={item.key} className={active === item.key ? "active" : undefined} href={item.href}>{item.label}</Link>)}
                <Link className="mobile-quote" href="/quote">درخواست پیش‌فاکتور</Link>
                <a className="mobile-telegram" href={telegramUrl} target="_blank" rel="noreferrer">گفت‌وگو در تلگرام</a>
              </nav>
            </details>
          </div>
        </div>
      </header>
      <StoryBar />
    </>
  );
}
