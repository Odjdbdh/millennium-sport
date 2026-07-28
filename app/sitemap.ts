import type { MetadataRoute } from "next";
import { getCatalogProducts } from "./lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalogProducts();
  const baseUrl = "https://millenniumsport.ir";
  const pages = ["", "/shop", "/wholesale", "/about", "/contact", "/quote"];
  return [
    ...pages.map((path, index) => ({ url: `${baseUrl}${path}`, changeFrequency: index < 2 ? "weekly" as const : "monthly" as const, priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.7 })),
    ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
