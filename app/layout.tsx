import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://alafrahtechnical.com"),
  title: { default: "Al Afrah Technical | Marble furniture, Dubai", template: "%s | Al Afrah Technical" },
  description:
    "Tables, planters, bathroom and kitchen accessories, bakhoor burners and made-to-order custom tables in Travertine, Calacatta, Arabescato, Onyx and other stones. Workshop in Dubai.",
  openGraph: { type: "website", siteName: "Al Afrah Technical", locale: "en_AE" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
