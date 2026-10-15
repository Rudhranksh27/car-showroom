import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminUser } from "../../../lib/admin-auth";
import { getVariantsCollection } from "../../../lib/mongodb-catalog";

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const modelId = searchParams.get("modelId");

  try {
    const col = await getVariantsCollection();
    const filter = modelId ? { modelId } : {};
    const variants = await col.find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({
      variants: variants.map((v) => ({ ...v, _id: v._id!.toString() })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { modelId, modelSlug, modelName, name, description, fuel, transmission, specs, price } =
    body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim())
    return NextResponse.json({ error: "Variant name is required" }, { status: 400 });
  if (typeof modelId !== "string" || !modelId)
    return NextResponse.json({ error: "Model is required" }, { status: 400 });
  if (typeof fuel !== "string" || !fuel)
    return NextResponse.json({ error: "Fuel type is required" }, { status: 400 });
  if (typeof transmission !== "string" || !transmission)
    return NextResponse.json({ error: "Transmission is required" }, { status: 400 });
  if (typeof specs !== "string" || !specs.trim())
    return NextResponse.json({ error: "Specs are required" }, { status: 400 });
  if (typeof price !== "string" || !price.trim())
    return NextResponse.json({ error: "Price is required" }, { status: 400 });

  try {
    const col = await getVariantsCollection();
    const doc = {
      _id: new ObjectId(),
      modelId: modelId as string,
      modelSlug: typeof modelSlug === "string" ? modelSlug : "",
      modelName: typeof modelName === "string" ? modelName : "",
      name: name.trim(),
      description: typeof description === "string" && description.trim() ? description.trim() : undefined,
      fuel: fuel as string,
      transmission: transmission as string,
      specs: (specs as string).trim(),
      price: (price as string).trim(),
      createdAt: new Date(),
    };
    await col.insertOne(doc);
    return NextResponse.json({ variant: { ...doc, _id: doc._id.toString() } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create variant" }, { status: 500 });
  }
}
