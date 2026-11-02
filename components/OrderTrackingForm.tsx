"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, PackageCheck } from "lucide-react";
import type { TrackedOrder } from "../lib/order-tracking-types";

function isTrackedOrder(value: unknown): value is TrackedOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<TrackedOrder>;
  return (
    typeof order.name === "string" &&
    typeof order.displayFulfillmentStatus === "string" &&
    (typeof order.processedAt === "string" || order.processedAt === null) &&
    Array.isArray(order.trackingInfo)
  );
}

function isErrorResponse(value: unknown): value is { error: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    "error" in value &&
    typeof value.error === "string"
  );
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function OrderTrackingForm() {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrder(null);
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: formData.get("order"),
          email: formData.get("email"),
        }),
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setError(
          isErrorResponse(payload)
            ? payload.error
            : "We could not check your order right now. Please try again.",
        );
        return;
      }

      if (!payload || typeof payload !== "object" || !("order" in payload) || !isTrackedOrder(payload.order)) {
        setError("We received an unexpected response. Please try again.");
        return;
      }
      setOrder(payload.order);
    } catch {
      setError("We could not connect to order tracking. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="account-form" onSubmit={submit}>
        <div className="account-form-heading">
          <PackageCheck size={24} />
          <div><p className="eyebrow">Delivery status</p><h2>Track an order</h2></div>
        </div>
        <label>
          Order number
          <input name="order" type="text" placeholder="e.g. #1001" autoComplete="off" required />
        </label>
        <label>
          Email address
          <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </label>
        <button className="account-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Checking order..." : "Find my order"} <ArrowRight size={17} />
        </button>
      </form>

      {error && <p className="account-message order-tracking-error" role="alert">{error}</p>}
      {order && (
        <section className="order-tracking-result" aria-live="polite">
          <p className="eyebrow">Order {order.name}</p>
          <h3>{formatStatus(order.displayFulfillmentStatus)}</h3>
          {order.processedAt && (
            <p>Placed {new Intl.DateTimeFormat("en-AE", { dateStyle: "long" }).format(new Date(order.processedAt))}</p>
          )}
          {order.trackingInfo.length > 0 ? (
            <ul>
              {order.trackingInfo.map((tracking, index) => (
                <li key={`${tracking.number ?? "shipment"}-${index}`}>
                  <span>{tracking.company || "Shipment"}{tracking.number ? ` · ${tracking.number}` : ""}</span>
                  {tracking.url && <a href={tracking.url} target="_blank" rel="noreferrer">Track shipment</a>}
                </li>
              ))}
            </ul>
          ) : (
            <p>Tracking details will appear here once your order has shipped.</p>
          )}
        </section>
      )}
    </>
  );
}
