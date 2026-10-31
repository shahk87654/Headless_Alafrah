import Link from "next/link";

export default function TrackOrderPage() {
  return (
    <section className="rack" style={{ minHeight: "60vh", paddingTop: "var(--space-6)", paddingBottom: "var(--space-6)" }}>
      <p className="eyebrow">Your order</p>
      <h1 style={{ marginTop: 8 }}>Track an order</h1>
      <p>To check an order, sign in and open your account or contact the workshop with your order number.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <Link className="btn btn-primary" href="/account">View my orders</Link>
        <Link className="btn btn-outline" href="/pages/contact">Contact support</Link>
      </div>
    </section>
  );
}