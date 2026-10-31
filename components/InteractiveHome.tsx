"use client";

import { useState } from "react";
import Link from "next/link";

const materials = {
  Calacatta: { label: "Calacatta", note: "White ground with grey veining", handle: "calacatta-marble" },
  Travertine: { label: "Travertine", note: "Open pores, warm beige body", handle: "travertine-marble" },
  Onyx: { label: "Onyx", note: "Translucent bands, often backlit", handle: "onyx-marble" },
  Arabescato: { label: "Arabescato", note: "Moving grey veins on white", handle: "arabescato-marble" },
};

export default function InteractiveHome() {
  const [selected, setSelected] = useState<keyof typeof materials>("Calacatta");
  const material = materials[selected];

  return (
    <section className="home-materials section" aria-label="Materials">
      <div className="home-section-heading rack">
        <div className="span-8">
          <p className="eyebrow">Material library</p>
          <h2>Begin with stone.</h2>
        </div>
        <p className="span-4">Four distinct characters, selected for the way light, grain and proportion change a room.</p>
      </div>
      <div className="home-material-grid rack" role="tablist" aria-label="Marble materials">
        {(Object.keys(materials) as Array<keyof typeof materials>).map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={selected === name}
            onClick={() => setSelected(name)}
            className={`home-material-card material-${name.toLowerCase()} ${selected === name ? "is-active" : ""}`}
          >
            <span><small>{String(Object.keys(materials).indexOf(name) + 1).padStart(2, "0")}</small>{name}<b>↗</b></span>
          </button>
        ))}
      </div>
      <div className="home-material-detail rack" role="tabpanel">
        <p className="span-3">{material.label}</p>
        <p className="span-6">{material.note}</p>
        <Link className="span-3" href={`/collections/${material.handle}`}>Explore the collection <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
