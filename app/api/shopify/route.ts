import { NextResponse } from "next/server";
import { isShopifyConfigured } from "../../../lib/shopify";
export function GET(){return NextResponse.json({configured:isShopifyConfigured}, {status:200});}
