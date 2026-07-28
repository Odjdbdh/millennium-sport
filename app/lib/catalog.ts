import { products as fallbackProducts, type Product } from "../data/products";
import { findManagedProduct, listManagedProducts } from "./admin-store";
import { getAdminRuntime } from "./admin-runtime";

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const runtime = await getAdminRuntime();
    if (!runtime.STORIES_DB) return fallbackProducts;
    const rows = await listManagedProducts(runtime.STORIES_DB, false);
    return rows.map((row) => row.product);
  } catch {
    return fallbackProducts;
  }
}

export async function getCatalogProduct(slug: string): Promise<Product | null> {
  try {
    const runtime = await getAdminRuntime();
    if (!runtime.STORIES_DB) {
      return fallbackProducts.find((product) => product.slug === slug) ?? null;
    }
    const row = await findManagedProduct(runtime.STORIES_DB, slug);
    return row?.product ?? null;
  } catch {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
}
