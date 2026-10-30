"use client";

import Image from "next/image";
import { useState } from "react";
import type { ShopifyProduct } from "../lib/catalog";

export function ProductPurchase({ product }: { product: ShopifyProduct }) {
  const variants = product.variants?.nodes ?? [];
  const initialVariant = variants.find((variant) => variant.availableForSale) ?? variants[0];
  const [variantId, setVariantId] = useState(initialVariant?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const images = product.images?.nodes?.length ? product.images.nodes : product.featuredImage ? [product.featuredImage] : [];
  const selectedVariant = variants.find((variant) => variant.id === variantId) ?? initialVariant;

  async function submit(action: "add" | "buy") {
    if (!variantId) {
      setMessage("This product has no available variant.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const savedCart = JSON.parse(localStorage.getItem("alafrah-cart") ?? "null") as { id?: string } | null;
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, variantId, quantity, cartId: savedCart?.id }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error ?? "Unable to update the cart.");
      localStorage.setItem("alafrah-cart", JSON.stringify({ id: data.cartId, checkoutUrl: data.checkoutUrl, totalQuantity: data.totalQuantity }));
      window.dispatchEvent(new Event("alafrah-cart-updated"));
      if (action === "buy") {
        window.location.assign(data.checkoutUrl);
      } else {
        setMessage("Added to cart.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update the cart.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="product-detail">
      <div className="product-detail-gallery">
        {images[activeImage] ? <Image src={images[activeImage].url} alt={images[activeImage].altText ?? product.title} fill sizes="(max-width:760px) 100vw,60vw" priority /> : <div className="product-placeholder">Al Afrah</div>}
        {images.length > 1 && <div className="product-gallery-thumbs">{images.map((image, index) => <button type="button" key={`${image.url}-${index}`} className={activeImage === index ? "active" : ""} onClick={() => setActiveImage(index)} aria-label={`View image ${index + 1}`}><Image src={image.url} alt={image.altText ?? `${product.title} view ${index + 1}`} fill sizes="72px" /></button>)}</div>}
      </div>
      <div className="product-detail-info">
        <p className="eyebrow">{product.vendor ?? "Al Afrah Technical"}</p>
        <h1>{product.title}</h1>
        <div className="product-detail-price">{selectedVariant && <><span>{new Intl.NumberFormat("en-AE", { style: "currency", currency: selectedVariant.price.currencyCode, minimumFractionDigits: 2 }).format(Number(selectedVariant.price.amount))}</span>{selectedVariant.compareAtPrice && Number(selectedVariant.compareAtPrice.amount) > Number(selectedVariant.price.amount) && <del>{new Intl.NumberFormat("en-AE", { style: "currency", currency: selectedVariant.compareAtPrice.currencyCode, minimumFractionDigits: 2 }).format(Number(selectedVariant.compareAtPrice.amount))}</del>}</>}</div>
        <p className="vat-note">AED · VAT inclusive where applicable</p>
        {product.descriptionHtml ? <div className="product-description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} /> : <p className="product-description">{product.description}</p>}
        {variants.length > 0 && <fieldset className="product-variants"><legend>Options</legend>{variants.map((variant) => <label className={variant.id === variantId ? "active" : ""} key={variant.id}>        <input type="radio" name="variant" value={variant.id} checked={variant.id === variantId} disabled={!variant.availableForSale} onChange={() => { setVariantId(variant.id); if (variant.image?.url) { const index = images.findIndex((image) => image.url === variant.image?.url); if (index >= 0) setActiveImage(index); } }} /><span>{variant.title}</span>{variants.length === 1 && variant.price.currencyCode === "AED" && <strong>{new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 2 }).format(Number(variant.price.amount))}</strong>}</label>)}</fieldset>}
        <div className="product-quantity"><span>Quantity</span><div><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><strong>{quantity}</strong><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}>+</button></div></div>
        <div className="product-actions"><button className="button button-outline-dark" type="button" disabled={busy || !product.availableForSale} onClick={() => submit("add")}>Add to Cart</button><button className="button button-dark" type="button" disabled={busy || !product.availableForSale} onClick={() => submit("buy")}>Buy Now</button></div>
        {message && <p className="product-action-message" role="status">{message}</p>}
      </div>
    </div>
  );
}
