import Link from "next/link";
import { OrderTrackingForm } from "../../../components/OrderTrackingForm";

export default function TrackOrderPage() {
  return (
    <section className="rack order-tracking-page">
      <div className="order-tracking-intro">
        <p className="eyebrow">Your order</p>
        <h1>Track an order</h1>
        <p>Enter the order number and email address used at checkout to see the latest fulfillment and delivery updates.</p>
      </div>
      <div className="order-tracking-panel">
        <OrderTrackingForm />
        <Link className="order-tracking-account-link" href="/account">Back to my account</Link>
      </div>
    </section>
  );
}