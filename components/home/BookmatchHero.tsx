"use client";

import Image from "next/image";
import Link from "next/link";

export function BookmatchHero({ src, alt }: { src?: string | null; alt?: string | null }) {
  return (
    <section className="home-hero" aria-label="Al Afrah marble furniture">
      <div className="home-hero-media">
        {src ? (
          <Image src={src} alt={alt ?? "Natural stone furniture in the Al Afrah workshop"} fill priority sizes="(max-width: 760px) 100vw, 72vw" />
        ) : (
          <div className="home-hero-art" />
        )}
      </div>
      <div className="home-hero-copy">
        <p className="eyebrow">Dubai stone workshop</p>
        <h1>Stone, shaped<br /><em>for living.</em></h1>
        <p>Tables and objects finished from natural stone for a considered home.</p>
        <div>
          <Link className="btn btn-primary" href="/collections"><span>Shop furniture</span><b aria-hidden="true">↗</b></Link>
          <Link className="btn btn-outline" href="/custom-table"><span>Create bespoke</span><b aria-hidden="true">↗</b></Link>
        </div>
        <dl className="home-hero-meta">
          <div><dt>Workshop</dt><dd>Dubai, UAE</dd></div>
          <div><dt>Service</dt><dd>Delivery & installation</dd></div>
        </dl>
      </div>
    </section>
  );
}
