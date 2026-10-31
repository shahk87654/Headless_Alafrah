import { SiteShell } from "../../components/SiteShell";

export default function Account() {
  return (
    <SiteShell>
      <section className="section rack centred">
        <h1>Account</h1>
        <p>Customer account configuration is required before order history and saved addresses can be shown.</p>
        <button type="button" disabled>
          Sign in unavailable
        </button>
      </section>
    </SiteShell>
  );
}
