import Image from "next/image";
import Link from "next/link";
import { getCollections } from "../../../lib/catalog";

export const revalidate = 300;

export default async function Collections() {
  const collections = await getCollections(50);
  return (
    <section>
      <h1>Collections</h1>
      {collections.length === 0 ? (
        <p>
          No collections loaded. Check the Shopify connection, or{" "}
          <Link href="/custom-table">request a custom table</Link>.
        </p>
      ) : (
        <ul>
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link href={`/collections/${collection.handle}`}>
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText ?? collection.title}
                    width={collection.image.width ?? 800}
                    height={collection.image.height ?? 600}
                    sizes="(max-width:760px) 50vw, 25vw"
                  />
                ) : null}
                <h2>{collection.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
