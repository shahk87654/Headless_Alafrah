import Image from "next/image";
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
  const categoryCollections = preferredHandles.map((handle) => collections.find((item) => item.handle === handle)).filter(Boolean).slice(0, 4);
  const categoryPlaceholders = [
    ["Coffee Tables", "coffee-tables", "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=900&q=85"],
    ["Dining Tables", "dining-tables", "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=85"],
    ["Marble Planters", "marble-planter", "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85"],
    ["Accessories", "marble-accessories", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85"],
  ] as const;

  return <SiteShell><>
    <section className="hero">
      <Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=90" alt="Placeholder luxury marble interior for Al Afrah Technical" fill priority sizes="100vw" />
      <div className="hero-overlay" /><div className="hero-content"><p className="eyebrow">Bespoke stonework · Dubai</p><h1>Crafted for spaces<br />of distinction.</h1><p className="hero-copy">Premium marble furniture and technical solutions, tailored to your space and style.</p><div className="hero-actions"><Link className="button button-light" href="/collections">Shop Furniture</Link><Link className="button button-outline-light" href="/custom-table">Design a Custom Table</Link></div></div>
    </section>
    <section className="trust-strip"><span><strong>Made by artisans</strong><small>Precision-crafted marble</small></span><span><strong>Dubai delivery</strong><small>Throughout the UAE</small></span><span><strong>Custom dimensions</strong><small>Tailored to your space</small></span><span><strong>Premium materials</strong><small>Natural stone selection</small></span></section>
    <InteractiveHome />

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">Curated for living</p><h2>Explore the collection</h2></div><Link className="text-link" href="/collections">View all collections →</Link></div>
      <div className="category-grid">{(categoryCollections.length ? categoryCollections.map((item) => [item!.title, item!.handle, item!.image?.url ?? ""] as const) : categoryPlaceholders).map(([name, handle, image], index) => <Link className="category-card" key={handle} href={`/collections/${handle}`}><div className="category-image">{image ? <Image src={image} alt={`${name} collection`} fill sizes="(max-width: 760px) 50vw, 25vw" /> : <Image src={categoryPlaceholders[index][2]} alt={`${name} placeholder`} fill sizes="(max-width: 760px) 50vw, 25vw" />}</div><div className="category-caption"><h3>{name}</h3><span>Discover collection →</span></div></Link>)}</div>
    </section>

    {products.length > 0 && <section className="section imported-products"><div className="section-heading"><div><p className="eyebrow">From the showroom</p><h2>Latest pieces</h2></div><Link className="text-link" href="/collections/marble-tables">View marble tables →</Link></div><div className="product-card-grid">{products.map((product) => <Link className="shopify-product-card" key={product.id} href={`/products/${product.handle}`}><div className="shopify-product-image">{product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} fill sizes="(max-width: 760px) 50vw, 25vw" /> : <span className="product-placeholder">Al Afrah</span>}</div><div className="shopify-product-meta"><span>{product.vendor ?? "Al Afrah Technical"}</span><h3>{product.title}</h3><strong>{formatAED(product.priceRange.minVariantPrice.amount)}</strong></div></Link>)}</div></section>}

    <section className="materials-section"><div className="materials-copy"><p className="eyebrow">The stone library</p><h2>Exceptional materials.<br />Distinctive character.</h2><p>Every slab has a story written in colour, movement and natural variation.</p><Link className="button button-dark" href="/collections/travertine-marble">Explore materials</Link></div><div className="material-swatches"><Link href="/collections/travertine-marble"><span className="swatch travertine" /><strong>Travertine</strong><small>Warm &amp; timeless</small></Link><Link href="/collections/calacatta-marble"><span className="swatch calacatta" /><strong>Calacatta</strong><small>Bold &amp; luminous</small></Link><Link href="/collections/arabescato-marble"><span className="swatch arabescato" /><strong>Arabescato</strong><small>Expressive veining</small></Link><Link href="/collections/onyx-marble"><span className="swatch onyx" /><strong>Onyx</strong><small>Rich &amp; translucent</small></Link></div></section>
    <section className="clearance"><div><p className="eyebrow">Clearance selection</p><h2>Clearance sales.<br />Remarkable combinations.</h2></div><Link className="button button-light" href="/collections">Explore offers</Link></section>
    <section className="section custom-feature"><div className="custom-feature-image"><Image src="https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1200&q=85" alt="Placeholder bespoke marble dining table" fill sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="custom-feature-copy"><p className="eyebrow">Made for you</p><h2>Your table, perfectly composed.</h2><p>Choose the material, dimensions and finish. Our atelier brings your bespoke piece to life.</p><ol><li><span>01</span>Select dimensions</li><li><span>02</span>Choose marble</li><li><span>03</span>Approve the vision</li><li><span>04</span>Receive your table</li></ol><Link className="button button-dark" href="/custom-table">Start Custom Table</Link></div></section>
    <section className="section magazine-preview"><div className="section-heading"><div><p className="eyebrow">The Al Afrah Journal</p><h2>Notes on stone &amp; design</h2></div><Link className="text-link" href="/blogs/news">Read the magazine →</Link></div><div className="article-grid"><Link href="/blogs/news/custom-marble-tables-uae-buying-guide"><Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85" alt="Placeholder article image" width={800} height={520} /><span>Buying Guide</span><h3>Custom Marble Tables in the UAE</h3></Link><Link href="/blogs/news/marble-coffee-table-designs-uae"><Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85" alt="Placeholder article image" width={800} height={520} /><span>Design</span><h3>Marble Coffee Table Designs</h3></Link><Link href="/blogs/news/the-countries-made-beige-travertine-marble"><Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85" alt="Placeholder article image" width={800} height={520} /><span>Materials</span><h3>The Origins of Beige Travertine</h3></Link></div></section>
    <section className="newsletter-section"><p className="eyebrow">Private list</p><h2>Design inspiration, delivered.</h2><p>New collections, atelier stories and private offers.</p><form><label className="sr-only" htmlFor="home-email">Email address</label><input id="home-email" type="email" placeholder="Your email address" required /><button className="button button-dark" type="submit">Subscribe</button></form></section>
  </></SiteShell>;
}
