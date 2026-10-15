import { NextResponse } from "next/server";
import { getModelsCollection, getVariantsCollection } from "../../../../lib/mongodb-catalog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const modelsCol = await getModelsCollection();
    const model = await modelsCol.findOne({ slug: id, published: { $ne: false } });
    if (!model) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const variantsCol = await getVariantsCollection();
    const variants = await variantsCol
      .find({ modelId: model._id!.toString() })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({
      model: { ...model, _id: model._id!.toString() },
      variants: variants.map((v) => ({ ...v, _id: v._id!.toString() })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch model" }, { status: 500 });
  }
}
