import Image from "next/image";
import Link from "next/link";
import { getCollection, formatAED, type ShopifyProduct } from "../../../../lib/catalog";
export const revalidate = 300;

export default async function CollectionPage({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<{ sort?: string; availability?: string; vendor?: string; type?: string; tag?: string; q?: string; page?: string }> }) {
  const { handle } = await params;
  const filters = await searchParams;
  const { collection } = await getCollection(handle, 250);
  if (!collection) return <section className="section"><p className="eyebrow">Collection</p><h1>Collection not found</h1><Link className="button button-dark" href="/collections">View all collections</Link></section>;

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
    const params = new URLSearchParams();
    const merged = { sort: filters.sort, availability: filters.availability, vendor: filters.vendor, type: filters.type, tag: filters.tag, q: filters.q, page: filters.page, ...values };
    Object.entries(merged).forEach(([key, value]) => { if (value) params.set(key, value); });
    const query = params.toString();
    return `/collections/${handle}${query ? `?${query}` : ""}`;
  };

  return <>
    <section className="collection-hero">{collection.image && <Image src={collection.image.url} alt={collection.image.altText ?? collection.title} fill priority sizes="100vw" />}<div className="collection-hero-overlay"/><div className="collection-hero-copy"><p className="eyebrow">Al Afrah Collection</p><h1>{collection.title}</h1>{collection.description && <p>{collection.description}</p>}</div></section>
    <section className="section">
      <form className="collection-toolbar" action={`/collections/${handle}`} method="get">
        <label><span>Search</span><input name="q" type="search" defaultValue={filters.q ?? ""} placeholder="Search this collection" /></label>
        <label><span>Availability</span><select name="availability" defaultValue={filters.availability ?? ""}><option value="">All products</option><option value="available">Available</option><option value="unavailable">Unavailable</option></select></label>
        <label><span>Brand</span><select name="vendor" defaultValue={filters.vendor ?? ""}><option value="">All brands</option>{vendors.map((vendor) => <option key={vendor} value={vendor}>{vendor}</option>)}</select></label>
        <label><span>Type</span><select name="type" defaultValue={filters.type ?? ""}><option value="">All types</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <label><span>Tag</span><select name="tag" defaultValue={filters.tag ?? ""}><option value="">All tags</option>{tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}</select></label>
        <label><span>Sort</span><select name="sort" defaultValue={filters.sort ?? "manual"}><option value="manual">Featured</option><option value="title">Alphabetically</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
        <button className="button button-dark" type="submit">Apply</button>
      </form>
      <div className="section-heading"><div><p className="eyebrow">Shop the collection</p><h2>{filtered.length} pieces</h2></div>{(filters.q || filters.availability || filters.vendor || filters.type || filters.tag || filters.sort) && <Link className="text-link" href={`/collections/${handle}`}>Clear filters</Link>}</div>
      <div className="product-card-grid">{displayed.map((product) => <Link className="shopify-product-card" key={product.id} href={`/products/${product.handle}`}><div className="shopify-product-image">{product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} fill sizes="(max-width:760px) 50vw,25vw"/> : <span className="product-placeholder">Al Afrah</span>}</div><div className="shopify-product-meta"><span>{product.availableForSale ? "Available" : "Made to order"}</span><h3>{product.title}</h3><strong>{formatAED(product.priceRange.minVariantPrice.amount)}</strong></div></Link>)}</div>
      {pageCount > 1 && <nav className="pagination" aria-label="Collection pagination"><Link aria-disabled={currentPage === 1} href={currentPage === 1 ? "#" : buildUrl({ page: String(currentPage - 1) })}>Previous</Link>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <Link key={number} className={number === currentPage ? "active" : ""} href={buildUrl({ page: String(number) })}>{number}</Link>)}<Link aria-disabled={currentPage === pageCount} href={currentPage === pageCount ? "#" : buildUrl({ page: String(currentPage + 1) })}>Next</Link></nav>}
    </section>
  </>;
}
