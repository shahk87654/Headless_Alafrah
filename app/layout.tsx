import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Instrument_Sans, Italiana } from "next/font/google";
import "./globals.css";

const display = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
  adjustFontFallback: true,
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
  adjustFontFallback: true,
});

const arabic = IBM_Plex_Sans_Arabic({
  weight: ["400", "500", "600"],
  subsets: ["arabic"],
  variable: "--font-arabic-family",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://alafrahtechnical.com"),
  title: { default: "Al Afrah Technical | Marble furniture, Dubai", template: "%s | Al Afrah Technical" },
  description:
    "Tables, planters, bathroom and kitchen accessories, bakhoor burners and made-to-order custom tables in Travertine, Calacatta, Arabescato, Onyx, Black Marquina, Emperador Dark, Jungle Green and Red Travertine. Workshop in Dubai.",
  openGraph: { type: "website", siteName: "Al Afrah Technical", locale: "en_AE" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
