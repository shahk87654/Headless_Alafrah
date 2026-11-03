import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "../components/SiteShell";
import InteractiveHome from "../components/InteractiveHome";
import { BookmatchHero } from "../components/home/BookmatchHero";
import { ProductCard } from "../components/product/ProductCard";
import { getCollections, getProducts, type ShopifyCollection, type ShopifyProduct } from "../lib/catalog";
import { isShopifyConfigured } from "../lib/shopify";

const categoryDetails = [
  { handle: "coffee-tables", title: "Coffee tables", note: "The centre of the room", match: /coffee|center|centre/i },
  { handle: "dining-tables", title: "Dining tables", note: "Gather around something lasting", match: /dining/i },
  { handle: "marble-planter", title: "Planters", note: "A little life, beautifully framed", match: /planter|pot|vase/i },
  { handle: "marble-accessories", title: "Objects", note: "Small details in natural stone", match: /accessor|bowl|tray|object/i },
];

const journalEntries = [
  { category: "The buying guide", title: "Choosing a marble table for your home", handle: "custom-marble-tables-uae-buying-guide" },
  { category: "In the details", title: "A closer look at marble coffee tables", handle: "marble-coffee-table-designs-uae" },
  { category: "Know your stone", title: "The origins of beige travertine", handle: "the-countries-made-beige-travertine-marble" },
];

export default async function Home() {
  let collections: ShopifyCollection[] = [];
  let products: ShopifyProduct[] = [];

  if (isShopifyConfigured) {
    const [collectionResult, productResult] = await Promise.allSettled([
      getCollections(12),
      getProducts(8),
    ]);

    if (collectionResult.status === "fulfilled") {
      collections = collectionResult.value;
    } else {
      console.error("Failed to load homepage collections from Shopify:", collectionResult.reason);
    }

    if (productResult.status === "fulfilled") {
      products = productResult.value;
    } else {
      console.error("Failed to load homepage products from Shopify:", productResult.reason);
    }
  }

  const categories = categoryDetails.map((category) => {
    const collectionImage = collections.find((collection) => collection.handle === category.handle)?.image;
    const productImage = products.find((product) =>
      category.match.test(`${product.title} ${product.productType} ${(product.tags ?? []).join(" ")}`),
    )?.featuredImage;

    return {
      ...category,
      image: collectionImage ?? productImage ?? null,
    };
  });
  const heroProduct = products.find((product) =>
    /table|console|desk/i.test(`${product.title} ${product.productType}`),
  ) ?? products[0];

  return (
    <SiteShell>
      <BookmatchHero
        src={heroProduct?.featuredImage?.url}
        alt={heroProduct?.featuredImage?.altText ?? heroProduct?.title ?? "Marble furniture in a considered home"}
      />

      <section className="home-proof rack" aria-label="The Al Afrah difference">
        <p>Natural stone, always unique</p>
        <p>Crafted in our Dubai workshop</p>
        <p>Delivered across the UAE</p>
        <p>Made-to-order options</p>
      </section>

      <section className="home-categories section" aria-labelledby="home-collections-title">
        <div className="home-section-heading rack">
          <div className="span-8">
            <p className="eyebrow">Considered for every room</p>
            <h2 id="home-collections-title">Made to live with.</h2>
          </div>
          <Link className="span-4 home-view-link" href="/collections">View all collections <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="home-category-grid rack">
          {categories.map((category, index) => (
            <Link className={`home-category-card home-category-${index + 1}`} href={`/collections/${category.handle}`} key={category.handle}>
              {category.image ? (
                <span className="home-category-image">
                  <Image
                    src={category.image.url}
                    alt={category.image.altText ?? category.title}
                    fill
                    sizes="(max-width: 700px) 50vw, (max-width: 1100px) 25vw, 22vw"
                  />
                </span>
              ) : (
                <span className="home-category-image home-category-art" aria-hidden="true" />
              )}
              <span className="home-category-label">
                <span><strong>{category.title}</strong><em>{category.note}</em></span>
                <b aria-hidden="true">↗</b>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="home-featured section" aria-labelledby="home-featured-title">
          <div className="home-section-heading rack">
            <div className="span-8">
              <p className="eyebrow">Pieces to keep close</p>
              <h2 id="home-featured-title">A few of our favourites.</h2>
            </div>
            <Link className="span-4 home-view-link" href="/collections">Shop the edit <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="rack">
            <ul className="span-12 product-grid">
              {products.slice(0, 4).map((product) => (
                <li key={product.id}><ProductCard product={product} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <InteractiveHome />

      <section className="home-custom rack" aria-labelledby="home-custom-title">
        <div className="home-custom-copy span-6">
          <p className="eyebrow">A little more personal</p>
          <h2 id="home-custom-title">Made to fit your life.</h2>
          <p>Start with the shape, choose your stone, and work with our team to bring a made-to-order piece together.</p>
          <Link className="btn btn-primary" href="/custom-table">Explore custom design <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="home-custom-visual span-6" aria-label="Natural stone surfaces and finishes">
          <span className="home-custom-stone home-custom-stone-one" />
          <span className="home-custom-stone home-custom-stone-two" />
          <span className="home-custom-stone home-custom-stone-three" />
          <span className="home-custom-visual-note"><small>THE ATELIER</small> Made in Dubai, with intention.</span>
        </div>
      </section>

      <section className="home-journal rack" aria-labelledby="home-journal-title">
        <header className="home-journal-heading span-4">
          <p className="eyebrow">A little reading</p>
          <h2 id="home-journal-title">Notes on living with stone.</h2>
          <Link className="home-journal-all" href="/blogs/news">Visit the journal <span aria-hidden="true">↗</span></Link>
        </header>
        <div className="home-journal-list span-8">
          {journalEntries.map((entry, index) => (
            <Link href={`/blogs/news/${entry.handle}`} key={entry.handle}>
              <span>{entry.category}</span>
              <strong>{entry.title}</strong>
              <b aria-hidden="true">{String(index + 1).padStart(2, "0")} ↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-help rack" aria-labelledby="home-help-title">
        <div className="home-help-card span-5">
          <p className="eyebrow">A real person, just a message away</p>
          <h2 id="home-help-title">Let’s find the right piece.</h2>
          <p>Questions about stone, sizing or delivery? Our team is happy to help.</p>
          <div>
            <Link className="btn btn-primary" href="/pages/contact">Talk to our team <span aria-hidden="true">↗</span></Link>
            <Link className="home-help-secondary" href="/faqs">Browse FAQs</Link>
          </div>
        </div>
        <div className="home-questions span-7" aria-label="Common questions">
          <details>
            <summary><span>01</span> Can I request custom dimensions?<b aria-hidden="true">+</b></summary>
            <p>Yes. Share your room measurements and preferred stone through our <Link href="/custom-table">custom design service</Link>.</p>
          </details>
          <details>
            <summary><span>02</span> Do you deliver across the UAE?<b aria-hidden="true">+</b></summary>
            <p>Yes. We arrange delivery and installation in Dubai, Abu Dhabi, Sharjah and other Emirates.</p>
          </details>
          <details>
            <summary><span>03</span> When will my piece arrive?<b aria-hidden="true">+</b></summary>
            <p>Timing depends on your address and selected piece. Our team can help coordinate a delivery.</p>
          </details>
        </div>
      </section>
    </SiteShell>
  );
}
