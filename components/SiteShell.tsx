"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [cartCount, setCartCount] = useState(0);
  const [cookieChoice, setCookieChoice] = useState(false);
  const [homeAnnouncement, setHomeAnnouncement] = useState(true);
  const pathname = usePathname();
  const showHomeAnnouncement = pathname === "/" && homeAnnouncement;

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
      {showHomeAnnouncement && (
        <div className="home-announcement">
          <Link href="/custom-table">
            <span>Custom orders</span>
            <strong>Get up to 50% off</strong>
          </Link>
          <button type="button" aria-label="Dismiss announcement" onClick={() => setHomeAnnouncement(false)}>
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
        <div className="foot-top">
          <div className="foot-branding">
            <Link className="foot-brand" href="/" aria-label="Al Afrah Technical home">
              <span>Al Afrah</span>
              <small>Technical</small>
            </Link>
            <p>Marble furniture and bespoke interiors curated for refined homes in Dubai.</p>
          </div>

          <div className="foot-cta">
            <p>Need help finding the right piece?</p>
            <Link className="btn btn-primary" href="/custom-table">
              Book a consultation
            </Link>
          </div>
        </div>

        <div className="foot-grid" aria-label="Footer navigation">
          <div>
            <p className="foot-title">Shop</p>
            <nav className="foot-links">
              <Link href="/collections/coffee-tables">Coffee tables</Link>
              <Link href="/collections/dining-tables">Dining tables</Link>
              <Link href="/collections/marble-accessories">Accessories</Link>
            </nav>
          </div>

          <div>
            <p className="foot-title">Collections</p>
            <nav className="foot-links">
              <Link href="/collections/travertine-marble">Travertine</Link>
              <Link href="/collections">Home decor</Link>
              <Link href="/custom-table">Custom pieces</Link>
            </nav>
          </div>

          <div>
            <p className="foot-title">Support</p>
            <nav className="foot-links">
              <Link href="/pages/contact">Contact</Link>
              <Link href="/faqs">FAQs</Link>
              <Link href="/blogs/news">Journal</Link>
            </nav>
          </div>

          <div>
            <p className="foot-title">Visit</p>
            <div className="foot-contact">
              <span>Dubai, UAE</span>
              <a href="mailto:info@alafrahtechnical.com">info@alafrahtechnical.com</a>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000"}`} target="_blank" rel="noreferrer">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 Al Afrah Technical</span>
          <div className="foot-meta">
            <a href="mailto:info@alafrahtechnical.com">Email us</a>
            <a href="/pages/contact">Book a showroom visit</a>
          </div>
        </div>
      </footer>
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
