"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Heart, Minus, Plus, ShieldCheck, Truck, Ruler, MessageCircle, Maximize2, Layers3, PencilRuler } from "lucide-react";
import type { ShopifyProduct } from "../lib/catalog";
import { hexForMaterial, stoneByName } from "../lib/stones";
import { ProductCard } from "./product/ProductCard";

export function ProductPurchase({ product, related = [] }: { product: ShopifyProduct; related?: ShopifyProduct[] }) {
  const router = useRouter();
  const variants = product.variants?.nodes ?? [];
  const initialVariant = variants.find((variant) => variant.availableForSale) ?? variants[0];
  const [variantId, setVariantId] = useState(initialVariant?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const images = product.images?.nodes?.length ? product.images.nodes : product.featuredImage ? [product.featuredImage] : [];
  const selectedVariant = variants.find((variant) => variant.id === variantId) ?? initialVariant;
  const materialOption = selectedVariant?.selectedOptions.find((option) => option.name.toLowerCase().includes("material"));
  const selectedTitleParts = selectedVariant?.title.split(/\s*\/\s*/) ?? [];
  const materialName = materialOption?.value
    ?? (selectedTitleParts.length > 1 ? selectedTitleParts[0] : undefined)
    ?? product.tags?.find((tag) => stoneByName(tag))
    ?? "Honed";
  const quantityAvailable = selectedVariant?.quantityAvailable;
  const lowStock = typeof quantityAvailable === "number" && quantityAvailable > 0 && quantityAvailable <= 5;
  const variantOptions = selectedVariant?.selectedOptions ?? [];
  const salePercent = selectedVariant?.compareAtPrice && Number(selectedVariant.compareAtPrice.amount) > Number(selectedVariant.price.amount)
    ? Math.round((1 - Number(selectedVariant.price.amount) / Number(selectedVariant.compareAtPrice.amount)) * 100)
    : 0;
  const variantDetails = (variant: (typeof variants)[number]) => {
    const titleParts = variant.title.split(/\s*\/\s*/);
    const material = variant.selectedOptions.find((option) => option.name.toLowerCase().includes("material"))?.value
      ?? (titleParts.length > 1 ? titleParts[0] : product.tags?.find((tag) => stoneByName(tag)))
      ?? "Natural stone";
    const configuration = titleParts.length > 1
      ? titleParts.slice(1).join(" / ")
      : variant.selectedOptions
          .filter((option) => !option.name.toLowerCase().includes("material") && option.value !== material)
          .map((option) => `${option.name}: ${option.value}`)
          .join(" · ");
    return { material, configuration };
  };

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
      if (action === "buy" && !data.cartId) {
        throw new Error("Shopify did not return a cart. Please try again.");
      }
      localStorage.setItem(
        "alafrah-cart",
        JSON.stringify({ id: data.cartId, checkoutUrl: data.checkoutUrl, totalQuantity: data.totalQuantity }),
      );
      window.dispatchEvent(new Event("alafrah-cart-updated"));
      if (action === "buy") {
        if (!data.checkoutUrl) throw new Error("Shopify did not return a checkout URL. Please try again.");
        window.location.assign(data.checkoutUrl);
      } else {
        router.push("/cart");
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
    <article className="product-page">
      <header className="product-heading rack">
        <nav className="span-12 product-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href="/collections">Collections</Link><span>/</span><span>{product.title}</span>
        </nav>
      </header>
      <div className="rack product-main">
        <div className="product-gallery span-7">
          {images.length > 1 && (
            <div className="product-thumbs">
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
                    loading={index < 5 ? "eager" : "lazy"}
                  />
                </button>
              ))}
            </div>
          )}
          {images[activeImage] ? (
            <div className="product-main-image">
              <Image
                src={images[activeImage].url}
                alt={images[activeImage].altText ?? product.title}
                width={images[activeImage].width ?? 1200}
                height={images[activeImage].height ?? 1500}
                sizes="(max-width:760px) 100vw, 58vw"
                priority
              />
              <button className="product-zoom" type="button" aria-label="Enlarge product image" onClick={() => setZoomOpen(true)}>
                <Maximize2 size={17} />
              </button>
            </div>
          ) : (
            <p>No photograph for this product yet.</p>
          )}
        </div>
        <div className="span-5 product-info">
          <div className="product-purchase-panel">
            <div className="product-kicker">
              <span>{product.vendor || "Al Afrah Technical"}</span>
              {salePercent > 0 && <span className="product-sale">Save {salePercent}%</span>}
            </div>
            <div className="product-title-row">
              <h1>{product.title}</h1>
              <button
                className={`product-heart${saved ? " is-saved" : ""}`}
                type="button"
                aria-label={saved ? "Remove from saved pieces" : "Save this piece"}
                aria-pressed={saved}
                onClick={() => setSaved((value) => !value)}
              >
                <Heart size={18} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
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
            <p className="product-vat">VAT included · Secure checkout</p>
            {lowStock && (
              <div className="stock-alert" role="status">
                <span className="stock-dot" />
                <strong>Only {quantityAvailable} left in this selected configuration</strong>
              </div>
            )}
            {!lowStock && product.availableForSale && (
              <div className="stock-ready"><span className="stock-dot" /> Available for order</div>
            )}
            <div className="product-short-description">
              {product.descriptionHtml ? (
                <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              ) : (
                <p>{product.description}</p>
              )}
            </div>
            {variants.length > 1 && (
              <fieldset className="product-options">
                <legend>Material & configuration</legend>
                <div className="variant-choice-grid">
                  {variants.map((variant) => {
                    const { material, configuration } = variantDetails(variant);
                    return (
                      <button
                        type="button"
                        key={variant.id}
                        className={`variant-choice${variant.id === variantId ? " is-selected" : ""}`}
                        aria-pressed={variant.id === variantId}
                        disabled={!variant.availableForSale}
                        onClick={() => selectVariant(variant.id)}
                      >
                        <span className="variant-choice-swatch" style={{ backgroundColor: hexForMaterial(material) }} />
                        <span className="variant-choice-copy">
                          <strong>{material}</strong>
                          {configuration && <small>{configuration}</small>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
            <div className="purchase-quantity">
              <span>Quantity</span>
              <div className="quantity-control">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                  <Minus size={16} />
                </button>
                <strong>{quantity}</strong>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="purchase-actions">
              <button className="btn btn-primary" type="button" disabled={busy || !product.availableForSale} onClick={() => submit("add")}>
                Add to cart
              </button>
              <a className="btn btn-outline" href={`/custom-table?product=${encodeURIComponent(product.handle)}`}>
                Request a custom size
              </a>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971558410712"}`} target="_blank" rel="noreferrer">
                Ask on WhatsApp
              </a>
            </div>
            {message && (
              <p className="purchase-message" role="status">{message}</p>
            )}
            <div className="purchase-assurances" aria-label="Purchase assurances">
              <span><ShieldCheck size={16} /> Secure checkout</span>
              <span><Ruler size={16} /> Made to fit</span>
              <span><Truck size={16} /> Dubai delivery support</span>
            </div>
          </div>
        </div>
      </div>
      <section className="product-benefits" aria-labelledby="product-benefits-title">
        <div className="product-benefits-heading">
          <p>Made with care, from workshop to home</p>
          <h2 id="product-benefits-title">Thoughtful details. Considered service.</h2>
        </div>
        <div><ShieldCheck size={22} /><span><strong>Premium stone</strong><small>Selected for lasting beauty</small></span></div>
        <div><Ruler size={22} /><span><strong>Custom sizing</strong><small>Made for your space</small></span></div>
        <div><Truck size={22} /><span><strong>Handled with care</strong><small>Delivery and placement support</small></span></div>
        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971558410712"}`} target="_blank" rel="noreferrer"><MessageCircle size={22} /><span><strong>Speak to a specialist</strong><small>Advice from the workshop</small></span></a>
      </section>
      <section className="product-material-story rack">
        <div className="span-5 product-story-image">
          {images[images.length > 1 ? 1 : 0] ? (
            <Image
              src={images[images.length > 1 ? 1 : 0].url}
              alt={images[images.length > 1 ? 1 : 0].altText ?? `${product.title} material detail`}
              width={images[images.length > 1 ? 1 : 0].width ?? 900}
              height={images[images.length > 1 ? 1 : 0].height ?? 1100}
              sizes="(max-width:899px) 100vw, 42vw"
            />
          ) : (
            <div className="product-story-placeholder" style={{ backgroundColor: hexForMaterial(materialName) }} />
          )}
        </div>
        <div className="span-7 product-story-copy">
          <p className="eyebrow">Material character</p>
          <h2>Natural stone, individually finished</h2>
          <p>
            Every slab carries its own movement, tone, and veining. Your selected {materialName !== "Honed" ? materialName : "stone"} piece
            is matched and finished by the workshop to bring that character into your interior.
          </p>
          <div className="material-points">
            <div><Layers3 size={20} /><span><strong>One-of-a-kind surface</strong><small>Natural variation is part of the beauty</small></span></div>
            <div><ShieldCheck size={20} /><span><strong>Workshop inspected</strong><small>Checked before it leaves our Dubai studio</small></span></div>
            <div><Ruler size={20} /><span><strong>Made to fit</strong><small>Dimensions confirmed with your project</small></span></div>
          </div>
        </div>
      </section>
      <section className="product-craft">
        <div className="product-craft-heading">
          <p className="eyebrow">From workshop to home</p>
          <h2>Crafted with care in three considered steps</h2>
        </div>
        <div className="product-craft-grid">
          <article><span>01</span><PencilRuler size={22} /><h3>Stone selection</h3><p>We review the selected material for tone, movement, and the intended finish.</p></article>
          <article><span>02</span><Layers3 size={22} /><h3>Precision finishing</h3><p>Each surface and edge is finished and checked by experienced hands.</p></article>
          <article><span>03</span><Truck size={22} /><h3>Handled for delivery</h3><p>The piece is prepared, protected, and coordinated for your Dubai location.</p></article>
        </div>
      </section>
      <section className="product-details rack">
        <div className="span-7 product-copy">
          <p className="eyebrow">Product details</p>
          <h2>Made for considered interiors</h2>
          {product.descriptionHtml ? (
            <div className="rich-product-description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          ) : (
            <p>{product.description || "This piece is selected and finished by the Al Afrah workshop for a precise, enduring interior."}</p>
          )}
          <div className="product-accordions">
            <details open>
              <summary><span>Specifications</span><ChevronDown size={18} /></summary>
              <table className="specs">
            <tbody>
              {[
                ["Material", materialName],
                ["Category", product.productType || "Stone furniture"],
                ["Collection", product.tags?.find((tag) => !stoneByName(tag)) || "Al Afrah collection"],
                ["Finish", variants.find((variant) => variant.id === variantId)?.selectedOptions.find((option) => option.name.toLowerCase().includes("finish"))?.value || "Workshop finish"],
                ["Selected options", variantOptions.map((option) => `${option.name}: ${option.value}`).join(", ") || "Standard configuration"],
                ["Availability", selectedVariant?.availableForSale ? "Available to order" : "Contact the workshop"],
              ].map(([label, value]) => (
                <tr key={label}><th>{label}</th><td>{value}</td></tr>
              ))}
            </tbody>
              </table>
            </details>
            <details>
              <summary><span>Care & maintenance</span><ChevronDown size={18} /></summary>
              <p>Clean with a soft cloth and a pH-neutral stone cleaner. Avoid acidic products, seal periodically if required by the stone, and use coasters beneath drinks.</p>
            </details>
            <details>
              <summary><span>Delivery & installation</span><ChevronDown size={18} /></summary>
              <p>Delivery timing, placement, and installation requirements are confirmed by the workshop for your exact address and piece.</p>
            </details>
            <details>
              <summary><span>Custom dimensions</span><ChevronDown size={18} /></summary>
              <p><Link href={`/custom-table?product=${encodeURIComponent(product.handle)}`}>Request made-to-order dimensions</Link> and the workshop will advise on feasibility and pricing.</p>
            </details>
          </div>
        </div>
        <aside className="span-5 product-consult">
          <p className="eyebrow">Workshop consultation</p>
          <h3>Planning a complete interior?</h3>
          <p>Share your room dimensions, stone preference, and delivery location for tailored guidance.</p>
          <Link className="btn btn-primary" href={`/custom-table?product=${encodeURIComponent(product.handle)}`}>Start a consultation</Link>
        </aside>
      </section>
      {related.length > 0 && (
        <section className="product-upsell">
          <div className="product-upsell-heading"><div><p className="eyebrow">Complete the room</p><h2>You may also like</h2></div><Link href="/collections">View all pieces</Link></div>
          <div className="product-grid">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
      <section className="product-size-cta">
        <div>
          <p className="eyebrow">A precise fit matters</p>
          <h2>Need another size or stone?</h2>
        </div>
        <Link className="btn btn-outline" href={`/custom-table?product=${encodeURIComponent(product.handle)}`}>
          Design a made-to-order piece
        </Link>
      </section>
      {zoomOpen && images[activeImage] && (
        <div className="product-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged product image" onClick={() => setZoomOpen(false)}>
          <button type="button" aria-label="Close enlarged image" onClick={() => setZoomOpen(false)}>Close</button>
          <Image
            src={images[activeImage].url}
            alt={images[activeImage].altText ?? product.title}
            width={images[activeImage].width ?? 1600}
            height={images[activeImage].height ?? 1800}
            sizes="90vw"
          />
        </div>
      )}
    </article>
  );
}
