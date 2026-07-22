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

export default function CatalogExplorer({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["key"]>("all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa");
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.categoryKey === category;
      const haystack = `${product.name} ${product.category} ${product.shortDescription} ${product.sku ?? ""} ${product.material ?? ""} ${(product.colors ?? []).join(" ")}`.toLocaleLowerCase("fa");
      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, products, query]);

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
            placeholder="جست‌وجوی نام یا نوع محصول…"
          />
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
        <h2 id="catalog-title">محصولات ثبت‌شده در کاتالوگ</h2>
        <span>{filteredProducts.length.toLocaleString("fa-IR")} محصول</span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="catalog-product-grid">
          {filteredProducts.map((product) => (
            <article className="catalog-product" key={product.slug}>
              <Link className="catalog-product-image" href={`/products/${product.slug}`}>
                <Image src={product.image} alt={product.imageAlt} width={720} height={960} sizes="(max-width: 720px) 100vw, 420px" unoptimized />
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
          <strong>محصول ثبت‌شده‌ای با این فیلتر پیدا نشد.</strong>
          <p>برای دریافت مدل‌ها و موجودی‌های روز، درخواست کاتالوگ همکاری ثبت کنید.</p>
          <Link href="/quote">درخواست کاتالوگ روز</Link>
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
