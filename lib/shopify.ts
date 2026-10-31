import { z } from "zod";

const envSchema = z.object({
  SHOPIFY_STORE_DOMAIN: z.string().optional(),
  SHOPIFY_STOREFRONT_PUBLIC_TOKEN: z.string().optional(),
  SHOPIFY_API_VERSION: z.string().optional().default("2026-01"),
});

const env = envSchema.parse(process.env);

export const isShopifyConfigured = Boolean(
  env.SHOPIFY_STORE_DOMAIN && env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN
);

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!isShopifyConfigured) {
    throw new Error("Shopify credentials are not configured. Add the environment variables documented in .env.example.");
  }
  const response = await fetch(`https://${env.SHOPIFY_STORE_DOMAIN}/api/${env.SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Shopify request failed: ${response.status}`);
  const json = await response.json();
  if (json.errors?.length) throw new Error(json.errors.map((error: { message: string }) => error.message).join("; "));
  return json.data as T;
}
