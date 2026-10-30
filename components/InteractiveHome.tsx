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
    <section aria-label="Materials">
      <h2>Start with the stone</h2>
      <p>Compare four stones we keep in the yard. The selected slab sets the look of the finished piece.</p>
      <div role="tablist" aria-label="Marble materials">
        {(Object.keys(materials) as Array<keyof typeof materials>).map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={selected === name}
            onClick={() => setSelected(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        <p>{material.label}</p>
        <p>{material.note}</p>
        <Link href={`/collections/${material.handle}`}>Shop {material.label}</Link>
      </div>
    </section>
  );
}
