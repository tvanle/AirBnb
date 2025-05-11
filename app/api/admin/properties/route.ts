import { NextRequest, NextResponse } from "next/server";
import {
  getProperties,
  addProperty,
} from "@/app/admin/properties/data/listings";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    const listings = await getProperties();
    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/properties error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const listing = await addProperty(body);
    return NextResponse.json(listing, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/properties error:", error);
    return NextResponse.json(
      { error: error.message || "Invalid request" },
      { status: 400 },
    );
  }
}
