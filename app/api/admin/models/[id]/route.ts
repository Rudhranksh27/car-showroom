import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminUser } from "../../../../lib/admin-auth";
import { getModelsCollection, toSlug } from "../../../../lib/mongodb-catalog";
import { parseModelExtras } from "../../../../lib/model-fields";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, slug: slugInput, type, fuels, priceMin, priceMax, specs } = body as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const slug = toSlug(typeof slugInput === "string" && slugInput.trim() ? slugInput : name);
  if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

  try {
    const col = await getModelsCollection();
    const extras = parseModelExtras(body as Record<string, unknown>);
    const update: Record<string, unknown> = {
      name: name.trim(),
      slug,
      type,
      fuels,
      priceMin,
      priceMax,
      specs,
      ...extras.set,
    };

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      Object.keys(extras.unset).length
        ? { $set: update, $unset: extras.unset }
        : { $set: update },
      { returnDocument: "after" },
    );
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ model: { ...result, _id: result._id!.toString() } });
  } catch (e) {
    if ((e as { code?: number }).code === 11000)
      return NextResponse.json({ error: "Model with this slug already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to update model" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const col = await getModelsCollection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete model" }, { status: 500 });
  }
}
