import "server-only";

import { z } from "zod";
import type { TrackedOrder } from "./order-tracking-types";

const adminConfigSchema = z.object({
  storeDomain: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/),
  accessToken: z.string().min(1),
  apiVersion: z.string().default("2026-01"),
});

const trackingQuery = `query OrderTracking($query: String!) {
  orders(first: 10, query: $query) {
    nodes {
      name
      email
      displayFulfillmentStatus
      processedAt
      fulfillments {
        trackingInfo {
          company
          number
          url
        }
      }
    }
  }
}`;

interface ShopifyOrder {
  name: string;
  email: string | null;
  displayFulfillmentStatus: string;
  processedAt: string | null;
  fulfillments: Array<{
    trackingInfo: Array<{
      company: string | null;
      number: string | null;
      url: string | null;
    }>;
  }>;
}

interface ShopifyResponse {
  data?: {
    orders: {
      nodes: ShopifyOrder[];
    };
  };
  errors?: Array<{ message: string }>;
}

export const isOrderTrackingConfigured = Boolean(
  process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_API_TOKEN,
);

function getAdminConfig() {
  return adminConfigSchema.parse({
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
    accessToken: process.env.SHOPIFY_ADMIN_API_TOKEN,
    apiVersion: process.env.SHOPIFY_API_VERSION,
  });
}

function isSecureTrackingUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export async function findOrderForTracking(orderName: string, email: string): Promise<TrackedOrder | null> {
  const config = getAdminConfig();
  const orderNumber = orderName.trim().replace(/^#/, "");
  const normalizedEmail = email.trim().toLowerCase();
  const search = `name:${orderNumber} email:${normalizedEmail}`;
  const response = await fetch(`https://${config.storeDomain}/admin/api/${config.apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": config.accessToken,
    },
    body: JSON.stringify({ query: trackingQuery, variables: { query: search } }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Shopify Admin API request failed: ${response.status}`);

  const result = (await response.json()) as ShopifyResponse;
  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }
  if (!result.data) throw new Error("Shopify Admin API returned no order data.");

  const orderNumberNormalized = orderNumber.toLowerCase();
  const matchingOrder = result.data.orders.nodes.find(
    (order) =>
      order.name.trim().replace(/^#/, "").toLowerCase() === orderNumberNormalized &&
      order.email?.trim().toLowerCase() === normalizedEmail,
  );
  if (!matchingOrder) return null;

  return {
    name: matchingOrder.name,
    displayFulfillmentStatus: matchingOrder.displayFulfillmentStatus,
    processedAt: matchingOrder.processedAt,
    trackingInfo: matchingOrder.fulfillments.flatMap((fulfillment) =>
      fulfillment.trackingInfo
        .filter((info) => isSecureTrackingUrl(info.url))
        .map((info) => ({
          company: info.company,
          number: info.number,
          url: info.url,
        })),
    ),
  };
}
