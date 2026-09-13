"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "../data/products";
import Icon from "./Icon";

const categories = [
  { key: "all", label: "همه" },
  { key: "women", label: "زنانه" },
  { key: "men", label: "مردانه" },
  { key: "sets", label: "ست ورزشی" },
] as const;

const normalizeSearch = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase("fa")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

export default function CatalogExplorer({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["key"]>("all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.categoryKey === category;
      const haystack = normalizeSearch(
        `${product.name} ${product.category} ${product.shortDescription} ${product.sku ?? ""} ${product.material ?? ""} ${(product.colors ?? []).join(" ")}`,
      );
      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, products, query]);

  const hasFilters = query.trim().length > 0 || category !== "all";

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <section className="catalog-explorer" id="catalog" aria-labelledby="catalog-title">
      <div className="catalog-tools">
        <div className="catalog-search">
          <Icon name="search" />
          <label className="sr-only" htmlFor="catalog-search">جست‌وجو در کاتالوگ</label>
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جست‌وجوی نام، کد یا نوع محصول…"
            autoComplete="off"
          />
          {query ? (
            <button type="button" className="catalog-search-clear" onClick={() => setQuery("")} aria-label="پاک کردن جست‌وجو">
              ×
            </button>
          ) : null}
        </div>
        <div className="catalog-filters" aria-label="فیلتر دسته‌بندی">
          {categories.map((item) => (
            <button
              key={item.key}
              className={category === item.key ? "active" : undefined}
              type="button"
              aria-pressed={category === item.key}
              onClick={() => setCategory(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-result-meta">
        <div>
          <h2 id="catalog-title">محصولات ثبت‌شده در کاتالوگ</h2>
          <p aria-live="polite">نمایش {filteredProducts.length.toLocaleString("fa-IR")} محصول از {products.length.toLocaleString("fa-IR")}</p>
        </div>
        {hasFilters ? (
          <button type="button" className="catalog-reset" onClick={resetFilters}>حذف فیلترها</button>
        ) : null}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="catalog-product-grid">
          {filteredProducts.map((product) => (
            <article className="catalog-product" key={product.slug}>
              <Link className="catalog-product-image" href={`/products/${product.slug}`} aria-label={`مشاهده ${product.name}`}>
                <Image src={product.image} alt={product.imageAlt} width={720} height={960} sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 420px" unoptimized />
                <span>{product.status}</span>
              </Link>
              <div className="catalog-product-body">
                <small>{product.category}{product.sku ? <span className="catalog-sku"> · کد <bdi>{product.sku}</bdi></span> : null}</small>
                <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
                <p>{product.shortDescription}</p>
                <div className="catalog-product-meta">
                  <span><small>سایزبندی</small><strong>{product.sizes.join("، ")}</strong></span>
                  <span><small>قیمت همکاری</small><strong>{product.price ?? "استعلام روز"}</strong></span>
                </div>
                <div className="catalog-product-actions">
                  <Link href={`/products/${product.slug}`}>مشاهده جزئیات</Link>
                  <Link className="catalog-quote-link" href={`/quote?product=${encodeURIComponent(product.name)}`}>درخواست قیمت</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="catalog-empty" role="status">
          <Icon name="shirt" size={30} />
          <strong>محصولی با این جست‌وجو یا فیلتر پیدا نشد.</strong>
          <p>عبارت جست‌وجو را کوتاه‌تر کنید یا فیلترها را پاک کنید.</p>
          <div>
            <button type="button" onClick={resetFilters}>نمایش همه محصولات</button>
            <Link href="/quote">درخواست کاتالوگ روز</Link>
          </div>
        </div>
      )}

      <aside className="catalog-live-note">
        <div>
          <span>کاتالوگ روز فروش عمده</span>
          <strong>همه مدل‌ها لزوماً هم‌زمان روی سایت نمایش داده نمی‌شوند.</strong>
          <p>موجودی، رنگ‌بندی و قیمت همکاری را قبل از سفارش از واحد فروش تأیید کنید.</p>
        </div>
        <Link href="/quote">دریافت موجودی و قیمت روز <Icon name="arrow" /></Link>
      </aside>
    </section>
  );
}
