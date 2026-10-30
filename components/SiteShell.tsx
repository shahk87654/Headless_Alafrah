"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

const NAV = [
  ["Home", "/"],
  ["Home decor", "/collections"],
  ["Furniture", "/collections"],
  ["Materials", "/collections/travertine-marble"],
  ["Accessories", "/collections/marble-accessories"],
  ["Custom items", "/custom-table"],
  ["Magazine", "/blogs/news"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    const syncCartCount = () => {
      const saved = JSON.parse(localStorage.getItem("alafrah-cart") ?? "null") as { totalQuantity?: number } | null;
      setCartCount(saved?.totalQuantity ?? 0);
    };
    syncCartCount();
    window.addEventListener("alafrah-cart-updated", syncCartCount);
    window.addEventListener("storage", syncCartCount);
    return () => {
      window.removeEventListener("alafrah-cart-updated", syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  return (
    <>
      {announcement && (
        <div>
          <span>Free delivery on orders over AED 2,000 within Dubai</span>
          <button type="button" aria-label="Dismiss announcement" onClick={() => setAnnouncement(false)}>
            <X size={14} />
          </button>
        </div>
      )}
      <header>
        <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu />
        </button>
        <Link href="/" aria-label="Al Afrah Technical home">
          Al Afrah Technical
        </Link>
        <nav aria-label="Main navigation">
          {NAV.map(([label, href]) => (
            <Link key={`${label}-${href}`} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div>
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search />
          </button>
          <Link href="/account" aria-label="Account">
            <User />
          </Link>
          <Link href="/cart" aria-label="Cart">
            <ShoppingBag />
            <span>{cartCount}</span>
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div role="dialog" aria-modal="true" aria-label="Site search">
          <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <X />
          </button>
          <form action="/search">
            <label className="sr-only" htmlFor="site-search">
              Search
            </label>
            <input id="site-search" name="q" type="search" placeholder="Search tables, materials, accessories" autoFocus />
            <button type="submit">Search</button>
          </form>
          <div>
            <p>Suggested collections</p>
            <Link href="/collections/coffee-tables" onClick={() => setSearchOpen(false)}>
              Coffee tables
            </Link>
            <Link href="/collections/dining-tables" onClick={() => setSearchOpen(false)}>
              Dining tables
            </Link>
            <Link href="/collections/travertine-marble" onClick={() => setSearchOpen(false)}>
              Travertine
            </Link>
          </div>
        </div>
      )}

      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Mobile menu">
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
          <nav>
            {NAV.map(([label, href]) => (
              <Link key={`${label}-${href}`} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main>{children}</main>

      <footer>
        <p>Al Afrah Technical. Marble workshop and store, Dubai.</p>
        <nav aria-label="Footer">
          <Link href="/collections/coffee-tables">Coffee tables</Link>
          <Link href="/collections/dining-tables">Dining tables</Link>
          <Link href="/collections/marble-accessories">Accessories</Link>
          <Link href="/custom-table">Custom table</Link>
          <Link href="/pages/contact">Contact</Link>
          <Link href="/pages/shipping">Shipping</Link>
          <Link href="/pages/returns">Returns</Link>
          <Link href="/faqs">FAQs</Link>
        </nav>
        <form>
          <label htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="Email address" required />
          <button type="submit">Join</button>
        </form>
        <p>© 2026 Al Afrah Technical. Dubai, United Arab Emirates.</p>
      </footer>
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000"}?text=${encodeURIComponent("Hello Al Afrah Technical, I would like to ask about a piece.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        WhatsApp
      </a>
    </>
  );
}
