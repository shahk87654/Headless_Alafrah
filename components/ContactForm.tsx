"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Website enquiry from ${form.get("name")}`);
    const body = encodeURIComponent(`${form.get("message")}\n\nFrom: ${form.get("name")}\nEmail: ${form.get("email")}\nPhone: ${form.get("phone") ?? ""}`);
    window.location.href = `mailto:info@alafrahtechnical.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-field-row">
        <label>Name<input name="name" autoComplete="name" required placeholder="Your name" /></label>
        <label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="+971" /></label>
      </div>
      <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
      <label>How can we help?<textarea name="message" rows={5} required placeholder="Tell us about your room, dimensions or stone preference" /></label>
      <button className="btn contact-submit" type="submit"><span>Send enquiry</span><span aria-hidden="true">↗</span></button>
      {sent && <p className="contact-success" role="status">Your email application is opening.</p>}
    </form>
  );
}
