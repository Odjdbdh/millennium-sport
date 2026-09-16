import Link from "next/link";
import { blogArticles } from "../blog/data";

type Article = (typeof blogArticles)[number];

function scoreArticle(article: Article, category: string, material?: string) {
  const text = `${article.title} ${article.description} ${article.keywords.join(" ")}`;
  let score = 0;
  if (text.includes(category)) score += 4;
  if (material && text.includes(material)) score += 5;
  if (category === "زنانه" && /زنانه|سایزبندی/.test(text)) score += 3;
  if (category === "مردانه" && /مردانه/.test(text)) score += 3;
  if (/خرید عمده|پوشاک ورزشی|فروشگاه/.test(text)) score += 1;
  return score;
}

export default function ProductSeoLinks({ category, material }: { category: string; material?: string }) {
  const items = [...blogArticles]
    .sort((a, b) => scoreArticle(b, category, material) - scoreArticle(a, category, material))
    .slice(0, 4);

  return (
    <section className="product-seo-links" aria-labelledby="product-seo-title">
      <span>راهنمای انتخاب و خرید</span>
      <h2 id="product-seo-title">راهنماهای مرتبط با این محصول</h2>
      <p>برای شناخت بهتر جنس، سایزبندی، کیفیت و نکات خرید عمده، راهنماهای کاربردی میلنیوم اسپرت را بخوانید.</p>
      <div className="product-seo-links-grid">
        {items.map((article) => (
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
