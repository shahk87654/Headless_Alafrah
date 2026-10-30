import { z } from "zod";
import { shopifyFetch } from "./shopify";

const imageSchema = z.object({ url: z.string(), altText: z.string().nullable(), width: z.number().nullable().optional(), height: z.number().nullable().optional() });
const moneySchema = z.object({ amount: z.string(), currencyCode: z.string() });
const productSchema = z.object({
  id: z.string(), handle: z.string(), title: z.string(), description: z.string(), descriptionHtml: z.string().optional(), vendor: z.string().optional(), productType: z.string().optional().default(""), tags: z.array(z.string()).optional().default([]),
  availableForSale: z.boolean(), featuredImage: imageSchema.nullable(), images: z.object({ nodes: z.array(imageSchema) }).optional().default({ nodes: [] }),
  priceRange: z.object({ minVariantPrice: moneySchema, maxVariantPrice: moneySchema.optional() }),
  variants: z.object({ nodes: z.array(z.object({ id: z.string(), title: z.string(), availableForSale: z.boolean(), selectedOptions: z.array(z.object({ name: z.string(), value: z.string() })), price: moneySchema, compareAtPrice: moneySchema.nullable().optional(), quantityAvailable: z.number().nullable().optional(), image: imageSchema.nullable().optional() })) }).optional(),
});
const collectionSchema = z.object({ id: z.string(), handle: z.string(), title: z.string(), description: z.string(), image: imageSchema.nullable() });

export type ShopifyProduct = z.infer<typeof productSchema>;
export type ShopifyCollection = z.infer<typeof collectionSchema>;

export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{ collections: { nodes: unknown[] } }>(`query Collections($first:Int!) { collections(first:$first) { nodes { id handle title description image { url altText width height } } } }`, { first });
  const schema = z.object({ collections: z.object({ nodes: z.array(collectionSchema) }) });
  return schema.parse(data).collections.nodes;
}

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: unknown[] } }>(`query Products($first:Int!) { products(first:$first, sortKey: BEST_SELLING) { nodes { id handle title description descriptionHtml vendor availableForSale featuredImage { url altText width height } images(first:20) { nodes { url altText width height } } priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } variants(first:20) { nodes { id title availableForSale selectedOptions { name value } price { amount currencyCode } } } } } }`, { first });
  const schema = z.object({ products: z.object({ nodes: z.array(productSchema) }) });
  return schema.parse(data).products.nodes;
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: unknown | null }>(`query Product($handle:String!) { product(handle:$handle) { id handle title description descriptionHtml vendor productType tags availableForSale featuredImage { url altText width height } images(first:50) { nodes { url altText width height } } priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } variants(first:100) { nodes { id title availableForSale selectedOptions { name value } price { amount currencyCode } compareAtPrice { amount currencyCode } quantityAvailable image { url altText width height } } } } }`, { handle });
  const schema = z.object({ product: productSchema.nullable() });
  return schema.parse(data).product;
}

export async function getCollection(handle: string, first = 100): Promise<{ collection: (ShopifyCollection & { products: { nodes: ShopifyProduct[] } }) | null }> {
  const data = await shopifyFetch<{ collection: unknown | null }>(`query Collection($handle:String!,$first:Int!) { collection(handle:$handle) { id handle title description image { url altText width height } products(first:$first) { nodes { id handle title description descriptionHtml vendor productType tags availableForSale featuredImage { url altText width height } images(first:20) { nodes { url altText width height } } priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } variants(first:20) { nodes { id title availableForSale selectedOptions { name value } price { amount currencyCode } compareAtPrice { amount currencyCode } quantityAvailable image { url altText width height } } } } } } }`, { handle, first });
  const schema = z.object({ collection: collectionSchema.extend({ products: z.object({ nodes: z.array(productSchema) }) }).nullable() });
  return schema.parse(data);
}

export async function searchProducts(query: string, first = 24, after?: string): Promise<{ products: ShopifyProduct[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  const data = await shopifyFetch<{ search: { nodes: unknown[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } }>(`query Search($query:String!,$first:Int!,$after:String) { search(query:$query,first:$first,after:$after,types:[PRODUCT]) { nodes { ... on Product { id handle title description descriptionHtml vendor productType tags availableForSale featuredImage { url altText width height } images(first:20) { nodes { url altText width height } } priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } variants(first:20) { nodes { id title availableForSale selectedOptions { name value } price { amount currencyCode } compareAtPrice { amount currencyCode } quantityAvailable image { url altText width height } } } } } pageInfo { hasNextPage endCursor } } }`, { query, first, after: after ?? null });
  const schema = z.object({ search: z.object({ nodes: z.array(productSchema), pageInfo: z.object({ hasNextPage: z.boolean(), endCursor: z.string().nullable() }) }) });
  const parsed = schema.parse(data);
  return { products: parsed.search.nodes, pageInfo: parsed.search.pageInfo };
}

export function formatAED(amount: string) {
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 2 }).format(Number(amount));
}
