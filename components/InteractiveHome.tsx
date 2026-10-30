"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Gem, Ruler, ShieldCheck, Truck } from "lucide-react";

const materials = {
  Calacatta: { label: "Calacatta", note: "Soft white with expressive grey veining", tone: "calacatta" },
  Travertine: { label: "Travertine", note: "Warm mineral texture with timeless character", tone: "travertine" },
  Onyx: { label: "Onyx", note: "Deep colour and translucent natural depth", tone: "onyx" },
  Arabescato: { label: "Arabescato", note: "Fluid veining with sculptural movement", tone: "arabescato" },
};

export default function InteractiveHome() {
  const [selected, setSelected] = useState<keyof typeof materials>("Calacatta");
  const material = materials[selected];

  return (
    <>
      <section className="service-card-grid section-card-grid" aria-label="Bespoke services">
        <Link className="service-card" href="/custom-table"><span className="service-card-icon"><Ruler size={18} /></span><div><p>01 / Bespoke</p><h3>Made to your dimensions</h3><span>Configure a piece <ArrowUpRight size={15} /></span></div></Link>
        <Link className="service-card" href="/collections"><span className="service-card-icon"><Gem size={18} /></span><div><p>02 / Materials</p><h3>Curated natural stone</h3><span>Explore the library <ArrowUpRight size={15} /></span></div></Link>
        <Link className="service-card" href="/pages/shipping"><span className="service-card-icon"><Truck size={18} /></span><div><p>03 / Delivery</p><h3>White-glove UAE delivery</h3><span>View delivery <ArrowUpRight size={15} /></span></div></Link>
        <Link className="service-card" href="/pages/returns"><span className="service-card-icon"><ShieldCheck size={18} /></span><div><p>04 / Assurance</p><h3>Craftsmanship protected</h3><span>Learn about care <ArrowUpRight size={15} /></span></div></Link>
      </section>

      <section className="interactive-material section-card-grid">
        <div className="interactive-material-copy">
          <p className="eyebrow">Stone configurator</p>
          <h2>Begin with the material.</h2>
          <p>Compare four signature stones. Your selected surface will shape the character of the finished piece.</p>
          <div className="material-tabs" role="tablist" aria-label="Marble materials">
            {(Object.keys(materials) as Array<keyof typeof materials>).map((name) => (
              <button key={name} role="tab" aria-selected={selected === name} className={selected === name ? "active" : ""} onClick={() => setSelected(name)}>{name}</button>
            ))}
          </div>
        </div>
        <div className="stone-preview-card" role="tabpanel">
          <div className={`stone-surface ${material.tone}`}><span>Selected finish</span></div>
          <div className="stone-preview-footer"><div><small>{material.label}</small><strong>{material.note}</strong></div><Link href={`/collections/${material.label.toLowerCase()}-marble`} aria-label={`Explore ${material.label}`}><ArrowUpRight size={18} /></Link></div>
        </div>
      </section>

      <section className="section-card-grid design-card-grid">
        <article className="design-card design-card-dark"><p className="eyebrow">Project service</p><h3>From first sketch<br />to final installation.</h3><div className="process-list"><span><b>01</b><em>Consult</em><Check size={14} /></span><span><b>02</b><em>Design</em><Check size={14} /></span><span><b>03</b><em>Craft</em><Check size={14} /></span><span><b>04</b><em>Install</em><Check size={14} /></span></div><Link className="button button-light" href="/custom-table">Start a project</Link></article>
        <article className="design-card design-card-light"><p className="eyebrow">Trade & residential</p><h3>Designed for homes,<br />hotels and workplaces.</h3><div className="metric-grid"><div><strong>4</strong><span>Service stages</span></div><div><strong>AED</strong><span>Transparent pricing</span></div><div><strong>UAE</strong><span>Delivery coverage</span></div><div><strong>Bespoke</strong><span>Made to order</span></div></div><Link className="text-link" href="/pages/about-us">About the atelier →</Link></article>
      </section>
    </>
  );
}
