"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";

type CartLine = {
  id: string;
  quantity: number;
  cost?: {
    amountPerQuantity: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  merchandise: {
    title: string;
    product: { title: string; handle: string; featuredImage?: { url: string; altText?: string | null } | null };
    price: { amount: string; currencyCode: string };
  };
};

type CartState = {
  id: string;
  checkoutUrl: string | null;
  checkoutError?: string;
  totalQuantity: number;
  cost?: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
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
      if (!data.cart) {
        localStorage.removeItem("alafrah-cart");
        window.dispatchEvent(new Event("alafrah-cart-updated"));
        setCart(null);
      } else {
        setCart(data.cart);
      }
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
    setCart((current) => {
      if (!current) return current;
      const lines = quantity < 1
        ? current.lines.filter((line) => line.id !== lineId)
        : current.lines.map((line) => {
            if (line.id !== lineId) return line;
            const unitAmount = line.cost?.amountPerQuantity.amount ?? line.merchandise.price.amount;
            const currencyCode = line.cost?.amountPerQuantity.currencyCode ?? line.merchandise.price.currencyCode;
            return {
              ...line,
              quantity,
              cost: {
                amountPerQuantity: { amount: unitAmount, currencyCode },
                totalAmount: { amount: String(Number(unitAmount) * quantity), currencyCode },
              },
            };
          });
      const subtotalAmount = lines.reduce((sum, line) => {
        const amount = line.cost?.totalAmount.amount ?? String(Number(line.merchandise.price.amount) * line.quantity);
        return sum + Number(amount);
      }, 0);
      const currencyCode = current.cost?.subtotalAmount.currencyCode ?? lines[0]?.cost?.totalAmount.currencyCode ?? lines[0]?.merchandise.price.currencyCode ?? "AED";
      return {
        ...current,
        lines,
        totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
        cost: {
          subtotalAmount: { amount: String(subtotalAmount), currencyCode },
          totalAmount: { amount: String(subtotalAmount), currencyCode },
        },
      };
    });
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
      if (data.lines && data.cost) {
        setCart((current) => current ? {
          ...current,
          id: data.cartId,
          checkoutUrl: data.checkoutUrl,
          checkoutError: data.checkoutError,
          totalQuantity: data.totalQuantity,
          cost: data.cost,
          lines: data.lines,
        } : current);
      }
      await loadCart();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "This item could not be updated.");
      await loadCart();
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

  const currency = cart.cost?.subtotalAmount.currencyCode ?? cart.lines[0]?.cost?.totalAmount.currencyCode ?? cart.lines[0]?.merchandise.price.currencyCode ?? "AED";
  const subtotal = cart.cost?.subtotalAmount
    ? Number(cart.cost.subtotalAmount.amount)
    : cart.lines.reduce(
        (sum, line) => sum + Number(line.merchandise.price.amount) * line.quantity,
        0,
      );
  const vat = subtotal * 0.05;
  const total = subtotal + vat;
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
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
                    <p className="cart-line-unit-price">
                      {formatPrice(Number(line.cost?.amountPerQuantity.amount ?? line.merchandise.price.amount))} each
                    </p>
                  </div>
                  <strong>{formatPrice(Number(line.cost?.totalAmount.amount ?? (Number(line.merchandise.price.amount) * line.quantity)))}</strong>
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
            <p><span>Delivery fee</span><strong>At checkout</strong></p>
            <p><span>VAT (5%)</span><strong>{formatPrice(vat)}</strong></p>
          </div>
          <div className="cart-summary-total cart-summary-grand-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          {cart.checkoutUrl ? (
            <a className="cart-primary-action cart-checkout" href={`/checkout?cartId=${encodeURIComponent(cart.id)}`}>
              Secure checkout <ArrowRight size={18} />
            </a>
          ) : (
            <p className="cart-checkout-error" role="alert">
              {cart.checkoutError ?? "Secure checkout is temporarily unavailable. Please contact the workshop."}
            </p>
          )}
          <p className="cart-secure"><LockKeyhole size={14} /> Encrypted and secure payment</p>
          <div className="cart-delivery-note">
            <Truck size={19} aria-hidden="true" />
            <div>
              <strong>Delivery, arranged for your piece</strong>
              <p>Our workshop confirms timing and installation for your address and selected piece. Delivery fees are shown at checkout.</p>
              <Link href="/faqs#faq-list">Delivery & payment policy <ArrowRight size={14} /></Link>
            </div>
          </div>
          <p className="cart-assistance">Need help choosing or arranging delivery?<br /><Link href="/pages/contact">Speak with our workshop</Link></p>
        </aside>
      </div>
    </section>
  );
}
