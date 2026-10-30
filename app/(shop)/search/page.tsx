import Image from "next/image";
import Link from "next/link";
import { formatAED, searchProducts } from "../../../lib/catalog";

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string; after?: string }> }) {
  const { q = "", after } = await searchParams;
  const result = q ? await searchProducts(q, 24, after).catch(() => ({ products: [], pageInfo: { hasNextPage: false, endCursor: null } })) : { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  const nextUrl = result.pageInfo.hasNextPage && result.pageInfo.endCursor ? `/search?q=${encodeURIComponent(q)}&after=${encodeURIComponent(result.pageInfo.endCursor)}` : null;

  return <section className="section"><p className="eyebrow">Search the collection</p><h1 style={{ fontFamily: "Georgia,serif", fontSize: "58px", fontWeight: 400 }}>{q ? `Results for “${q}”` : "Search"}</h1><form action="/search" className="search-page-form"><label className="sr-only" htmlFor="q">Search</label><input id="q" name="q" defaultValue={q} placeholder="Search tables, materials, accessories" /><button className="button button-dark">Search</button></form>{q && <p className="search-results-count">{result.products.length} results from Shopify</p>}<div className="product-card-grid">{result.products.map((product) => <Link className="shopify-product-card" key={product.id} href={`/products/${product.handle}`}><div className="shopify-product-image">{product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} fill sizes="(max-width:760px) 50vw,25vw" /> : <span className="product-placeholder">Al Afrah</span>}</div><div className="shopify-product-meta"><span>{product.availableForSale ? "Available" : "Made to order"}</span><h3>{product.title}</h3><strong>{formatAED(product.priceRange.minVariantPrice.amount)}</strong></div></Link>)}</div>{nextUrl && <nav className="pagination" aria-label="Search pagination"><Link href={nextUrl}>Next</Link></nav>}</section>;
}

