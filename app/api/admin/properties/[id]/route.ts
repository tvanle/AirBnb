import { NextRequest, NextResponse } from "next/server";
import {
  getProperty,
  updateProperty,
  deleteProperty,
} from "@/app/admin/properties/data/listings";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  const { id } = params;

  try {
    const listing = await getProperty(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    console.error(`GET /api/admin/properties/${id} error:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  const { id } = params;
  const body = await request.json();

  try {
    const updatedListing = await updateProperty(id, body);
    if (!updatedListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error: any) {
    console.error(`PATCH /api/admin/properties/${id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  const { id } = params;

  try {
    const deleted = await deleteProperty(id);
    if (!deleted) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`DELETE /api/admin/properties/${id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
