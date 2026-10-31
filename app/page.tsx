import Link from "next/link";
import { SiteShell } from "../components/SiteShell";
import InteractiveHome from "../components/InteractiveHome";
import { BookmatchHero } from "../components/home/BookmatchHero";
import { ProductCard } from "../components/product/ProductCard";
import { getCollections, getProducts, type ShopifyCollection, type ShopifyProduct } from "../lib/catalog";
import { isShopifyConfigured } from "../lib/shopify";

export default async function Home() {
  let collections: ShopifyCollection[] = [];
  let products: ShopifyProduct[] = [];
  if (isShopifyConfigured) {
    [collections, products] = await Promise.all([getCollections(12), getProducts(8)]).catch(() => [[], []]);
  }
  const preferredHandles = ["coffee-tables", "dining-tables", "marble-planter", "marble-accessories"];
  const categoryCollections = preferredHandles
    .map((handle) => collections.find((item) => item.handle === handle))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <SiteShell>
      <BookmatchHero
        src={products.find((product) => product.featuredImage)?.featuredImage?.url}
        alt="Bookmatched marble slab in the Al Afrah workshop"
      />
      <section className="rack home-actions" aria-label="Shop Al Afrah">
        <div className="span-12 cluster">
          <Link className="btn btn-primary" href="/collections">Shop furniture</Link>
          <Link className="btn btn-outline" href="/custom-table">Design a custom table</Link>
        </div>
      </section>
      <section className="rack">
        <div className="span-12 trust panel-travertine">
        <p>Lead times stated on each product.</p>
        <p>Delivery across the UAE, installation in Dubai and Abu Dhabi.</p>
        <p>Custom sizes quoted from the workshop, not a catalogue markup.</p>
        </div>
      </section>
      <InteractiveHome />
      <section className="section rack">
        <h2>Shop by type</h2>
        <div className="span-12 mosaic">
          {(categoryCollections.length
            ? categoryCollections.map((item) => ({ title: item!.title, handle: item!.handle }))
            : [
                { title: "Coffee tables", handle: "coffee-tables" },
                { title: "Dining tables", handle: "dining-tables" },
                { title: "Planters", handle: "marble-planter" },
                { title: "Accessories", handle: "marble-accessories" },
              ]
          ).map((item) => (
            <Link key={item.handle} href={`/collections/${item.handle}`}>
              <span className="caption">{item.title}</span>
            </Link>
          ))}
        </div>
      </section>
      {products.length > 0 && (
        <section className="section rack">
          <h2>In the yard</h2>
          <ul className="span-12 product-grid">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="rack">
        <div className="span-12 panel-marquina section">
        <h2>Clearance</h2>
        <p>Finished pieces at reduced prices. Stock is what is on the floor.</p>
        <Link className="btn btn-outline" href="/collections">View clearance and in-stock pieces</Link>
        </div>
      </section>
      <section className="section rack">
        <h2>A custom table in five steps</h2>
        <ol className="span-12 steps">
          <li>Choose table type and shape</li>
          <li>Pick the stone</li>
          <li>Set length, width and height</li>
          <li>Choose base and finish</li>
          <li>Send measurements and photos of the room</li>
        </ol>
        <Link className="btn btn-primary" href="/custom-table">Design a custom table</Link>
      </section>
      <section className="section rack">
        <h2>Magazine</h2>
        <div className="span-12 stack">
        <Link href="/blogs/news/custom-marble-tables-uae-buying-guide">Custom marble tables in the UAE</Link>
        <Link href="/blogs/news/marble-coffee-table-designs-uae">Marble coffee table designs</Link>
        <Link href="/blogs/news/the-countries-made-beige-travertine-marble">Where beige travertine is quarried</Link>
        </div>
      </section>
      <section className="section rack">
        <h2>Newsletter</h2>
        <form className="span-12 cluster field">
          <label className="sr-only" htmlFor="home-email">
            Email address
          </label>
          <input id="home-email" type="email" placeholder="Email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </SiteShell>
  );
}
