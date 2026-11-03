function normalizedHostname(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function configuredCheckoutHost(value: string) {
  const parsed = new URL(value.includes("://") ? value : `https://${value}`);
  if (
    parsed.protocol !== "https:" ||
    !parsed.hostname ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error("SHOPIFY_CHECKOUT_DOMAIN must be a Shopify-connected HTTPS hostname.");
  }
  return parsed.host;
}

export function resolveCheckoutUrl(checkoutUrl: string) {
  let url: URL;
  try {
    url = new URL(checkoutUrl);
  } catch {
    throw new Error("Shopify returned an invalid checkout URL.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Shopify returned an insecure checkout URL.");
  }

  const checkoutDomain = process.env.SHOPIFY_CHECKOUT_DOMAIN?.trim();
  if (checkoutDomain) {
    url.host = configuredCheckoutHost(checkoutDomain);
    return url.toString();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    let siteHostname: string;
    try {
      siteHostname = new URL(siteUrl).hostname;
    } catch {
      throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
    }

    if (normalizedHostname(url.hostname) === normalizedHostname(siteHostname)) {
      throw new Error(
        "Checkout is pointing to the storefront instead of Shopify. Configure SHOPIFY_CHECKOUT_DOMAIN and connect that domain to Shopify.",
      );
    }
  }

  return url.toString();
}
