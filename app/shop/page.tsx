import type { Metadata } from "next";
import CatalogExplorer from "../components/CatalogExplorer";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getCatalogProducts } from "../lib/catalog";

export const metadata: Metadata = {
  title: "کاتالوگ عمده پوشاک ورزشی",
  description: "مشاهده محصولات ثبت‌شده میلنیوم اسپرت و درخواست موجودی و قیمت همکاری روز برای خرید عمده.",
  alternates: { canonical: "/shop" },
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const products = await getCatalogProducts();
  const requestedCategory = await searchParams;
  const initialCategory = ["all", "women", "men", "sets"].includes(requestedCategory.category ?? "")
    ? (requestedCategory.category as "all" | "women" | "men" | "sets")
    : "all";

  return (
    <div className="shop-page pro-page">
      <SiteHeader active="shop" />
      <main id="main-content">
        <section className="inner-hero catalog-hero">
          <div>
            <span>ویژه فروشگاه‌ها و پخش‌کننده‌ها</span>
            <h1>کاتالوگ عمده میلنیوم اسپرت</h1>
            <p>مدل‌های ثبت‌شده را بررسی کنید؛ قیمت همکاری، رنگ‌بندی و تعداد قابل تأمین هر محصول هنگام استعلام نهایی می‌شود.</p>
          </div>
          <div className="inner-hero-fact"><strong>{products.length.toLocaleString("fa-IR")}</strong><span>محصول ثبت‌شده آنلاین</span><small>کاتالوگ روز از واحد فروش</small></div>
        </section>
        <CatalogExplorer products={products} initialCategory={initialCategory} />
      </main>
      <SiteFooter />
    </div>
  );
}
