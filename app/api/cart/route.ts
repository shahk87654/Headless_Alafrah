import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "../../../lib/shopify";

const cartFragment = `fragment CartFields on Cart { id checkoutUrl totalQuantity lines(first:100) { nodes { id quantity merchandise { ... on ProductVariant { id title product { title handle featuredImage { url altText width height } } price { amount currencyCode } } } } } }`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, variantId, quantity = 1, cartId, lineId } = body as { action?: string; variantId?: string; quantity?: number; cartId?: string; lineId?: string };
    if (action === "add" || action === "buy") {
      if (!variantId) return NextResponse.json({ error: "Variant is required." }, { status: 400 });
      let cartIdToUse = action === "add" ? cartId : undefined;
      if (!cartIdToUse) {
        const created = await shopifyFetch<any>(`mutation CartCreate($input:CartInput!) { cartCreate(input:$input) { cart { ...CartFields } userErrors { field message } } } ${cartFragment}`, { input: { lines: [{ merchandiseId: variantId, quantity }] } });
        const result = created.cartCreate;
        if (result.userErrors?.length) return NextResponse.json({ error: result.userErrors.map((item: any) => item.message).join("; ") }, { status: 400 });
        const cart = result.cart;
        return NextResponse.json({ cartId: cart.id, checkoutUrl: cart.checkoutUrl, totalQuantity: cart.totalQuantity });
      }
      const updated = await shopifyFetch<any>(`mutation CartLinesAdd($cartId:ID!,$lines:[CartLineInput!]!) { cartLinesAdd(cartId:$cartId,lines:$lines) { cart { ...CartFields } userErrors { field message } } } ${cartFragment}`, { cartId: cartIdToUse, lines: [{ merchandiseId: variantId, quantity }] });
      const result = updated.cartLinesAdd;
      if (result.userErrors?.length) return NextResponse.json({ error: result.userErrors.map((item: any) => item.message).join("; ") }, { status: 400 });
      return NextResponse.json({ cartId: result.cart.id, checkoutUrl: result.cart.checkoutUrl, totalQuantity: result.cart.totalQuantity });
    }
    if (action === "update" || action === "remove") {
      if (!cartId || !lineId) return NextResponse.json({ error: "Cart and line are required." }, { status: 400 });
      const updated = action === "remove"
        ? await shopifyFetch<any>(`mutation CartLinesRemove($cartId:ID!,$lineIds:[ID!]!) { cartLinesRemove(cartId:$cartId,lineIds:$lineIds) { cart { ...CartFields } userErrors { field message } } } ${cartFragment}`, { cartId, lineIds: [lineId] })
        : await shopifyFetch<any>(`mutation CartLinesUpdate($cartId:ID!,$lines:[CartLineUpdateInput!]!) { cartLinesUpdate(cartId:$cartId,lines:$lines) { cart { ...CartFields } userErrors { field message } } } ${cartFragment}`, { cartId, lines: [{ id: lineId, quantity }] });
      const result = updated[action === "remove" ? "cartLinesRemove" : "cartLinesUpdate"];
      if (result.userErrors?.length) return NextResponse.json({ error: result.userErrors.map((item: any) => item.message).join("; ") }, { status: 400 });
      return NextResponse.json({ cartId: result.cart.id, checkoutUrl: result.cart.checkoutUrl, totalQuantity: result.cart.totalQuantity, lines: result.cart.lines.nodes });
    }
    return NextResponse.json({ error: "Unknown cart action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cart request failed." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const cartId = request.nextUrl.searchParams.get("id");
  if (!cartId) return NextResponse.json({ cart: null });
  try {
    const data = await shopifyFetch<any>(`query Cart($cartId:ID!) { cart(id:$cartId) { ...CartFields } } ${cartFragment}`, { cartId });
    const cart = data.cart;
    return NextResponse.json({ cart: cart ? { id: cart.id, checkoutUrl: cart.checkoutUrl, totalQuantity: cart.totalQuantity, lines: cart.lines.nodes } : null });
  } catch {
    return NextResponse.json({ cart: null });
  }
}
