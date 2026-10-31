import Image from "next/image";
import Link from "next/link";
import { formatAED, searchProducts } from "../../../lib/catalog";

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string; after?: string }> }) {
  const { q = "", after } = await searchParams;
  const result = q
    ? await searchProducts(q, 24, after).catch(() => ({ products: [], pageInfo: { hasNextPage: false, endCursor: null } }))
    : { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  const nextUrl =
    result.pageInfo.hasNextPage && result.pageInfo.endCursor
      ? `/search?q=${encodeURIComponent(q)}&after=${encodeURIComponent(result.pageInfo.endCursor)}`
      : null;

  return (
    <section className="section rack">
      <h1>{q ? `${result.products.length} results for ‘${q}’` : "Search"}</h1>
      <form className="span-12 field" action="/search">
        <label className="sr-only" htmlFor="q">
          Search
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="Search tables, materials, accessories" />
        <button type="submit">Search</button>
      </form>
      {q && result.products.length === 0 && (
        <div className="span-12 stack">
          <p>No products match that search. Try a stone name, or request a custom piece.</p>
          <Link href="/collections/coffee-tables">Coffee tables</Link>
          <Link href="/collections/dining-tables">Dining tables</Link>
          <Link href="/collections/travertine-marble">Travertine</Link>
          <Link href="/custom-table">Request a custom piece</Link>
        </div>
      )}
      <ul className="span-12 product-grid">
        {result.products.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.handle}`}>
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  width={product.featuredImage.width ?? 800}
                  height={product.featuredImage.height ?? 1000}
                  sizes="(max-width:760px) 50vw, 25vw"
                />
              ) : null}
              <h2>{product.title}</h2>
              <p>{formatAED(product.priceRange.minVariantPrice.amount)}</p>
            </Link>
          </li>
        ))}
      </ul>
      {nextUrl && (
        <nav aria-label="Search pagination">
          <Link href={nextUrl}>Load more</Link>
        </nav>
      )}
    </section>
  );
}
