"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ShopifyProduct } from "../../lib/catalog";
import { formatPrice, savePercent } from "../../lib/money";
import { hexForMaterial, stoneByName } from "../../lib/stones";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const [hover, setHover] = useState(false);
  const images = product.images?.nodes?.length
    ? product.images.nodes
    : product.featuredImage
      ? [product.featuredImage]
      : [];
  const second = images[1];
  const showSecond = hover && Boolean(second);
  const price = product.priceRange.minVariantPrice;
  const compare = product.variants?.nodes.find(
    (variant) => variant.compareAtPrice && Number(variant.compareAtPrice.amount) > Number(variant.price.amount),
  )?.compareAtPrice;
  const percent = compare ? savePercent(price.amount, compare.amount) : null;
  const materials = [
    ...new Set(
      (product.variants?.nodes ?? [])
        .flatMap((variant) => variant.selectedOptions.filter((option) => option.name.toLowerCase().includes("material")).map((option) => option.value))
        .concat((product.tags ?? []).filter((tag) => stoneByName(tag))),
    ),
  ];
  const extra = Math.max(0, materials.length - 5);
  const visible = materials.slice(0, 5);

  return (
    <Link
      className="product-card"
      href={`/products/${product.handle}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="slab-media ratio-45">
        {images[0] ? (
          <Image
            src={showSecond && second ? second.url : images[0].url}
            alt={(showSecond && second ? second.altText : images[0].altText) ?? product.title}
            fill
            sizes="(max-width: 760px) 50vw, 25vw"
          />
        ) : (
          <span className="sr-only">No photograph</span>
        )}
      </div>
      <h3>{product.title}</h3>
      <p className="tabular">
        {percent ? <span className="sale">{formatPrice(price.amount, price.currencyCode)}</span> : formatPrice(price.amount, price.currencyCode)}
        {compare && percent ? (
          <>
            {" "}
            <s>{formatPrice(compare.amount, compare.currencyCode)}</s> Save {percent}%
          </>
        ) : null}
      </p>
      {visible.length > 0 && (
        <span className="dots" aria-label="Available materials">
          {visible.map((name) => (
            <i key={name} style={{ background: hexForMaterial(name) }} title={name} />
          ))}
          {extra > 0 && <span>+{extra}</span>}
        </span>
      )}
    </Link>
  );
}
