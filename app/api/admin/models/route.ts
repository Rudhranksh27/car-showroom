import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminUser } from "../../../lib/admin-auth";
import { getModelsCollection, toSlug } from "../../../lib/mongodb-catalog";
import { parseModelExtras } from "../../../lib/model-fields";

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId");

  try {
    const col = await getModelsCollection();
    const filter = brandId ? { brandId } : {};
    const models = await col.find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({
      models: models.map((m) => ({ ...m, _id: m._id!.toString() })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { brandId, brandSlug, brandName, name, slug: slugInput, type, fuels, priceMin, priceMax, specs } =
    body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim())
    return NextResponse.json({ error: "Model name is required" }, { status: 400 });
  if (typeof brandId !== "string" || !brandId)
    return NextResponse.json({ error: "Brand is required" }, { status: 400 });
  if (typeof type !== "string" || !type)
    return NextResponse.json({ error: "Body type is required" }, { status: 400 });
  if (!Array.isArray(fuels) || fuels.length === 0)
    return NextResponse.json({ error: "At least one fuel type is required" }, { status: 400 });
  if (typeof priceMin !== "number" || typeof priceMax !== "number")
    return NextResponse.json({ error: "Price range is required" }, { status: 400 });
  if (typeof specs !== "string" || !specs.trim())
    return NextResponse.json({ error: "Specs are required" }, { status: 400 });

  const slug = toSlug(typeof slugInput === "string" && slugInput.trim() ? slugInput : name);
  if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  try {
    const col = await getModelsCollection();
    const existing = await col.findOne({ slug });
    if (existing) return NextResponse.json({ error: "Model with this slug already exists" }, { status: 409 });

    const doc = {
      _id: new ObjectId(),
      brandId: brandId as string,
      brandSlug: typeof brandSlug === "string" ? brandSlug : "",
      brandName: typeof brandName === "string" ? brandName : "",
      name: name.trim(),
      slug,
      type: type as string,
      fuels: fuels as string[],
      priceMin: priceMin as number,
      priceMax: priceMax as number,
      specs: (specs as string).trim(),
      ...parseModelExtras(body as Record<string, unknown>).set,
      createdAt: new Date(),
    };
    await col.insertOne(doc);
    return NextResponse.json({ model: { ...doc, _id: doc._id.toString() } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create model" }, { status: 500 });
  }
}
