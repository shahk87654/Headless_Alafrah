import Link from "next/link";
import { getProduct, getProducts } from "../../../../lib/catalog";
import { ProductPurchase } from "../../../../components/ProductPurchase";

export const revalidate = 300;

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return (
      <section>
        <h1>That product is not on the store</h1>
        <p>It may have sold or been renamed. Browse collections or request a custom size.</p>
        <Link href="/collections">View collections</Link>
      </section>
    );
  }

  const related = (await getProducts(12)).filter((item) => item.handle !== handle).slice(0, 4);
  return <ProductPurchase product={product} related={related} />;
}
