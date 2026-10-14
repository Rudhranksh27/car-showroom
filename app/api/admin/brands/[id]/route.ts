import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminUser } from "../../../../lib/admin-auth";
import { getBrandsCollection, toSlug } from "../../../../lib/mongodb-catalog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const col = await getBrandsCollection();
    const brand = await col.findOne({ _id: new ObjectId(id) });
    if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ brand: { ...brand, _id: brand._id!.toString() } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch brand" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, logo, established, soldThisYear, soldThisMonth, serviceCenters } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 1)
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });

  try {
    const col = await getBrandsCollection();
    const slug = toSlug(name);
    const toNum = (v: unknown) => { const n = Number(v); return isNaN(n) ? undefined : n; };
    const update: Record<string, unknown> = { name: name.trim(), slug };
    if (typeof logo === "string") update.logo = logo.trim() || undefined;
    if (typeof established === "string") update.established = established.trim() || undefined;
    update.soldThisYear = toNum(soldThisYear);
    update.soldThisMonth = toNum(soldThisMonth);
    update.serviceCenters = toNum(serviceCenters);

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" },
    );
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ brand: { ...result, _id: result._id!.toString() } });
  } catch {
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const col = await getBrandsCollection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
