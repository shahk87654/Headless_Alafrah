import Link from "next/link";
import { SiteShell } from "../components/SiteShell";
import InteractiveHome from "../components/InteractiveHome";
import { BookmatchHero } from "../components/home/BookmatchHero";
import { ProductCard } from "../components/product/ProductCard";
import Image from "next/image";
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
  const heroProduct = products.find((product) =>
    /table|console|desk/i.test(`${product.title} ${product.productType}`),
  ) ?? products[0];

  return (
    <SiteShell>
      <BookmatchHero
        src={heroProduct?.featuredImage?.url}
        alt="Bookmatched marble slab in the Al Afrah workshop"
      />
      <section className="home-intro rack" aria-label="About Al Afrah">
        <p className="eyebrow span-12">Stone, shaped for living</p>
        <div className="home-intro-copy span-7">
          <h2>Furniture with the presence of natural stone.</h2>
        </div>
        <p className="home-intro-note span-5">Designed in proportion. Cut and finished in our Dubai workshop for homes, hospitality and considered interiors.</p>
      </section>
      <section className="home-trust" aria-label="Workshop services">
        <p><span>01</span> UAE-wide delivery</p>
        <p><span>02</span> Workshop installation</p>
        <p><span>03</span> Made-to-order sizing</p>
      </section>
      <InteractiveHome />
      <section className="home-categories section">
        <div className="home-section-heading rack">
          <div className="span-8"><p className="eyebrow">Collection directory</p><h2>Explore by room</h2></div>
          <Link className="span-4 home-view-link" href="/collections">View all collections <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="home-category-grid rack">
          {(categoryCollections.length
            ? categoryCollections.map((item) => ({ title: item!.title, handle: item!.handle, image: item!.image }))
            : [
                { title: "Coffee tables", handle: "coffee-tables" },
                { title: "Dining tables", handle: "dining-tables" },
                { title: "Planters", handle: "marble-planter" },
                { title: "Accessories", handle: "marble-accessories" },
              ]
          ).map((item, index) => (
            <Link className={`home-category-card home-category-${index + 1}`} key={item.handle} href={`/collections/${item.handle}`}>
              {"image" in item && item.image ? (
                <Image src={item.image.url} alt={item.image.altText ?? item.title} fill sizes="(max-width: 760px) 100vw, 50vw" />
              ) : (
                <span className="home-category-art" aria-hidden="true" />
              )}
              <span className="home-category-label"><small>{String(index + 1).padStart(2, "0")}</small>{item.title}<span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </section>
      {products.length > 0 && (
        <section className="home-featured section">
          <div className="home-section-heading rack">
            <div className="span-8"><p className="eyebrow">Available now</p><h2>Selected pieces</h2></div>
            <Link className="span-4 home-view-link" href="/collections">Shop the collection <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="rack">
          <ul className="span-12 product-grid">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          </div>
        </section>
      )}
      <section className="home-custom rack">
        <div className="home-custom-copy span-7">
          <p className="eyebrow">Bespoke service</p>
          <h2>Made precisely for your space.</h2>
          <p>Select the proportion, stone and finish. Our workshop reviews every detail before production.</p>
          <Link className="btn btn-primary" href="/custom-table">Design your table</Link>
        </div>
        <ol className="home-custom-steps span-5">
          <li><span>01</span><strong>Shape & proportion</strong></li>
          <li><span>02</span><strong>Stone & finish</strong></li>
          <li><span>03</span><strong>Workshop review</strong></li>
        </ol>
      </section>
      <section className="home-journal rack">
        <div className="span-6"><p className="eyebrow">Al Afrah journal</p><h2>Notes from the yard.</h2></div>
        <div className="span-6 home-journal-list">
          <Link href="/blogs/news/custom-marble-tables-uae-buying-guide"><span>Buying guide</span><strong>Custom marble tables in the UAE</strong><b>↗</b></Link>
          <Link href="/blogs/news/marble-coffee-table-designs-uae"><span>Design</span><strong>Marble coffee table designs</strong><b>↗</b></Link>
          <Link href="/blogs/news/the-countries-made-beige-travertine-marble"><span>Materials</span><strong>Where beige travertine is quarried</strong><b>↗</b></Link>
        </div>
      </section>
      <section className="home-newsletter rack">
        <div className="home-newsletter-copy span-5">
          <p className="eyebrow">Al Afrah journal</p>
          <h2>From the workshop.</h2>
        </div>
        <form className="span-7 field">
          <label className="sr-only" htmlFor="home-email">
            Email address
          </label>
          <input id="home-email" type="email" placeholder="Email address" required />
          <button type="submit"><span>Subscribe</span><b aria-hidden="true">↗</b></button>
        </form>
      </section>
    </SiteShell>
  );
}
