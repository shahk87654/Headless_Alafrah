import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "../../lib/shopify";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const cartId = formData.get("cartId");

  if (typeof cartId !== "string" || !cartId.startsWith("gid://shopify/Cart/")) {
    return NextResponse.json({ error: "A valid Shopify cart is required to start checkout." }, { status: 400 });
  }

  try {
    const data = await shopifyFetch<{ cart: { checkoutUrl: string } | null }>(
      "query CheckoutCart($cartId:ID!) { cart(id:$cartId) { checkoutUrl } }",
      { cartId },
    );

    if (!data.cart) {
      return NextResponse.json({ error: "This cart has expired. Return to your cart and try again." }, { status: 410 });
    }

    let checkoutUrl: URL;
    try {
      checkoutUrl = new URL(data.cart.checkoutUrl);
    } catch {
      return NextResponse.json({ error: "Shopify returned an invalid checkout URL." }, { status: 502 });
    }

    if (checkoutUrl.protocol !== "https:" || checkoutUrl.username || checkoutUrl.password) {
      return NextResponse.json({ error: "Shopify returned an unsafe checkout URL." }, { status: 502 });
    }

    return NextResponse.redirect(checkoutUrl, {
      status: 303,
      headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
    });
  } catch (error) {
    console.error("Shopify checkout handoff failed:", error);
    return NextResponse.json(
      { error: "Shopify could not prepare checkout. Please try again." },
      { status: 502 },
    );
  }
}
