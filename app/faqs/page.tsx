import Link from "next/link";
import { SiteShell } from "../../components/SiteShell";

const faqs = [
  ["Is the price final before I order?", "Custom pieces are quoted after dimensions, stone selection, edge profile and delivery details are confirmed. Online products display the current checkout price."],
  ["Do you deliver across the UAE?", "Yes. We arrange delivery and installation for Dubai, Abu Dhabi, Sharjah and other Emirates."],
  ["Can I request custom dimensions?", "Yes. Use Design a custom table or send room measurements and the stone you want."],
  ["What payment methods are available?", "Shopify checkout supports major cards, Apple Pay and the payment methods enabled on the store."],
  ["Is VAT included in displayed prices?", "Prices are in AED and include 5% VAT. Shipping is added at checkout."],
];

export default function FAQs() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <SiteShell>
      <div className="faq-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <header className="faq-heading">
          <div>
            <p className="eyebrow">Client care / FAQ</p>
            <h1>Before you<br /><em>begin</em></h1>
          </div>
          <p>Answers about stone, sizing, delivery and custom projects.</p>
        </header>
        <div className="faq-layout">
          <aside className="faq-index" aria-label="FAQ topics">
            <span>Topics</span>
            <a href="#faq-list">01 Orders</a>
            <a href="#faq-list">02 Delivery</a>
            <a href="#faq-list">03 Bespoke</a>
            <a href="#faq-list">04 Payment</a>
          </aside>
          <section className="faq-list" id="faq-list" aria-label="Frequently asked questions">
            {faqs.map(([question, answer], index) => (
              <details className="faq-item" key={question} open={index === 0}>
                <summary>
                  <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="faq-question">{question}</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        </div>
        <aside className="faq-contact">
          <p className="eyebrow">Still have a question?</p>
          <h2>Speak with the workshop.</h2>
          <Link className="btn" href="/pages/contact">Contact our team</Link>
        </aside>
      </div>
    </SiteShell>
  );
}
