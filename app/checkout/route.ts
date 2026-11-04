import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "../../lib/shopify";

function checkoutDomainHost(value: string) {
  let domain: URL;
  try {
    domain = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    throw new Error("SHOPIFY_CHECKOUT_DOMAIN must be a valid Shopify-connected hostname.");
  }

  if (
    domain.protocol !== "https:" ||
    domain.username ||
    domain.password ||
    domain.port ||
    domain.pathname !== "/" ||
    domain.search ||
    domain.hash ||
    !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain.hostname)
  ) {
    throw new Error("SHOPIFY_CHECKOUT_DOMAIN must be a Shopify-connected HTTPS hostname without a path or port.");
  }

  return domain.hostname;
}

function normalizedHostname(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

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

    const configuredCheckoutDomain = process.env.SHOPIFY_CHECKOUT_DOMAIN?.trim();
    if (configuredCheckoutDomain) {
      try {
        const checkoutHostname = checkoutDomainHost(configuredCheckoutDomain);
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
        if (siteUrl && normalizedHostname(checkoutHostname) === normalizedHostname(new URL(siteUrl).hostname)) {
          throw new Error("SHOPIFY_CHECKOUT_DOMAIN must not point to the storefront domain.");
        }
        checkoutUrl.hostname = checkoutHostname;
      } catch (error) {
        console.error("Shopify checkout domain configuration error:", error);
        return NextResponse.json(
          { error: "Checkout domain configuration is invalid. Please contact support." },
          { status: 503 },
        );
      }
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
