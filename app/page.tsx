import Link from "next/link";
import { SiteShell } from "../components/SiteShell";
import InteractiveHome from "../components/InteractiveHome";
import { formatAED, getCollections, getProducts, type ShopifyCollection, type ShopifyProduct } from "../lib/catalog";
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
      <section>
        <h1>Marble cut and finished in Dubai</h1>
        <p>Tables, planters, bathroom and kitchen pieces, bakhoor burners, and custom tabletops in named stones.</p>
        <div>
          <Link href="/collections">Shop furniture</Link>
          <Link href="/custom-table">Design a custom table</Link>
        </div>
      </section>
      <section>
        <p>Lead times stated on each product.</p>
        <p>Delivery across the UAE, installation in Dubai and Abu Dhabi.</p>
        <p>Custom sizes quoted from the workshop, not a catalogue markup.</p>
      </section>
      <InteractiveHome />
      <section>
        <h2>Shop by type</h2>
        <ul>
          {(categoryCollections.length
            ? categoryCollections.map((item) => ({ title: item!.title, handle: item!.handle }))
            : [
                { title: "Coffee tables", handle: "coffee-tables" },
                { title: "Dining tables", handle: "dining-tables" },
                { title: "Planters", handle: "marble-planter" },
                { title: "Accessories", handle: "marble-accessories" },
              ]
          ).map((item) => (
            <li key={item.handle}>
              <Link href={`/collections/${item.handle}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      {products.length > 0 && (
        <section>
          <h2>In the yard</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <Link href={`/products/${product.handle}`}>
                  {product.title} · {formatAED(product.priceRange.minVariantPrice.amount)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h2>Clearance</h2>
        <p>Finished pieces at reduced prices. Stock is what is on the floor.</p>
        <Link href="/collections">View clearance and in-stock pieces</Link>
      </section>
      <section>
        <h2>A custom table in five steps</h2>
        <ol>
          <li>Choose table type and shape</li>
          <li>Pick the stone</li>
          <li>Set length, width and height</li>
          <li>Choose base and finish</li>
          <li>Send measurements and photos of the room</li>
        </ol>
        <Link href="/custom-table">Design a custom table</Link>
      </section>
      <section>
        <h2>Magazine</h2>
        <Link href="/blogs/news/custom-marble-tables-uae-buying-guide">Custom marble tables in the UAE</Link>
        <Link href="/blogs/news/marble-coffee-table-designs-uae">Marble coffee table designs</Link>
        <Link href="/blogs/news/the-countries-made-beige-travertine-marble">Where beige travertine is quarried</Link>
      </section>
      <section>
        <h2>Newsletter</h2>
        <form>
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
