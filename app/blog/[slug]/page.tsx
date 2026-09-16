import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { blogArticles, getArticle } from "../data";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${article.slug}`,
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = blogArticles.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);
  const fallbackRelated = related.length ? related : blogArticles.filter((item) => item.slug !== article.slug).slice(0, 3);
  const articleUrl = `https://millenniumsport.ir/blog/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        author: { "@type": "Organization", name: "میلنیوم اسپرت", url: "https://millenniumsport.ir" },
        publisher: { "@type": "Organization", name: "میلنیوم اسپرت", url: "https://millenniumsport.ir" },
        keywords: article.keywords.join(", "),
        inLanguage: "fa-IR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "خانه", item: "https://millenniumsport.ir/" },
          { "@type": "ListItem", position: 2, name: "مجله", item: "https://millenniumsport.ir/blog" },
          { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      },
    ],
  };

  return (
    <div className="site-shell">
      <SiteHeader active="home" />
      <main id="main-content" className="article-page">
        <article>
          <header className="article-header">
            <Link className="article-back" href="/blog">← بازگشت به مجله</Link>
            <div className="article-meta"><span>{article.category}</span><time dateTime={article.updatedAt}>به‌روزرسانی: {article.updatedAt.replaceAll("-", "/")}</time><span>{article.readingTime} مطالعه</span></div>
            <h1>{article.title}</h1>
            <p className="article-description">{article.description}</p>
          </header>
          <div className="article-layout">
            <aside className="article-aside">
              <div><strong>در این مقاله</strong><ol>{article.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}</ol></div>
              <Link className="article-aside-cta" href="/quote">استعلام قیمت همکاری</Link>
            </aside>
            <div className="article-body">
              <p className="article-intro">{article.intro}</p>
              {article.sections.map((section, index) => (
                <section id={`section-${index + 1}`} key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                </section>
              ))}
              <section className="article-faq" aria-labelledby="article-faq-title">
                <h2 id="article-faq-title">سؤالات متداول</h2>
                {article.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
              </section>
            </div>
          </div>
        </article>

        <section className="related-articles" aria-labelledby="related-title">
          <div className="blog-section-heading"><div><span>مطالب مرتبط</span><h2 id="related-title">مطالعه بیشتر</h2></div><Link href="/blog">همه مقالات ←</Link></div>
          <div className="blog-grid">
            {fallbackRelated.map((item) => <article className="blog-card" key={item.slug}><div className="blog-card-meta"><span>{item.category}</span><span>{item.readingTime} مطالعه</span></div><h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3><p>{item.description}</p><div className="blog-card-footer"><Link href={`/blog/${item.slug}`}>مطالعه مقاله ←</Link></div></article>)}
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
