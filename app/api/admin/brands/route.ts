import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminUser } from "../../../lib/admin-auth";
import { getBrandsCollection, toSlug } from "../../../lib/mongodb-catalog";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const col = await getBrandsCollection();
    const brands = await col.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({
      brands: brands.map((b) => ({ ...b, _id: b._id!.toString() })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, logo, established, soldThisYear, soldThisMonth, serviceCenters } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 1)
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });

  const slug = toSlug(name);
  try {
    const col = await getBrandsCollection();
    const existing = await col.findOne({ slug });
    if (existing) return NextResponse.json({ error: "Brand with this name already exists" }, { status: 409 });

    const toNum = (v: unknown) => { const n = Number(v); return isNaN(n) ? undefined : n; };
    const doc = {
      _id: new ObjectId(),
      name: name.trim(),
      slug,
      logo: typeof logo === "string" && logo.trim() ? logo.trim() : undefined,
      established: typeof established === "string" && established.trim() ? established.trim() : undefined,
      soldThisYear: toNum(soldThisYear),
      soldThisMonth: toNum(soldThisMonth),
      serviceCenters: toNum(serviceCenters),
      createdAt: new Date(),
    };
    await col.insertOne(doc);
    return NextResponse.json({ brand: { ...doc, _id: doc._id.toString() } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
