# Shopify Setup

- Create a custom app with the Storefront API scopes needed by the site and add the public token to `.env.local`.
- Add the Admin API token only for server-side quote and draft-order operations.
- Configure the Customer Account API with PKCE and callback URL `/account/auth/callback`.
- Configure webhooks for products, collections, pages, articles and shop updates; send them to `/api/webhooks/shopify` with secret verification.
- Configure checkout branding, post-purchase URL, shipping and tax settings in Shopify.
