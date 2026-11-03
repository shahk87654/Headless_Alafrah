import { NextRequest, NextResponse } from "next/server";
import { resolveCheckoutUrl } from "../../lib/checkout";
import { shopifyFetch } from "../../lib/shopify";

export async function GET(request: NextRequest) {
  const cartId = request.nextUrl.searchParams.get("cartId");
  if (!cartId || !cartId.startsWith("gid://shopify/Cart/")) {
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

    let checkoutUrl: string;
    try {
      checkoutUrl = resolveCheckoutUrl(data.cart.checkoutUrl);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Shopify checkout is not configured correctly." },
        { status: 503 },
      );
    }

    return NextResponse.redirect(checkoutUrl, { status: 303, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Shopify could not prepare checkout. Try again." },
      { status: 502 },
    );
  }
}
