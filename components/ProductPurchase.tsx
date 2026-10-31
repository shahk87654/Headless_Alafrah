"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ShopifyProduct } from "../lib/catalog";
import { inkOn } from "../lib/contrast";
import { hexForMaterial, stoneByName } from "../lib/stones";

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
  const materialOption = selectedVariant?.selectedOptions.find((option) => option.name.toLowerCase().includes("material"));
  const materialName = materialOption?.value ?? product.tags?.find((tag) => stoneByName(tag)) ?? "Honed";
  const headerColor = hexForMaterial(materialName);
  const headerText = inkOn(headerColor);
  const materialOptions = [
    ...new Map(
      variants.flatMap((variant) =>
        variant.selectedOptions
          .filter((option) => option.name.toLowerCase().includes("material"))
          .map((option) => [option.value, option.value] as const),
      ),
    ).keys(),
  ];
  const textureImage = selectedVariant?.image?.url ?? images[0]?.url;

  useEffect(() => {
    document.body.classList.add("has-sticky-atc");
    return () => document.body.classList.remove("has-sticky-atc");
  }, []);

  function selectVariant(variantIdValue: string) {
    setVariantId(variantIdValue);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", variantIdValue);
    window.history.replaceState({}, "", url);
    const variant = variants.find((item) => item.id === variantIdValue);
    if (variant?.image?.url) {
      const index = images.findIndex((image) => image.url === variant.image?.url);
      if (index >= 0) setActiveImage(index);
    }
  }

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
      <header className="header-band rack" style={{ backgroundColor: headerColor, color: headerText }}>
        <nav className="span-12 crumb" aria-label="Breadcrumb">
          <Link href="/collections">Collections</Link> / <span>{product.title}</span>
        </nav>
        <h1 className="span-12">{product.title}</h1>
      </header>
      <div className="rack section">
      <div className="gallery span-7">
        {images.length > 1 && (
          <div className="thumbs">
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
      </div>
      <div className="span-5 stack product-info">
        <h2 className="sr-only">{product.title}</h2>
        <p className="product-price">
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
                  onChange={() => selectVariant(variant.id)}
                />
                <span>{variant.title}</span>
              </label>
            ))}
          </fieldset>
        )}
        {materialOptions.length > 0 && (
          <fieldset>
            <legend>Material</legend>
            <div className="cluster">
              {variants.filter((variant) => variant.availableForSale).map((variant) => {
                const option = variant.selectedOptions.find((item) => item.name.toLowerCase().includes("material"));
                if (!option) return null;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    className={`swatch${variant.id === variantId ? " is-selected" : ""}`}
                    aria-pressed={variant.id === variantId}
                    onClick={() => selectVariant(variant.id)}
                  >
                    <span className="swatch-face" style={{ backgroundColor: hexForMaterial(option.value) }} />
                    <span>{option.value}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
        <div className="cluster">
          <span>Quantity</span>
          <div className="quantity-control">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            −
          </button>
          <strong>{quantity}</strong>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}>
            +
          </button>
          </div>
        </div>
        <div className="stack">
          <button className="btn btn-primary" type="button" disabled={busy || !product.availableForSale} onClick={() => submit("add")}>
            Add to cart
          </button>
          <a className="btn btn-outline" href={`/custom-table?product=${encodeURIComponent(product.handle)}`}>
            Request a custom size
          </a>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000"}`} target="_blank" rel="noreferrer">
            Ask on WhatsApp
          </a>
        </div>
        {message && (
          <p role="status">{message}</p>
        )}
      </div>
      </div>
      <div className="sticky-atc" aria-label="Add to cart">
        <strong className="tabular">{price}</strong>
        <button className="btn btn-primary" type="button" disabled={busy || !product.availableForSale} onClick={() => submit("add")}>
          Add to cart
        </button>
      </div>
      <div className="texture-strip">
        {textureImage ? (
          <Image src={textureImage} alt={`${materialName} stone texture for ${product.title}`} fill sizes="100vw" />
        ) : (
          <span className="flat">{materialName}</span>
        )}
      </div>
      <section className="section rack">
        <div className="span-6 specs">
          <h2>Specifications</h2>
          <table>
            <tbody>
              {["Material", "Finish", "Origin", "Weight", "Thickness", "Dimensions", "Lead time"].map((label) => (
                <tr key={label}><th>{label}</th><td>Confirmed by the workshop</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="span-5 col-start-7 stack">
          <h2>Care and delivery</h2>
          <p>Wipe with a soft cloth and pH-neutral stone cleaner. Use coasters on polished surfaces. Delivery and installation are confirmed for the final address.</p>
        </div>
      </section>
    </article>
  );
}
