"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    const saved = JSON.parse(localStorage.getItem("alafrah-cart") ?? "null") as { id?: string } | null;
    if (!saved?.id) { setCart(null); setLoading(false); return; }
    const response = await fetch(`/api/cart?id=${encodeURIComponent(saved.id)}`);
    const data = await response.json();
    setCart(data.cart);
    setLoading(false);
  }

  useEffect(() => { loadCart(); }, []);

  async function updateLine(lineId: string, quantity: number) {
    const saved = JSON.parse(localStorage.getItem("alafrah-cart") ?? "null") as { id?: string } | null;
    if (!saved?.id) return;
    const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: quantity < 1 ? "remove" : "update", cartId: saved.id, lineId, quantity }) });
    const data = await response.json();
    if (data.error) return;
    localStorage.setItem("alafrah-cart", JSON.stringify({ id: data.cartId, checkoutUrl: data.checkoutUrl, totalQuantity: data.totalQuantity }));
    window.dispatchEvent(new Event("alafrah-cart-updated"));
    await loadCart();
  }

  if (loading) return <section className="cart-page"><p>Loading cart…</p></section>;
  if (!cart?.lines?.length) return <section className="cart-page"><p className="eyebrow">Your cart</p><h1>Your cart is empty</h1><Link className="button button-dark" href="/collections">Continue shopping</Link></section>;

  return <section className="cart-page"><div><p className="eyebrow">Your cart</p><h1>Shopping Cart</h1></div><div className="cart-layout"><div className="cart-lines">{cart.lines.map((line: any) => <article className="cart-line" key={line.id}><div className="cart-line-image">{line.merchandise.product.featuredImage ? <Image src={line.merchandise.product.featuredImage.url} alt={line.merchandise.product.title} fill sizes="120px" /> : null}</div><div className="cart-line-info"><Link href={`/products/${line.merchandise.product.handle}`}>{line.merchandise.product.title}</Link><span>{line.merchandise.title}</span><strong>{new Intl.NumberFormat("en-AE", { style: "currency", currency: line.merchandise.price.currencyCode, minimumFractionDigits: 2 }).format(Number(line.merchandise.price.amount))}</strong></div><div className="cart-line-actions"><button type="button" onClick={() => updateLine(line.id, line.quantity - 1)}>−</button><strong>{line.quantity}</strong><button type="button" onClick={() => updateLine(line.id, line.quantity + 1)}>+</button><button className="cart-remove" type="button" onClick={() => updateLine(line.id, 0)}>Remove</button></div></article>)}</div><aside className="cart-summary"><p>Items</p><h2>{cart.totalQuantity}</h2><a className="button button-dark" href={cart.checkoutUrl}>Proceed to Shopify Checkout</a></aside></div></section>;
}
