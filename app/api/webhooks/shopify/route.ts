import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createHmac, timingSafeEqual } from "crypto";
export async function POST(request: NextRequest){const raw=await request.text();const secret=process.env.SHOPIFY_WEBHOOK_SECRET;if(!secret)return NextResponse.json({error:"Webhook secret not configured"},{status:503});const signature=request.headers.get("x-shopify-hmac-sha256")??"";const digest=createHmac("sha256",secret).update(raw,"utf8").digest("base64");if(signature.length!==digest.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(digest)))return NextResponse.json({error:"Invalid signature"},{status:401});revalidateTag("shopify","max");return NextResponse.json({revalidated:true});}
