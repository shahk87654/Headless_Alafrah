import Image from "next/image";
import Link from "next/link";

export function BookmatchHero({ src, alt }: { src?: string | null; alt?: string | null }) {
  return (
    <section className="home-hero" aria-label="Al Afrah natural stone furniture">
      <div className="home-hero-copy">
        <p className="eyebrow"><span aria-hidden="true" /> Natural stone / Dubai</p>
        <h1>Natural stone.<br /><em>Made personal.</em></h1>
        <p>Furniture and objects shaped from natural stone, for the spaces you call home.</p>
        <div className="home-hero-actions">
          <Link className="btn btn-primary" href="/collections">Explore the collection <span aria-hidden="true">↗</span></Link>
          <Link className="home-hero-secondary" href="/custom-table">Create something custom</Link>
        </div>
        <span className="home-hero-index"><strong>01</strong> / OBJECTS FOR LIVING</span>
      </div>
      <div className="home-hero-media">
        {src ? (
          <Image
            src={src}
            alt={alt ?? "Natural stone furniture in a considered home"}
            fill
            priority
            sizes="(max-width: 700px) 100vw, 52vw"
          />
        ) : (
          <div className="home-hero-art" />
        )}
        <span className="home-hero-caption"><small>AL AFRAH ATELIER</small> Crafted in Dubai</span>
      </div>
    </section>
  );
}
