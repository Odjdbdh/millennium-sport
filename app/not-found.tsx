import Link from "next/link";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

export default function NotFound() {
  return (
    <div className="pro-page not-found-page"><SiteHeader active="home" /><main id="main-content"><section className="not-found-card"><span>۴۰۴</span><h1>این صفحه پیدا نشد.</h1><p>ممکن است آدرس تغییر کرده باشد یا محصول از کاتالوگ فعلی خارج شده باشد.</p><div><Link href="/">صفحه اصلی</Link><Link href="/shop">کاتالوگ عمده</Link></div></section></main><SiteFooter /></div>
  );
}

