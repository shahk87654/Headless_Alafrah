"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function BookmatchHero({ src, alt }: { src?: string | null; alt?: string | null }) {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem("alafrah-hero") === "closed") {
      const frame = window.requestAnimationFrame(() => setClosed(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const frame = window.requestAnimationFrame(() => {
      setClosed(true);
      sessionStorage.setItem("alafrah-hero", "closed");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className={`bookmatch${closed ? " is-closed" : ""}`} aria-label="Bookmatched slab">
      <div className="bookmatch-half is-left">
        {src ? (
          <Image src={src} alt={alt ?? "Bookmatched marble slab"} fill priority sizes="50vw" />
        ) : (
          <div className="flat" />
        )}
      </div>
      <div className="bookmatch-copy">
        <h1>Stone cut to your room</h1>
      </div>
      <div className="bookmatch-half is-right">
        {src ? <Image src={src} alt="" fill priority sizes="50vw" /> : <div className="flat" />}
      </div>
    </section>
  );
}
