import Link from "next/link";
import { SiteShell } from "../components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="centred rack section" aria-labelledby="not-found-title">
        <h1 id="not-found-title">That page is not in the slab rack</h1>
        <p>Check the address or use the search field to find a table, stone or collection.</p>
        <form action="/search" className="field">
          <label htmlFor="not-found-search">Search the store</label>
          <input id="not-found-search" name="q" type="search" placeholder="Coffee table, Travertine, dimensions" />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
        <div className="cluster">
          <Link className="btn btn-outline" href="/collections/coffee-tables">Coffee tables</Link>
          <Link className="btn btn-outline" href="/collections/dining-tables">Dining tables</Link>
          <Link className="btn btn-primary" href="/custom-table">Custom table</Link>
        </div>
      </section>
    </SiteShell>
  );
}
