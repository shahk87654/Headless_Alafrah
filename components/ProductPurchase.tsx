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
      if (!response.ok || data.error) throw new Error(data.error ?? "The cart could not be updated. Try again.");
      localStorage.setItem(
        "alafrah-cart",
        JSON.stringify({ id: data.cartId, checkoutUrl: data.checkoutUrl, totalQuantity: data.totalQuantity }),
      );
      window.dispatchEvent(new Event("alafrah-cart-updated"));
      if (action === "buy") {
        window.location.assign(data.checkoutUrl);
      } else {
        setMessage("Added to cart");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The cart could not be updated. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const price = selectedVariant
    ? new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: selectedVariant.price.currencyCode,
        minimumFractionDigits: 0,
      }).format(Number(selectedVariant.price.amount))
    : "";

  return (
    <article>
      <div>
        {images[activeImage] ? (
          <Image
            src={images[activeImage].url}
            alt={images[activeImage].altText ?? product.title}
            width={images[activeImage].width ?? 1200}
            height={images[activeImage].height ?? 1500}
            sizes="(max-width:760px) 100vw, 58vw"
            priority
          />
        ) : (
          <p>No photograph for this product yet.</p>
        )}
        {images.length > 1 && (
          <div>
            {images.map((image, index) => (
              <button
                type="button"
                key={`${image.url}-${index}`}
                aria-pressed={activeImage === index}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? `${product.title} view ${index + 1}`}
                  width={72}
                  height={90}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <h1>{product.title}</h1>
        <p>
          {price}
          {selectedVariant?.compareAtPrice &&
            Number(selectedVariant.compareAtPrice.amount) > Number(selectedVariant.price.amount) && (
              <s>
                {new Intl.NumberFormat("en-AE", {
                  style: "currency",
                  currency: selectedVariant.compareAtPrice.currencyCode,
                  minimumFractionDigits: 0,
                }).format(Number(selectedVariant.compareAtPrice.amount))}
              </s>
            )}
        </p>
        <p>Includes 5% VAT</p>
        {product.descriptionHtml ? (
          <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        ) : (
          <p>{product.description}</p>
        )}
        {variants.length > 0 && (
          <fieldset>
            <legend>Options</legend>
            {variants.map((variant) => (
              <label key={variant.id}>
                <input
                  type="radio"
                  name="variant"
                  value={variant.id}
                  checked={variant.id === variantId}
                  disabled={!variant.availableForSale}
                  onChange={() => {
                    setVariantId(variant.id);
                    if (variant.image?.url) {
                      const index = images.findIndex((image) => image.url === variant.image?.url);
                      if (index >= 0) setActiveImage(index);
                    }
                  }}
                />
                <span>{variant.title}</span>
              </label>
            ))}
          </fieldset>
        )}
        <div>
          <span>Quantity</span>
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            −
          </button>
          <strong>{quantity}</strong>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}>
            +
          </button>
        </div>
        <div>
          <button type="button" disabled={busy || !product.availableForSale} onClick={() => submit("add")}>
            Add to cart
          </button>
          <button type="button" disabled={busy || !product.availableForSale} onClick={() => submit("buy")}>
            Checkout
          </button>
        </div>
        {message && (
          <p role="status">{message}</p>
        )}
      </div>
    </article>
  );
}
