import type { MetadataRoute } from "next";
import { getCatalogProducts } from "./lib/catalog";
import { blogArticles } from "./blog/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalogProducts();
  const baseUrl = "https://millenniumsport.ir";
  const pages = ["", "/shop", "/wholesale", "/about", "/contact", "/quote", "/blog"];
  return [
    ...pages.map((path, index) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: path === "/blog" ? "daily" as const : index < 2 ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : path === "/shop" ? 0.9 : path === "/blog" ? 0.9 : 0.7,
    })),
    ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...blogArticles.map((article) => ({ url: `${baseUrl}/blog/${article.slug}`, lastModified: new Date(article.updatedAt), changeFrequency: "monthly" as const, priority: 0.75 })),
  ];
}
