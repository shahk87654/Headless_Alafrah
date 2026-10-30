"use client";

import { useState } from "react";

export default function CustomTable() {
  const [material, setMaterial] = useState("Calacatta");
  const [length, setLength] = useState(180);

  return (
    <section>
      <h1>Design a custom table</h1>
      <p>Choose a stone and a length. We reply with a quote and a reference number.</p>
      <label>
        Material
        <select value={material} onChange={(event) => setMaterial(event.target.value)}>
          <option>Calacatta</option>
          <option>Travertine</option>
          <option>Onyx</option>
          <option>Arabescato</option>
          <option>Jungle Green</option>
        </select>
      </label>
      <label>
        Length {length} cm
        <input
          aria-label="Table length"
          type="range"
          min={80}
          max={300}
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
        />
      </label>
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000"}?text=${encodeURIComponent(`Hello, I would like a quote for a custom table in ${material}, ${length} cm long.`)}`}
        target="_blank"
        rel="noreferrer"
      >
        Request a quote
      </a>
    </section>
  );
}
