"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

export function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("keydown", close);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("scroll", onScroll);
    };
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
      {announcement && <div className="announcement"><span>Get up to 50% on custom orders</span><button aria-label="Dismiss announcement" onClick={() => setAnnouncement(false)}><X size={14} /></button></div>}
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu /></button>
        <Link className="brand-logo" href="/" aria-label="Al Afrah Technical home"><Image src="/alafrah-logo.png" alt="Al Afrah Technical" width={280} height={166} priority /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/collections">Furniture</Link>
          <Link href="/collections/travertine-marble">Materials</Link>
          <Link href="/collections/marble-accessories">Accessories</Link>
          <Link href="/custom-table">Custom Items</Link>
          <Link href="/blogs/news">Magazine</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" aria-label="Search" onClick={() => setSearchOpen(true)}><Search /></button>
          <Link className="icon-button account-button" href="/account" aria-label="Account"><User /></Link>
          <Link className="icon-button" href="/cart" aria-label="Cart"><ShoppingBag /><span className="cart-dot">{cartCount}</span></Link>
        </div>
      </header>

      {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Site search"><div className="search-overlay-head"><Link className="brand-logo search-logo" href="/" onClick={() => setSearchOpen(false)}><Image src="/alafrah-logo.png" alt="Al Afrah Technical" width={280} height={166} /></Link><button className="icon-button" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X /></button></div><form action="/search" className="search-overlay-form"><label className="sr-only" htmlFor="site-search">Search</label><input id="site-search" name="q" type="search" placeholder="Search collections and pieces" autoFocus /><button className="button button-dark" type="submit">Search</button></form><div className="search-suggestions"><span>Popular</span><Link href="/collections/coffee-tables" onClick={() => setSearchOpen(false)}>Coffee tables</Link><Link href="/collections/dining-tables" onClick={() => setSearchOpen(false)}>Dining tables</Link><Link href="/collections/travertine-marble" onClick={() => setSearchOpen(false)}>Travertine</Link></div></div>}

      {menuOpen && <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="Mobile menu"><div className="mobile-panel-head"><Image className="mobile-logo" src="/alafrah-logo.png" alt="Al Afrah Technical" width={280} height={166} /><button className="icon-button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></button></div><nav>{[["Home","/"],["Furniture","/collections"],["Materials","/collections/travertine-marble"],["Accessories","/collections/marble-accessories"],["Custom Items","/custom-table"],["Magazine","/blogs/news"]].map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav></div>}
      <main>{children}</main>

      <footer className="footer">
        <div className="footer-grid">
          <div><Link className="brand-logo footer-mark" href="/"><Image src="/alafrah-logo.png" alt="Al Afrah Technical" width={280} height={166} /></Link><p>Premium marble furniture and technical solutions tailored to your space and style.</p><div className="socials"><a href="https://www.facebook.com/alafrahtechnical" aria-label="Facebook">Facebook</a><a href="https://www.instagram.com/alarfahtechnical" aria-label="Instagram">Instagram</a></div></div>
          <div><h2>Shop</h2><Link href="/collections/coffee-tables">Coffee Tables</Link><Link href="/collections/dining-tables">Dining Tables</Link><Link href="/collections/marble-accessories">Accessories</Link><Link href="/custom-table">Custom Table</Link></div>
          <div><h2>Help</h2><Link href="/pages/contact">Contact</Link><Link href="/pages/shipping">Shipping</Link><Link href="/pages/returns">Returns</Link><Link href="/faqs">FAQs</Link></div>
          <div><h2>Newsletter</h2><p>Receive new collections and private offers.</p><form className="newsletter"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Email address" required /><button type="submit">Join</button></form></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Al Afrah Technical</span><span>Dubai, United Arab Emirates · VAT inclusive</span></div>
      </footer>
      <a className="whatsapp" href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000"}?text=${encodeURIComponent("Hello Al Afrah Technical, I’m interested in your marble furniture.")}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">WhatsApp</a>
    </>
  );
}
