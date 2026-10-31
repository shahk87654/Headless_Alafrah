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
  const [cookieChoice, setCookieChoice] = useState(false);

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
    const frame = window.requestAnimationFrame(() => {
      setCookieChoice(localStorage.getItem("alafrah-cookie-choice") !== null);
    });
    return () => window.cancelAnimationFrame(frame);
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
        <div className="announce">
          <span>Free delivery on orders over AED 2,000 within Dubai</span>
          <button type="button" aria-label="Dismiss announcement" onClick={() => setAnnouncement(false)}>
            <X size={14} />
          </button>
        </div>
      )}
      <header className="site-head">
        <button className="menu-btn" type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu size={20} />
        </button>
        <Link className="brand" href="/" aria-label="Al Afrah Technical home">
          <span>Al Afrah</span>
          <small>Technical</small>
        </Link>
        <nav className="primary-nav" aria-label="Main navigation">
          {NAV.map(([label, href]) => (
            <Link key={`${label}-${href}`} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="cluster">
          <button className="icon-btn" type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={20} />
          </button>
          <Link className="account-btn" href="/account" aria-label="Account">
            <User size={20} />
          </Link>
          <Link className="cart-btn" href="/cart" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag size={20} />
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div className="search-screen" role="dialog" aria-modal="true" aria-label="Site search">
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
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="mobile-nav-head">
            <Link className="brand" href="/" onClick={() => setMenuOpen(false)}>
              <span>Al Afrah</span>
              <small>Technical</small>
            </Link>
            <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav>
            {NAV.map(([label, href]) => (
              <Link key={`${label}-${href}`} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mobile-nav-foot">
            <Link href="/account" onClick={() => setMenuOpen(false)}>My account</Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000"}`} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      )}

      <main>{children}</main>

      <footer className="site-foot">
        <div className="foot-bottom">
          <Link className="foot-brand" href="/">Al Afrah Technical</Link>
          <nav className="foot-links" aria-label="Footer">
            <Link href="/collections/coffee-tables">Tables</Link>
            <Link href="/collections/marble-accessories">Accessories</Link>
            <Link href="/custom-table">Custom</Link>
            <Link href="/pages/contact">Contact</Link>
            <Link href="/faqs">FAQs</Link>
          </nav>
          <p className="foot-meta">Dubai, UAE · © 2026</p>
        </div>
      </footer>
      <a
        className="whatsapp"
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000"}?text=${encodeURIComponent("Hello Al Afrah Technical, I would like to ask about a piece.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        WhatsApp
      </a>
      {!cookieChoice && (
        <aside className="cookie" aria-label="Cookie choices">
          <p>We use cookies to keep the cart and measure site use.</p>
          <button className="btn btn-primary" type="button" onClick={() => { localStorage.setItem("alafrah-cookie-choice", "accept"); setCookieChoice(true); }}>Accept</button>
          <button className="btn btn-outline" type="button" onClick={() => { localStorage.setItem("alafrah-cookie-choice", "reject"); setCookieChoice(true); }}>Reject</button>
          <button className="btn btn-ghost" type="button" onClick={() => { localStorage.setItem("alafrah-cookie-choice", "choose"); setCookieChoice(true); }}>Choose</button>
        </aside>
      )}
    </>
  );
}
