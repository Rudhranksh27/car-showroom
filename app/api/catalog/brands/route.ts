import { NextResponse } from "next/server";
import { getBrandsCollection, getModelsCollection } from "../../../lib/mongodb-catalog";

export async function GET() {
  try {
    const [brandsCol, modelsCol] = await Promise.all([getBrandsCollection(), getModelsCollection()]);
    const brands = await brandsCol.find({}).sort({ name: 1 }).toArray();

    // Count models per brand in one query
    const counts = await modelsCol.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$brandId", count: { $sum: 1 } } },
    ]).toArray();
    const countMap = new Map(counts.map((c) => [c._id, c.count]));

    return NextResponse.json({
      brands: brands.map((b) => ({
        ...b,
        _id: b._id!.toString(),
        modelCount: countMap.get(b._id!.toString()) ?? 0,
      })),
    });
  } catch {
    return NextResponse.json({ brands: [] });
  }
}
