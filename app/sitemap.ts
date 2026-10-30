import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alafrahtechnical.com";
  const paths = ["", "/collections", "/search", "/cart", "/blogs/news", "/faqs", "/custom-table", "/account", "/pages/about-us", "/pages/contact"];
  return paths.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }));
}
