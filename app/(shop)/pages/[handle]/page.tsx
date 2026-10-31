export default async function ContentPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const title = handle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <section className="section rack">
      <h1>{title}</h1>
      {handle === "contact" ? (
        <>
          <p>Workshop and store in Dubai. Use the form or WhatsApp for sizes, stones and lead times.</p>
          <form>
            <label>
              Name
              <input aria-label="Name" name="name" required />
            </label>
            <label>
              Email
              <input aria-label="Email" name="email" type="email" required />
            </label>
            <label>
              Message
              <textarea aria-label="Message" name="message" rows={6} required />
            </label>
            <button type="submit">Send</button>
          </form>
        </>
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
