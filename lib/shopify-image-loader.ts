import type { ImageLoaderProps } from "next/image";

export default function shopifyImageLoader({ src, width }: ImageLoaderProps): string {
  const imageUrl = new URL(src, "https://shopify-image.invalid");

  if (imageUrl.hostname !== "cdn.shopify.com") {
    return src;
  }

  imageUrl.searchParams.set("width", String(width));
  return imageUrl.toString();
}
