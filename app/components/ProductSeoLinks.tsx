import Link from "next/link";
import { blogArticles } from "../blog/data";

const categoryMap: Record<string, string[]> = {
  زنانه: ["خرید عمده پوشاک ورزشی زنانه", "سایزبندی لباس ورزشی زنانه", "راهنمای انتخاب لباس ورزشی برای فروشگاه"],
  مردانه: ["خرید عمده پوشاک ورزشی مردانه", "راهنمای انتخاب لباس ورزشی برای فروشگاه", "مدیریت موجودی فروشگاه پوشاک ورزشی"],
  "ست ورزشی": ["راهنمای انتخاب لباس ورزشی برای فروشگاه", "خرید عمده پوشاک ورزشی", "مدیریت موجودی فروشگاه پوشاک ورزشی"],
};

export default function ProductSeoLinks({ category, material }: { category: string; material?: string }) {
  const preferred = categoryMap[category] ?? [];
  const related = blogArticles
    .filter((article) => preferred.includes(article.title) || article.keywords.some((keyword) => keyword.includes(category)))
    .slice(0, 4);
  const materialArticle = material?.includes("فیلامنت")
    ? blogArticles.find((article) => article.title.includes("فیلامنت"))
    : undefined;
  const items = [materialArticle, ...related].filter(Boolean).filter((item, index, all) => all.findIndex((x) => x?.slug === item?.slug) === index).slice(0, 4);

  return (
    <section className="product-seo-links" aria-labelledby="product-seo-title">
      <span>راهنمای انتخاب و خرید</span>
      <h2 id="product-seo-title">اطلاعات مفید مرتبط با این محصول</h2>
      <p>برای انتخاب بهتر کالا، کیفیت پارچه، سایزبندی و خرید عمده، این راهنماهای میلنیوم اسپرت را ببینید.</p>
      <div className="product-seo-links-grid">
        {items.map((article) => article && (
          <Link key={article.slug} href={`/blog/${article.slug}`}>
            <strong>{article.title}</strong>
            <small>{article.description}</small>
            <span>مطالعه راهنما ←</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
