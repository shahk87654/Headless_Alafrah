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

function shopifyStoreHost(value: string) {
  const hostname = value.toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(hostname)) {
    throw new Error("SHOPIFY_STORE_DOMAIN must be a valid Shopify .myshopify.com hostname.");
  }
  return hostname;
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
      const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
      if (!storeDomain) {
        throw new Error("Shopify checkout is pointing to the storefront and the Shopify store domain is not configured.");
      }
      url.host = shopifyStoreHost(storeDomain);
    }
  }

  return url.toString();
}
