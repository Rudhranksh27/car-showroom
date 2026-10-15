import { NextResponse } from "next/server";
import { getBrandsCollection, getModelsCollection } from "../../../../lib/mongodb-catalog";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  try {
    const brandsCol = await getBrandsCollection();
    const brand = await brandsCol.findOne({ slug });
    if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const modelsCol = await getModelsCollection();
    const models = await modelsCol
      .find({ brandId: brand._id!.toString(), published: { $ne: false } })
      .sort({ priceMin: 1 })
      .toArray();

    return NextResponse.json({
      brand: { ...brand, _id: brand._id!.toString() },
      models: models.map((m) => ({ ...m, _id: m._id!.toString() })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch brand" }, { status: 500 });
  }
}
