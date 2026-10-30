import type { Metadata } from "next";
import "./globals.css";
import "./sleek.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://alafrahtechnical.com"),
  title: { default: "Al Afrah Technical | Premium Marble Furniture UAE", template: "%s | Al Afrah Technical" },
  description: "Premium marble furniture, accessories and bespoke tables, crafted in Dubai for homes and businesses across the UAE.",
  openGraph: { type: "website", siteName: "Al Afrah Technical", locale: "en_AE" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
