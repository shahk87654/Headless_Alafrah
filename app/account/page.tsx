"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, PackageCheck, ReceiptText, UserRound } from "lucide-react";
import { SiteShell } from "../../components/SiteShell";
import { OrderTrackingForm } from "../../components/OrderTrackingForm";

export default function Account() {
  const [mode, setMode] = useState<"signin" | "signup" | "tracking">("signin");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Online customer accounts are being enabled. Contact the workshop for access to your existing orders.");
  }

  return (
    <SiteShell>
      <section className="account-page">
        <div className="account-panel account-intro">
          <div className="account-intro-copy">
            <p className="eyebrow">Al Afrah clients</p>
            <h1>Everything for<br />your home,<br /><em>in one place.</em></h1>
            <p>View orders, delivery updates, saved pieces, and workshop quotations from your personal account.</p>
          </div>
          <div className="account-benefits" aria-label="Account benefits">
            <div><PackageCheck size={20} /><span><strong>Orders</strong><small>Track every purchase</small></span></div>
            <div><ReceiptText size={20} /><span><strong>Quotations</strong><small>Review custom estimates</small></span></div>
            <div><Heart size={20} /><span><strong>Saved pieces</strong><small>Keep your favourites</small></span></div>
          </div>
        </div>

        <div className="account-panel account-form-panel">
          <div className="account-tabs" role="tablist" aria-label="Account options">
            <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "is-active" : ""} onClick={() => { setMode("signin"); setMessage(""); }}>
              Sign in
            </button>
            <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "is-active" : ""} onClick={() => { setMode("signup"); setMessage(""); }}>
              Create account
            </button>
            <button type="button" role="tab" aria-selected={mode === "tracking"} className={mode === "tracking" ? "is-active" : ""} onClick={() => { setMode("tracking"); setMessage(""); }}>
              Track order
            </button>
          </div>

          {mode === "tracking" ? (
            <>
              <OrderTrackingForm />
              <button className="account-text-action" type="button" onClick={() => setMode("signin")}>Back to sign in</button>
              <Link className="account-text-action" href="/track-order">Open full tracking page</Link>
            </>
          ) : (
            <form className="account-form" onSubmit={submit}>
                <div className="account-form-heading">
                  <UserRound size={24} />
                  <div><p className="eyebrow">{mode === "signin" ? "Welcome back" : "Join Al Afrah"}</p><h2>{mode === "signin" ? "Sign in" : "Create account"}</h2></div>
                </div>
                {mode === "signup" && <label>Full name<input name="name" type="text" placeholder="Your name" required /></label>}
                <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
                <label>Password<input name="password" type="password" placeholder="At least 8 characters" minLength={8} required /></label>
                <button className="account-submit" type="submit">{mode === "signin" ? "Sign in" : "Create account"} <ArrowRight size={17} /></button>
                <button className="account-text-action" type="button" onClick={() => setMode("tracking")}>I need to track an existing order</button>
            </form>
          )}
          {message && <p className="account-message" role="status">{message}</p>}
        </div>
      </section>
    </SiteShell>
  );
}
