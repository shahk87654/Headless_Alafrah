"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    title: string;
    product: { title: string; handle: string; featuredImage?: { url: string; altText?: string | null } | null };
    price: { amount: string; currencyCode: string };
  };
};

type CartState = {
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
};

export default function Cart() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyLineId, setBusyLineId] = useState("");

  async function loadCart() {
    const saved = JSON.parse(localStorage.getItem("alafrah-cart") ?? "null") as { id?: string } | null;
    if (!saved?.id) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/cart?id=${encodeURIComponent(saved.id)}`);
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error ?? "Your cart could not be loaded. Refresh the page or try again.");
      setCart(data.cart);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Your cart could not be loaded. Refresh the page or try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void loadCart();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function updateLine(lineId: string, quantity: number) {
    const saved = JSON.parse(localStorage.getItem("alafrah-cart") ?? "null") as { id?: string } | null;
    if (!saved?.id) return;
    setBusyLineId(lineId);
    setError("");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: quantity < 1 ? "remove" : "update", cartId: saved.id, lineId, quantity }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error ?? "This item could not be updated.");
      localStorage.setItem(
        "alafrah-cart",
        JSON.stringify({ id: data.cartId, checkoutUrl: data.checkoutUrl, totalQuantity: data.totalQuantity }),
      );
      window.dispatchEvent(new Event("alafrah-cart-updated"));
      await loadCart();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "This item could not be updated.");
    } finally {
      setBusyLineId("");
    }
  }

  if (loading) return (
    <section className="cart-page cart-loading" aria-live="polite">
      <div className="cart-loading-line"><span /><span /></div>
      <p>Preparing your selection</p>
    </section>
  );
  if (error) return (
    <section className="cart-state">
      <div className="cart-state-icon"><ShoppingBag size={28} /></div>
      <p className="eyebrow">Shopping bag</p>
      <h1>Something interrupted your cart</h1>
      <p>{error}</p>
      <button className="cart-primary-action" type="button" onClick={() => { setLoading(true); void loadCart(); }}>
        Try again <ArrowRight size={17} />
      </button>
    </section>
  );
  if (!cart?.lines?.length) {
    return (
      <section className="cart-empty">
        <div className="cart-empty-copy">
          <p className="eyebrow">Shopping bag</p>
          <h1>Your selection is waiting.</h1>
          <p>Discover pieces shaped in natural stone, or begin with a table designed around your space.</p>
          <div className="cart-empty-actions">
            <Link className="cart-primary-action" href="/collections">Explore collections <ArrowRight size={17} /></Link>
            <Link className="cart-secondary-action" href="/custom-table">Design a custom table</Link>
          </div>
        </div>
        <div className="cart-empty-art" aria-hidden="true">
          <div className="cart-stone-slab" />
        </div>
      </section>
    );
  }

  const currency = cart.lines[0]?.merchandise.price.currencyCode ?? "AED";
  const subtotal = cart.lines.reduce(
    (sum, line) => sum + Number(line.merchandise.price.amount) * line.quantity,
    0,
  );
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="cart-page">
      <header className="cart-heading">
        <div>
          <p className="eyebrow">Your selection</p>
          <h1>Shopping bag <span>{cart.totalQuantity}</span></h1>
        </div>
        <Link className="cart-back-link" href="/collections"><ArrowLeft size={16} /> Continue shopping</Link>
      </header>

      <div className="cart-layout">
        <ul className="cart-lines" aria-label="Cart items">
          {cart.lines.map((line) => (
            <li className="cart-line" key={line.id}>
              <Link className="cart-line-image" href={`/products/${line.merchandise.product.handle}`}>
                {line.merchandise.product.featuredImage ? (
                  <Image
                    src={line.merchandise.product.featuredImage.url}
                    alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                    width={190}
                    height={220}
                  />
                ) : <ShoppingBag size={28} />}
              </Link>

              <div className="cart-line-main">
                <div className="cart-line-title">
                  <div>
                    <Link href={`/products/${line.merchandise.product.handle}`}>{line.merchandise.product.title}</Link>
                    {line.merchandise.title !== "Default Title" && <p>{line.merchandise.title}</p>}
                  </div>
                  <strong>{formatPrice(Number(line.merchandise.price.amount) * line.quantity)}</strong>
                </div>

                <div className="cart-line-actions">
                  <div className="cart-quantity" aria-label="Quantity">
                    <button type="button" disabled={busyLineId === line.id} onClick={() => updateLine(line.id, line.quantity - 1)} aria-label="Decrease quantity">
                      <Minus size={15} />
                    </button>
                    <span aria-live="polite">{line.quantity}</span>
                    <button type="button" disabled={busyLineId === line.id} onClick={() => updateLine(line.id, line.quantity + 1)} aria-label="Increase quantity">
                      <Plus size={15} />
                    </button>
                  </div>
                  <button className="cart-remove" type="button" disabled={busyLineId === line.id} onClick={() => updateLine(line.id, 0)}>
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <p className="eyebrow">Order summary</p>
          <div className="cart-summary-total">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className="cart-summary-details">
            <p><span>Delivery</span><strong>Calculated at checkout</strong></p>
            <p><span>VAT</span><strong>Included</strong></p>
          </div>

          <a className="cart-primary-action cart-checkout" href={cart.checkoutUrl}>
            Secure checkout <ArrowRight size={18} />
          </a>
          <p className="cart-secure"><LockKeyhole size={14} /> Encrypted and secure payment</p>
          <p className="cart-assistance">Need help choosing or arranging delivery?<br /><Link href="/pages/contact">Speak with our workshop</Link></p>
        </aside>
      </div>
    </section>
  );
}
