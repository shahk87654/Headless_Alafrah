import { SiteShell } from "../../components/SiteShell";

const faqs = [
  ["Do you deliver across the UAE?", "Yes. We arrange delivery and installation for Dubai, Abu Dhabi, Sharjah and other Emirates."],
  ["Can I request custom dimensions?", "Yes. Use Design a custom table or send room measurements and the stone you want."],
  ["What payment methods are available?", "Shopify checkout supports major cards, Apple Pay and the payment methods enabled on the store."],
  ["Is VAT included in displayed prices?", "Prices are in AED and include 5% VAT. Shipping is added at checkout."],
];

export default function FAQs() {
  return (
    <SiteShell>
      <section className="section rack">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage" }) }} />
        <h1>Frequently asked questions</h1>
        {faqs.map(([question, answer]) => (
          <article key={question}>
            <h2>{question}</h2>
            <p>{answer}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
