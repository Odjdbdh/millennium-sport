import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { blogArticles, blogCategories } from "./data";

export const metadata: Metadata = {
  title: "مجله میلنیوم اسپرت | راهنمای خرید عمده پوشاک ورزشی",
  description: "مقالات کاربردی میلنیوم اسپرت درباره خرید عمده لباس ورزشی، کیفیت پارچه، سایزبندی، مدیریت موجودی و فروش پوشاک ورزشی.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "مجله میلنیوم اسپرت | راهنمای خرید عمده پوشاک ورزشی",
    description: "راهنمای کاربردی برای فروشگاه‌ها و همکاران حوزه پوشاک ورزشی.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <div className="site-shell">
      <SiteHeader active="home" />
      <main id="main-content" className="blog-page">
        <section className="blog-hero">
          <div>
            <span className="blog-kicker">مجله میلنیوم اسپرت</span>
            <h1>راهنمای خرید و فروش عمده پوشاک ورزشی</h1>
            <p>مقاله‌های کاربردی برای فروشگاه‌ها، پخش‌کننده‌ها و همکارانی که می‌خواهند درباره انتخاب محصول، کیفیت، سایزبندی و مدیریت خرید عمده دقیق‌تر تصمیم بگیرند.</p>
          </div>
        </section>

        <section className="blog-content" aria-labelledby="blog-title">
          <div className="blog-section-heading">
            <div><span>مطالب کاربردی</span><h2 id="blog-title">آخرین راهنماها</h2></div>
            <p>{blogArticles.length} مقاله تخصصی درباره خرید و فروش پوشاک ورزشی</p>
          </div>
          <div className="blog-category-pills" aria-label="دسته‌بندی مقالات">
            <Link href="/blog">همه مطالب</Link>
            {blogCategories.map((category) => <span key={category}>{category}</span>)}
          </div>
          <div className="blog-grid">
            {blogArticles.map((article) => (
              <article className="blog-card" key={article.slug}>
                <div className="blog-card-meta"><span>{article.category}</span><time dateTime={article.updatedAt}>به‌روزرسانی {article.updatedAt.replaceAll("-", "/")}</time></div>
                <h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3>
                <p>{article.description}</p>
                <div className="blog-card-footer"><span>{article.readingTime} مطالعه</span><Link href={`/blog/${article.slug}`}>مطالعه مقاله ←</Link></div>
              </article>
            ))}
          </div>
        </section>

        <section className="blog-cta" aria-labelledby="blog-cta-title">
          <div><span>برای خرید عمده آماده‌اید؟</span><h2 id="blog-cta-title">از مطالعه راهنما تا استعلام محصول، یک قدم فاصله دارید.</h2><p>کد محصول، رنگ، سایز، تعداد تقریبی و شهر مقصد را آماده کنید تا درخواست همکاری دقیق‌تری ثبت کنید.</p></div>
          <Link href="/quote">درخواست قیمت همکاری</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
