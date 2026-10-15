import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminUser } from "../../../../../lib/admin-auth";
import { getVariantsCollection } from "../../../../../lib/mongodb-catalog";
import { sanitizeSubVariants } from "../../../../../lib/sub-variants";

type Params = { params: Promise<{ id: string }> };

// Replaces the full list of sub-variants of one variant.
export async function PUT(request: Request, { params }: Params) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subVariants = sanitizeSubVariants((body as Record<string, unknown>)?.subVariants);
  if (typeof subVariants === "string") return NextResponse.json({ error: subVariants }, { status: 400 });

  try {
    const col = await getVariantsCollection();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { subVariants } },
      { returnDocument: "after" },
    );
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ variant: { ...result, _id: result._id!.toString() } });
  } catch {
    return NextResponse.json({ error: "Failed to save sub-variants" }, { status: 500 });
  }
}
