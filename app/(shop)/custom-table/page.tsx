"use client";

import { CSSProperties, FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus, MessageCircle, Ruler, ShieldCheck } from "lucide-react";
import { hexForMaterial } from "../../../lib/stones";

const shapes = ["Rectangular", "Rounded", "Round", "Organic"];
const stones = ["Calacatta", "Travertine", "Onyx", "Arabescato", "Jungle Green", "Emperador Dark"];
const bases = ["Pedestal", "Stone plinth", "Metal frame", "Bookmatched pair"];
const finishes = ["Polished", "Honed", "Leathered"];

export default function CustomTable({ initialProduct }: { initialProduct?: string }) {
  const [sourceProduct, setSourceProduct] = useState(initialProduct);
  const [material, setMaterial] = useState("Calacatta");
  const [length, setLength] = useState(180);
  const [width, setWidth] = useState(90);
  const [height, setHeight] = useState(76);
  const [shape, setShape] = useState("Rectangular");
  const [base, setBase] = useState("Pedestal");
  const [finish, setFinish] = useState("Polished");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const steps = ["Design", "Dimensions", "Finish", "Details"];

  useEffect(() => {
    if (!initialProduct) {
      setSourceProduct(new URLSearchParams(window.location.search).get("product") ?? undefined);
    }
  }, [initialProduct]);

  const low = Math.round((length * width * 0.28 + 3000) / 100) * 100;
  const high = Math.round((length * width * 0.42 + 4500) / 100) * 100;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(`CQ-${String(Date.now()).slice(-6)}`);
  }

  if (submitted) {
    return (
      <section className="custom-success">
        <div className="custom-success-mark"><Check size={30} /></div>
        <p className="eyebrow">Request received</p>
        <h1>Your table is being considered by the workshop</h1>
        <p>Reference <strong>{submitted}</strong></p>
        <p>We will review the dimensions, stone availability, room photographs and delivery requirements, then respond with a confirmed quote and lead time.</p>
        <a className="btn btn-primary" href="/collections">Continue browsing</a>
      </section>
    );
  }

  return (
    <div className="custom-table-page">
      <header className="custom-table-heading">
        <p className="eyebrow"><span /> Bespoke furniture studio <span className="custom-heading-edition">Dubai · Made to order</span></p>
        <h1>A table, your way.<br /><em>Made in stone.</em></h1>
        <p>Shape the piece around your room. Choose the form, proportions and natural stone; our Dubai workshop will refine the details with you.</p>
        <div className="custom-heading-foot"><span>01 — 04 / DESIGN YOUR PIECE</span><span>Natural stone · Made to measure</span></div>
      </header>

      <section className="custom-table-builder">
        <div className="custom-preview">
          <div className="custom-preview-top">
            <span>Live specification</span>
            <strong>{length} × {width} × {height} cm</strong>
          </div>
          <div className="custom-preview-stage" style={{ "--preview-stone": hexForMaterial(material) } as CSSProperties} aria-label={`${shape} table in ${material}, ${length} by ${width} centimetres`}>
            <div className={`custom-table-model shape-${shape.toLowerCase()}`}>
              <div className="custom-table-top">
                {finish !== "Honed" && <span className="stone-veining vein-one" />}
                {finish !== "Honed" && <span className="stone-veining vein-two" />}
              </div>
              <div className={`custom-table-base base-${base.toLowerCase().replaceAll(" ", "-")}`} />
            </div>
            <div className="preview-shadow" />
          </div>
          <div className="custom-preview-footer">
            <div><span>Stone</span><strong>{material}</strong></div>
            <div><span>Finish</span><strong>{finish}</strong></div>
            <div><span>Shape</span><strong>{shape}</strong></div>
          </div>
        </div>

        <div className="custom-configurator">
          <div className="custom-progress" aria-label="Quote steps">
            {steps.map((name, index) => (
              <button type="button" key={name} className={index <= step ? "is-active" : ""} aria-current={index === step ? "step" : undefined} onClick={() => setStep(index)}>
                <span>{index < step ? <Check size={13} /> : index + 1}</span>
                <small>{name}</small>
              </button>
            ))}
          </div>

          <div className="custom-step-body">
            <p className="eyebrow">Step {step + 1} of {steps.length}</p>
            <h2>{["Choose the form", "Set the proportions", "Select stone and finish", "Tell us about the space"][step]}</h2>

            {step === 0 && (
              <div className="custom-options">
                <fieldset>
                  <legend>Table shape</legend>
                  <div className="shape-options">
                    {shapes.map((name) => (
                      <button type="button" key={name} className={shape === name ? "is-selected" : ""} aria-pressed={shape === name} onClick={() => setShape(name)}>
                        <span className={`shape-icon shape-${name.toLowerCase()}`} />
                        <strong>{name}</strong>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Base style</legend>
                  <div className="text-options">
                    {bases.map((name) => (
                      <button type="button" key={name} className={base === name ? "is-selected" : ""} aria-pressed={base === name} onClick={() => setBase(name)}>{name}</button>
                    ))}
                  </div>
                </fieldset>
                {sourceProduct && <p className="custom-product-note">Based on <strong>{sourceProduct.replaceAll("-", " ")}</strong></p>}
              </div>
            )}

            {step === 1 && (
              <div className="dimension-controls">
                {[
                  { label: "Length", value: length, setter: setLength, min: 80, max: 300 },
                  { label: "Width", value: width, setter: setWidth, min: 50, max: 150 },
                  { label: "Height", value: height, setter: setHeight, min: 70, max: 110 },
                ].map(({ label, value, setter, min, max }) => (
                  <label className="dimension-control" key={String(label)}>
                    <span><strong>{label}</strong><output>{value} cm</output></span>
                    <input type="range" min={min} max={max} value={value} onChange={(event) => setter(Number(event.target.value))} />
                    <small>{min}–{max} cm</small>
                  </label>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="custom-options">
                <fieldset>
                  <legend>Natural stone</legend>
                  <div className="stone-options">
                    {stones.map((name) => (
                      <button type="button" key={name} className={material === name ? "is-selected" : ""} aria-pressed={material === name} onClick={() => setMaterial(name)}>
                        <span style={{ backgroundColor: hexForMaterial(name) }} />
                        <strong>{name}</strong>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Surface finish</legend>
                  <div className="text-options finish-options">
                    {finishes.map((name) => (
                      <button type="button" key={name} className={finish === name ? "is-selected" : ""} aria-pressed={finish === name} onClick={() => setFinish(name)}>{name}</button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 3 && (
              <form id="custom-quote-form" className="custom-contact-form" onSubmit={submit}>
                <div className="custom-form-grid">
                  <label className="field">Name<input required name="name" autoComplete="name" /></label>
                  <label className="field">Phone / WhatsApp<input required name="phone" autoComplete="tel" /></label>
                  <label className="field">Email<input required type="email" name="email" autoComplete="email" /></label>
                  <label className="field">Delivery location<input name="location" placeholder="Dubai, Abu Dhabi..." /></label>
                </div>
                <label className="field">Project notes<textarea name="notes" placeholder="Share ceiling height, room layout, seating, or installation requirements." /></label>
                <label className="photo-upload">
                  <input type="file" accept="image/*" multiple onChange={(event) => setPhotoNames(Array.from(event.target.files ?? []).map((file) => file.name))} />
                  <ImagePlus size={20} />
                  <span><strong>{photoNames.length ? `${photoNames.length} room photo${photoNames.length > 1 ? "s" : ""} selected` : "Add room photos"}</strong><small>{photoNames.length ? photoNames.join(", ") : "Optional · JPG or PNG"}</small></span>
                </label>
              </form>
            )}
          </div>

          <div className="custom-estimate">
            <div>
              <span>Estimated range</span>
              <strong className="tabular">AED {low.toLocaleString("en-AE")}–{high.toLocaleString("en-AE")}</strong>
              <small>Final pricing is confirmed by the workshop</small>
            </div>
            <div className="custom-step-actions">
              {step > 0 && <button className="btn btn-outline" type="button" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={16} /> Back</button>}
              {step < steps.length - 1 ? (
                <button className="btn btn-primary" type="button" onClick={() => setStep((value) => value + 1)}>Continue <ArrowRight size={16} /></button>
              ) : (
                <button className="btn btn-primary" type="submit" form="custom-quote-form">Request quote</button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="custom-assurances" aria-label="Custom furniture service">
        <div><Ruler size={22} /><span><strong>Made to proportion</strong><small>Scaled for your room</small></span></div>
        <div><ShieldCheck size={22} /><span><strong>Workshop reviewed</strong><small>Stone and construction checked</small></span></div>
        <a href="https://wa.me/971558410712" target="_blank" rel="noreferrer"><MessageCircle size={22} /><span><strong>Need guidance?</strong><small>Speak with our team</small></span></a>
      </section>
    </div>
  );
}
