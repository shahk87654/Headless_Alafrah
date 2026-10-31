"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, PackageCheck, UserRound } from "lucide-react";
import { SiteShell } from "../../components/SiteShell";

export default function Account() {
  const [mode, setMode] = useState<"signin" | "signup" | "tracking">("signin");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      mode === "tracking"
        ? "Your order status will be confirmed by our workshop team. Please allow a few minutes for the latest update."
        : "Online customer accounts are being enabled. Contact the workshop for access to your existing orders.",
    );
  }

  return (
    <SiteShell>
      <section className="account-page">
        <div className="account-panel account-intro">
          <p className="eyebrow">Al Afrah clients</p>
          <h1>Your pieces,<br />all in one place.</h1>
          <p>Sign in for a considered view of your orders, quotations, delivery details, and saved preferences.</p>
          <div className="account-mark">
            <span>Al Afrah</span>
            <small>Technical</small>
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

          <form className="account-form" onSubmit={submit}>
            {mode === "tracking" ? (
              <>
                <div className="account-form-heading">
                  <PackageCheck size={24} />
                  <div><p className="eyebrow">Delivery status</p><h2>Track an order</h2></div>
                </div>
                <label>Order number<input name="order" type="text" placeholder="e.g. AA-10482" required /></label>
                <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
                <button className="account-submit" type="submit">Find my order <ArrowRight size={17} /></button>
              </>
            ) : (
              <>
                <div className="account-form-heading">
                  <UserRound size={24} />
                  <div><p className="eyebrow">{mode === "signin" ? "Welcome back" : "Join Al Afrah"}</p><h2>{mode === "signin" ? "Sign in" : "Create account"}</h2></div>
                </div>
                {mode === "signup" && <label>Full name<input name="name" type="text" placeholder="Your name" required /></label>}
                <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
                <label>Password<input name="password" type="password" placeholder="At least 8 characters" minLength={8} required /></label>
                <button className="account-submit" type="submit">{mode === "signin" ? "Sign in" : "Create account"} <ArrowRight size={17} /></button>
                <button className="account-text-action" type="button" onClick={() => setMode("tracking")}>I need to track an existing order</button>
              </>
            )}
          </form>
          {message && <p className="account-message" role="status">{message}</p>}
        </div>
      </section>
    </SiteShell>
  );
}
