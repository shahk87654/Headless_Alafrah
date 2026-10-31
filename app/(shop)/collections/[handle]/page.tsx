import Image from "next/image";
import Link from "next/link";
import { getCollection, type ShopifyProduct } from "../../../../lib/catalog";
import { ProductCard } from "../../../../components/product/ProductCard";

export const revalidate = 300;

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{
    sort?: string;
    availability?: string;
    vendor?: string;
    type?: string;
    tag?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const { handle } = await params;
  const filters = await searchParams;
  const { collection } = await getCollection(handle, 250);
  if (!collection) {
    return (
      <section>
        <h1>That collection is not on the store</h1>
        <p>It may have been renamed. Browse all collections or ask for a custom piece.</p>
        <Link href="/collections">View all collections</Link>
      </section>
    );
  }

  const allProducts = collection.products.nodes;
  const vendors = [...new Set(allProducts.map((product) => product.vendor).filter(Boolean))] as string[];
  const types = [...new Set(allProducts.map((product) => product.productType).filter(Boolean))];
  const tags = [...new Set(allProducts.flatMap((product) => product.tags ?? []).filter(Boolean))].sort();

  let filtered = allProducts.filter((product) => {
    if (filters.availability === "available" && !product.availableForSale) return false;
    if (filters.availability === "unavailable" && product.availableForSale) return false;
    if (filters.vendor && product.vendor !== filters.vendor) return false;
    if (filters.type && product.productType !== filters.type) return false;
    if (filters.tag && !(product.tags ?? []).includes(filters.tag)) return false;
    if (filters.q) {
      const haystack = `${product.title} ${product.description} ${product.vendor ?? ""} ${product.productType ?? ""} ${(product.tags ?? []).join(" ")}`.toLowerCase();
      if (!haystack.includes(filters.q.toLowerCase())) return false;
    }
    return true;
  });

  filtered = [...filtered].sort((a: ShopifyProduct, b: ShopifyProduct) => {
    const aPrice = Number(a.priceRange.minVariantPrice.amount);
    const bPrice = Number(b.priceRange.minVariantPrice.amount);
    if (filters.sort === "price-low") return aPrice - bPrice;
    if (filters.sort === "price-high") return bPrice - aPrice;
    if (filters.sort === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  const pageSize = 24;
  const page = Math.max(1, Number.parseInt(filters.page ?? "1", 10) || 1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const displayed = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const buildUrl = (values: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = {
      sort: filters.sort,
      availability: filters.availability,
      vendor: filters.vendor,
      type: filters.type,
      tag: filters.tag,
      q: filters.q,
      page: filters.page,
      ...values,
    };
    Object.entries(merged).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });
    const query = next.toString();
    return `/collections/${handle}${query ? `?${query}` : ""}`;
  };

  return (
    <>
      <section className="collection-detail-hero">
        <div className="rack">
          <div className="collection-detail-copy">
            <nav className="collection-breadcrumb" aria-label="Breadcrumb">
              <Link href="/collections">Collections</Link>
              <span aria-hidden="true">/</span>
              <span>{collection.title}</span>
            </nav>
            <p className="collection-eyebrow">Curated stone selection</p>
            <h1>{collection.title}</h1>
            {collection.description && <p className="collection-detail-description">{collection.description}</p>}
            <p className="collection-detail-count">{filtered.length} {filtered.length === 1 ? "piece" : "pieces"}</p>
          </div>
          <div className="collection-detail-image">
            {collection.image ? (
              <Image
                src={collection.image.url}
                alt={collection.image.altText ?? collection.title}
                width={collection.image.width ?? 1600}
                height={collection.image.height ?? 1066}
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
              />
            ) : (
              <span className="collection-detail-fallback" aria-hidden="true" />
            )}
          </div>
        </div>
      </section>
      <section className="rack collection-browser">
        <aside className="collection-filter-sidebar filters">
        <form action={`/collections/${handle}`} method="get">
          <p className="collection-filter-heading">Refine</p>
          {(filters.q || filters.availability || filters.vendor || filters.type || filters.tag || filters.sort) && (
            <Link className="collection-filter-clear" href={`/collections/${handle}`}>Clear all</Link>
          )}
          <label>
            Search
            <input name="q" type="search" defaultValue={filters.q ?? ""} placeholder="Search this collection" />
          </label>
          <label>
            Availability
            <select name="availability" defaultValue={filters.availability ?? ""}>
              <option value="">All products</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>
          <label>
            Brand
            <select name="vendor" defaultValue={filters.vendor ?? ""}>
              <option value="">All brands</option>
              {vendors.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select name="type" defaultValue={filters.type ?? ""}>
              <option value="">All types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tag
            <select name="tag" defaultValue={filters.tag ?? ""}>
              <option value="">All tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort
            <select name="sort" defaultValue={filters.sort ?? "manual"}>
              <option value="manual">Featured</option>
              <option value="title">Alphabetically</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
          <button type="submit">Apply</button>
        </form>
        </aside>
        <div className="collection-results">
        <div className="collection-results-toolbar">
          <p><strong>{filtered.length}</strong> {filtered.length === 1 ? "piece" : "pieces"} found</p>
          {(filters.q || filters.availability || filters.vendor || filters.type || filters.tag || filters.sort) && (
            <Link className="collection-mobile-clear" href={`/collections/${handle}`}>Clear filters</Link>
          )}
        </div>
        {displayed.length === 0 ? (
          <p className="collection-no-results">
            No products match these filters.{" "}
            <Link href={`/collections/${handle}`}>Clear filters</Link> or{" "}
            <Link href="/custom-table">request a custom table</Link>.
          </p>
        ) : (
          <ul className="product-grid">
            {displayed.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
        {pageCount > 1 && (
          <nav className="collection-pagination" aria-label="Collection pagination">
            {currentPage > 1 && <Link href={buildUrl({ page: String(currentPage - 1) })}>Previous</Link>}
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <Link key={number} href={buildUrl({ page: String(number) })} aria-current={number === currentPage ? "page" : undefined}>
                {number}
              </Link>
            ))}
            {currentPage < pageCount && <Link href={buildUrl({ page: String(currentPage + 1) })}>Next</Link>}
          </nav>
        )}
        </div>
      </section>
    </>
  );
}
