import Link from "next/link";
import { getProduct } from "../../../../lib/catalog";
import { ProductPurchase } from "../../../../components/ProductPurchase";
export const revalidate=300;
export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return (
      <section className="section">
        <p className="eyebrow">Product</p>
        <h1>Product not found</h1>
        <Link className="button button-dark" href="/collections">View collections</Link>
      </section>
    );
  }

  return <ProductPurchase product={product} />;
}
