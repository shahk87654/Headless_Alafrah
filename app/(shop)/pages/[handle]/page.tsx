import { ContactForm } from "../../../../components/ContactForm";

export default async function ContentPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const title = handle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <section className="content-page">
      <header className="content-page-heading">
        <p className="eyebrow">Al Afrah Technical</p>
        <h1>{title}</h1>
      </header>
      {handle === "contact" ? (
        <div className="contact-layout">
          <aside className="contact-details">
            <div className="contact-details-intro">
              <span>01 / New project</span>
              <p>Planning a bespoke piece?<br /><em>Start here.</em></p>
            </div>
            <div>
              <span>Visit</span>
              <p>Al Afrah Technical<br />Dubai, United Arab Emirates</p>
            </div>
            <div>
              <span>Contact</span>
              <a href="mailto:info@alafrahtechnical.com">info@alafrahtechnical.com</a>
              <a href="https://wa.me/971000000000" target="_blank" rel="noreferrer">WhatsApp the workshop</a>
            </div>
            <div>
              <span>Typical response</span>
              <p>Within one business day</p>
            </div>
          </aside>
          <div className="contact-panel">
            <p className="eyebrow">Project enquiry</p>
            <h2>Tell us what you are creating.</h2>
            <ContactForm />
          </div>
        </div>
      ) : (
        <>
          <p>Full copy for this page is loaded from Shopify when the Storefront API is connected.</p>
          <h2>Workshop</h2>
          <p>The Dubai team can confirm dimensions, material, delivery and installation across the UAE.</p>
        </>
      )}
    </section>
  );
}
