import { NextResponse } from "next/server";
import { z } from "zod";
import { findOrderForTracking, isOrderTrackingConfigured } from "../../../../lib/order-tracking";

const lookupSchema = z.object({
  order: z.string().trim().min(1).max(64).regex(/^#?[A-Za-z0-9][A-Za-z0-9-]*$/),
  email: z.string().trim().email().max(254),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a valid order number and email address." }, { status: 400 });
  }

  const input = lookupSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json({ error: "Enter a valid order number and email address." }, { status: 400 });
  }

  if (!isOrderTrackingConfigured) {
    return NextResponse.json(
      { error: "Order tracking is not available yet. Please contact our workshop for help." },
      { status: 503 },
    );
  }

  try {
    const order = await findOrderForTracking(input.data.order, input.data.email);
    if (!order) {
      return NextResponse.json(
        { error: "We could not find an order matching those details. Check your order number and email, then try again." },
        { status: 404 },
      );
    }
    return NextResponse.json({ order }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Shopify order tracking lookup failed", error);
    return NextResponse.json(
      { error: "We could not check your order right now. Please try again or contact our workshop." },
      { status: 502 },
    );
  }
}
