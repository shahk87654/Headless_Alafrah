# Implementation Decisions

- Used Next.js App Router and React Server Components with tag-revalidated Shopify data.
- Kept the storefront credentials-driven: without Shopify credentials, setup surfaces appear only where live data would be unavailable rather than fabricated product data.
- Visual tokens are defined after the v1 design system is removed; commerce code stays independent of styling.
- Customer Account API is documented but requires Shopify customer-account configuration and will not use the removed password customer token mutations.
- The Shopify API version is pinned through `SHOPIFY_API_VERSION`, with `2026-01` as the default.
