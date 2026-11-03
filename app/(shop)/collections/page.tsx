import Image from "next/image";
import Link from "next/link";
import { getCollections } from "../../../lib/catalog";

export const revalidate = 300;

export default async function Collections() {
  const collections = await getCollections(50);
  return (
    <div className="collections-page">
      <section className="collections-intro rack">
        <div>
          <p className="collection-eyebrow">The catalogue</p>
          <h1>Collections</h1>
        </div>
        <p className="collections-intro-copy">
          Explore natural stone by colour, finish and character. Each collection brings together pieces selected for their tone, movement and enduring presence.
        </p>
      </section>
      {collections.length === 0 ? (
        <section className="rack collection-empty">
          <p>
            No collections loaded. Check the Shopify connection, or{" "}
            <Link href="/custom-table">request a custom table</Link>.
          </p>
        </section>
      ) : (
        <section className="rack">
          <ul className="span-12 collection-editorial-grid">
            {collections.map((collection, index) => (
            <li className={`collection-editorial-card ${index === 0 ? "collection-editorial-feature" : index === 1 ? "collection-editorial-tall" : ""}`} key={collection.id}>
              <Link href={`/collections/${collection.handle}`}>
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText ?? collection.title}
                    width={collection.image.width ?? 800}
                    height={collection.image.height ?? 600}
                    sizes={index === 0 ? "(max-width: 760px) 100vw, 58vw" : "(max-width: 760px) 50vw, 30vw"}
                    priority={index === 0}
                  />
                ) : (
                  <span className="collection-editorial-fallback" aria-hidden="true" />
                )}
                <span className="collection-editorial-meta">
                  <span>
                    <span className="collection-editorial-index">{String(index + 1).padStart(2, "0")}</span>
                    <h2>{collection.title}</h2>
                  </span>
                  <span className="collection-editorial-arrow" aria-hidden="true">↗</span>
                </span>
              </Link>
            </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
