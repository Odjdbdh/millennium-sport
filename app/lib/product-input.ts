import type { Product, ProductGalleryImage } from "../data/products";

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanList(value: unknown, maxItems = 30) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item, 80))
    .filter(Boolean)
    .slice(0, maxItems);
}

function cleanGallery(value: unknown): ProductGalleryImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const source = item as Record<string, unknown>;
      const src = cleanText(source.src, 500);
      if (!src.startsWith("/") && !src.startsWith("https://")) return null;
      return {
        src,
        alt: cleanText(source.alt, 180) || "تصویر محصول میلنیوم اسپرت",
        label: cleanText(source.label, 60) || "تصویر محصول",
      };
    })
    .filter((item): item is ProductGalleryImage => Boolean(item))
    .slice(0, 30);
}

export function normalizeProductInput(value: unknown): Product | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const slug = cleanText(source.slug, 100).toLowerCase();
  const name = cleanText(source.name, 140);
  const image = cleanText(source.image, 500);
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !name ||
    (!image.startsWith("/") && !image.startsWith("https://"))
  ) {
    return null;
  }

  const categoryKey = ["women", "men", "sets"].includes(String(source.categoryKey))
    ? source.categoryKey as Product["categoryKey"]
    : "women";
  const categoryByKey: Record<Product["categoryKey"], Product["category"]> = {
    women: "زنانه",
    men: "مردانه",
    sets: "ست ورزشی",
  };
  const allowedStatuses: Product["status"][] = [
    "موجودی با استعلام",
    "موجود",
    "ناموجود",
    "در حال تولید",
  ];
  const status = allowedStatuses.includes(source.status as Product["status"])
    ? source.status as Product["status"]
    : "موجودی با استعلام";
  const gallery = cleanGallery(source.gallery);

  return {
    slug,
    name,
    category: categoryByKey[categoryKey],
    categoryKey,
    image,
    imageAlt: cleanText(source.imageAlt, 180) || `${name} میلنیوم اسپرت`,
    sizes: cleanList(source.sizes),
    colors: cleanList(source.colors),
    shortDescription: cleanText(source.shortDescription, 300),
    description: cleanText(source.description, 2_000),
    status,
    ...(gallery.length ? { gallery } : {}),
    ...(cleanText(source.sku, 50) ? { sku: cleanText(source.sku, 50) } : {}),
    ...(cleanText(source.material, 100) ? { material: cleanText(source.material, 100) } : {}),
    ...(cleanText(source.price, 100) ? { price: cleanText(source.price, 100) } : {}),
    ...(cleanText(source.pack, 120) ? { pack: cleanText(source.pack, 120) } : {}),
    ...(cleanText(source.quality, 60) ? { quality: cleanText(source.quality, 60) } : {}),
    salesTelegram: "https://t.me/Millenniumsport",
    phoneLabel: "۰۹۱۲۰۹۳۵۵۳۴",
    phoneHref: "tel:+989120935534",
  };
}
