import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const posts = [
  { h: "custom-marble-tables-uae-buying-guide", t: "Custom marble tables in the UAE: a buying guide", tag: "Buying guide" },
  { h: "marble-coffee-table-designs-uae", t: "Marble coffee table designs for UAE homes", tag: "Design" },
  { h: "the-countries-made-beige-travertine-marble", t: "Where beige travertine marble is quarried", tag: "Materials" },
];

export default function Magazine() {
  return (
    <div className="journal-page">
      <header className="journal-heading">
        <div className="journal-heading-kicker">
          <p className="eyebrow">Al Afrah journal</p>
          <p>Volume 01 / 2026</p>
        </div>
        <div className="journal-heading-grid">
          <h1>Material<br /><em>has a story.</em></h1>
          <div className="journal-heading-intro">
            <p>Ideas, objects and practical knowledge from our Dubai stone workshop.</p>
            <span>Objects with character. Knowledge with purpose.</span>
          </div>
        </div>
        <div className="journal-heading-index"><span>01 / THE JOURNAL</span><span>STONE · SPACE · CRAFT</span></div>
      </header>
      <section className="journal-grid" aria-label="Journal articles">
        {posts.map((post, index) => (
          <Link className={`journal-card journal-card-${index + 1}`} href={`/blogs/news/${post.h}`} key={post.h}>
            <div className="journal-card-image" aria-hidden="true">
              <span className="journal-art-slab" />
              <span className="journal-art-shadow" />
              <span className="journal-art-index">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="journal-card-copy">
              <p>{post.tag}<span>5 min read</span></p>
              <h2>{post.t}</h2>
              <span className="journal-card-link">Read article <ArrowUpRight size={16} /></span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
