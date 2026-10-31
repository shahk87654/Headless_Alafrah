"use client";

import { useState } from "react";

export default function CustomTable() {
  const [material, setMaterial] = useState("Calacatta");
  const [length, setLength] = useState(180);
  const [width, setWidth] = useState(90);
  const [shape, setShape] = useState("Rectangular");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const stones = ["Calacatta", "Travertine", "Onyx", "Arabescato", "Jungle Green"];
  const steps = ["Type and shape", "Stone", "Dimensions", "Base and finish", "Details and images", "Contact", "Review"];
  const low = Math.round((length * width * 0.28 + 3000) / 100) * 100;
  const high = Math.round((length * width * 0.42 + 4500) / 100) * 100;

  if (submitted) {
    return (
      <section className="centred rack">
        <h1>Quote request sent</h1>
        <p>Your reference is {submitted}. We will check dimensions, stone availability and delivery.</p>
        <p>The workshop will reply with a confirmed price and lead time.</p>
        <p>Keep the reference number for your order.</p>
      </section>
    );
  }

  return (
    <section className="section rack">
      <h1>Design a custom table</h1>
      <div className="span-7 preview-slab" aria-label={`${shape} table preview, ${length} by ${width} centimetres`}>
        <svg viewBox="0 0 700 460" role="img" aria-label="Custom table dimensions preview">
          <rect x="100" y="100" width={Math.min(500, 80 + length * 1.3)} height={Math.min(260, 50 + width * 1.3)} rx={shape === "Rounded" ? 28 : 0} fill="#D8CCB5" stroke="#16181B" strokeWidth="2" />
          <text x="350" y="220" textAnchor="middle" fill="#16181B">{length} × {width} cm</text>
          <path d="M100 360 H600" stroke="#16181B" />
          <text x="350" y="390" textAnchor="middle" fill="#16181B">{shape}</text>
        </svg>
      </div>
      <div className="span-5 stack steps">
        <ol aria-label="Custom table steps">
          {steps.map((name, index) => (
            <li key={name} aria-current={index === step ? "step" : undefined}>{name}</li>
          ))}
        </ol>
        <h2>{steps[step]}</h2>
        {step === 0 && (
          <div className="segmented">
            {["Rectangular", "Rounded", "Round", "Organic"].map((name) => (
              <button key={name} type="button" aria-pressed={shape === name} onClick={() => setShape(name)}>{name}</button>
            ))}
          </div>
        )}
        {step === 1 && (
          <select className="field" value={material} onChange={(event) => setMaterial(event.target.value)}>
            {stones.map((stone) => <option key={stone}>{stone}</option>)}
          </select>
        )}
        {step === 2 && (
          <>
            <label className="field">Length {length} cm<input aria-label="Table length" type="range" min={80} max={300} value={length} onChange={(event) => setLength(Number(event.target.value))} /></label>
            <label className="field">Width {width} cm<input aria-label="Table width" type="range" min={50} max={150} value={width} onChange={(event) => setWidth(Number(event.target.value))} /></label>
          </>
        )}
        {step === 3 && (
          <select className="field" defaultValue="Pedestal"><option>Pedestal</option><option>Metal frame</option><option>Stone plinth</option><option>Honed</option><option>Polished</option></select>
        )}
        {step === 4 && (
          <label className="field">Room photos and dimensions<input type="file" accept="image/*" multiple /></label>
        )}
        {step === 5 && (
          <form className="stack">
            <label className="field">Name<input required name="name" /></label>
            <label className="field">Email<input required type="email" name="email" /></label>
            <label className="field">Phone / WhatsApp<input required name="phone" /></label>
          </form>
        )}
        {step === 6 && (
          <dl>
            <dt>Shape</dt><dd>{shape}</dd><dt>Stone</dt><dd>{material}</dd><dt>Dimensions</dt><dd>{length} × {width} cm</dd>
          </dl>
        )}
        <p className="tabular">Estimate, final quote from our team: AED {low.toLocaleString("en-AE")}–AED {high.toLocaleString("en-AE")}</p>
        <div className="cluster">
          {step > 0 && <button className="btn btn-outline" type="button" onClick={() => setStep((value) => value - 1)}>Back</button>}
          {step < steps.length - 1 ? (
            <button className="btn btn-primary" type="button" onClick={() => setStep((value) => value + 1)}>Continue</button>
          ) : (
            <button className="btn btn-primary" type="button" onClick={() => setSubmitted(`CQ-${String(Date.now()).slice(-6)}`)}>Request a quote</button>
          )}
        </div>
      </div>
    </section>
  );
}
