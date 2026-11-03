"use client";

import { useState } from "react";
import Link from "next/link";

const materials = {
  Calacatta: { note: "A soft white canvas, drawn through with expressive grey veins.", handle: "calacatta-marble", art: "material-calacatta" },
  Travertine: { note: "Warm, tactile layers with the quiet character of natural pores.", handle: "travertine-marble", art: "material-travertine" },
  Onyx: { note: "Translucent bands and a depth that shifts with the light.", handle: "onyx-marble", art: "material-onyx" },
  Arabescato: { note: "Fluid graphite movement set against a luminous white ground.", handle: "arabescato-marble", art: "material-arabescato" },
};

const materialNames = Object.keys(materials) as Array<keyof typeof materials>;

export default function InteractiveHome() {
  const [selected, setSelected] = useState<keyof typeof materials>("Travertine");
  const material = materials[selected];

  return (
    <section className="home-materials section" aria-labelledby="home-materials-title">
      <div className="home-materials-inner rack">
        <div className="home-materials-copy span-5">
          <p className="eyebrow">The material, first</p>
          <h2 id="home-materials-title">Every stone has its own story.</h2>
          <p>Veins, pores, and subtle shifts in colour make every surface its own. Choose a stone to get to know it.</p>
          <div className="home-material-options" role="group" aria-label="Choose a stone">
            {materialNames.map((name) => (
              <button
                type="button"
                key={name}
                aria-pressed={selected === name}
                aria-controls="home-material-detail"
                className={`home-material-option ${selected === name ? "is-active" : ""}`}
                onClick={() => setSelected(name)}
              >
                <span className={`home-material-dot material-${name.toLowerCase()}`} aria-hidden="true" />
                {name}
                <span className="sr-only">{selected === name ? ", selected" : ""}</span>
              </button>
            ))}
          </div>
          <div className="home-material-detail" id="home-material-detail" aria-live="polite">
            <p>{material.note}</p>
            <Link href={`/collections/${material.handle}`}>Explore {selected} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className={`home-material-preview ${material.art}`} role="img" aria-label={`${selected} stone surface`} key={selected}>
          <span className="home-material-preview-index">STONE STUDY <b>0{materialNames.indexOf(selected) + 1}</b></span>
          <span className="home-material-preview-name">{selected}</span>
          <span className="home-material-preview-mark" aria-hidden="true">A</span>
        </div>
      </div>
    </section>
  );
}
