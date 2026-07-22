import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://millenniumsport.ir/sitemap.xml", host: "https://millenniumsport.ir" };
}

