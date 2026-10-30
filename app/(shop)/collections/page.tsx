import Image from "next/image";
import Link from "next/link";
import { getCollections } from "../../../lib/catalog";
export const revalidate=300;
export default async function Collections(){const collections=await getCollections(50);return <section className="section"><p className="eyebrow">Shop by category</p><h1 style={{fontFamily:"Georgia,serif",fontSize:"58px",margin:"0 0 45px",fontWeight:400}}>Collections</h1><div className="product-card-grid">{collections.map((collection)=><Link className="shopify-product-card" key={collection.id} href={`/collections/${collection.handle}`}><div className="shopify-product-image">{collection.image?<Image src={collection.image.url} alt={collection.image.altText??collection.title} fill sizes="(max-width:760px) 50vw,25vw"/>:<span className="product-placeholder">{collection.title}</span>}</div><div className="shopify-product-meta"><span>Collection</span><h3>{collection.title}</h3></div></Link>)}</div></section>}
