"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  async function loadCart() {
    const saved = JSON.parse(localStorage.getItem("alafrah-cart") ?? "null") as { id?: string } | null;
    if (!saved?.id) {
      setCart(null);
      setLoading(false);
      return;
    }
    const response = await fetch(`/api/cart?id=${encodeURIComponent(saved.id)}`);
    const data = await response.json();
    setCart(data.cart);
    setLoading(false);
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
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: quantity < 1 ? "remove" : "update", cartId: saved.id, lineId, quantity }),
    });
    const data = await response.json();
    if (data.error) return;
    localStorage.setItem(
      "alafrah-cart",
      JSON.stringify({ id: data.cartId, checkoutUrl: data.checkoutUrl, totalQuantity: data.totalQuantity }),
    );
    window.dispatchEvent(new Event("alafrah-cart-updated"));
    await loadCart();
  }

  if (loading) return <section><p>Loading cart</p></section>;
  if (!cart?.lines?.length) {
    return (
      <section>
        <h1>Your cart is empty</h1>
        <p>Browse coffee tables, or design a custom table.</p>
        <Link href="/collections/coffee-tables">Browse coffee tables</Link>
        <Link href="/custom-table">Design a custom table</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Cart</h1>
      <ul>
        {cart.lines.map((line) => (
          <li key={line.id}>
            {line.merchandise.product.featuredImage ? (
              <Image
                src={line.merchandise.product.featuredImage.url}
                alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                width={160}
                height={200}
              />
            ) : null}
            <Link href={`/products/${line.merchandise.product.handle}`}>{line.merchandise.product.title}</Link>
            <p>{line.merchandise.title}</p>
            <p>
              {new Intl.NumberFormat("en-AE", {
                style: "currency",
                currency: line.merchandise.price.currencyCode,
                minimumFractionDigits: 0,
              }).format(Number(line.merchandise.price.amount))}
            </p>
            <button type="button" onClick={() => updateLine(line.id, line.quantity - 1)} aria-label="Decrease quantity">
              −
            </button>
            <span>{line.quantity}</span>
            <button type="button" onClick={() => updateLine(line.id, line.quantity + 1)} aria-label="Increase quantity">
              +
            </button>
            <button type="button" onClick={() => updateLine(line.id, 0)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <aside>
        <p>{cart.totalQuantity} items</p>
        <p>Shipping and VAT are finalized at checkout.</p>
        <a href={cart.checkoutUrl}>Checkout</a>
      </aside>
    </section>
  );
}
