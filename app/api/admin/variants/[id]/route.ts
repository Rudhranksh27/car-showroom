import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminUser } from "../../../../lib/admin-auth";
import { getVariantsCollection } from "../../../../lib/mongodb-catalog";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, description, fuel, transmission, specs, price } = body as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  try {
    const col = await getVariantsCollection();
    const update: Record<string, unknown> = { name: name.trim(), fuel, transmission, specs, price };
    if (typeof description === "string") update.description = description.trim() || undefined;

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" },
    );
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ variant: { ...result, _id: result._id!.toString() } });
  } catch {
    return NextResponse.json({ error: "Failed to update variant" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const col = await getVariantsCollection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete variant" }, { status: 500 });
  }
}
