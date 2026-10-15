import { notFound } from "next/navigation";
import { ObjectId, type WithId } from "mongodb";
import { getBrandsCollection } from "../../../../lib/mongodb-catalog";
import type { BrandDoc } from "../../../../lib/catalog-types";
import BrandModelsPanel from "../../../components/BrandModelsPanel";
import AdminBreadcrumb from "../../../components/AdminBreadcrumb";

type Params = { params: Promise<{ id: string }> };

export default async function BrandDetailPage({ params }: Params) {
  const { id } = await params;

  let brand: WithId<BrandDoc> | null = null;
  try {
    const col = await getBrandsCollection();
    brand = await col.findOne({ _id: new ObjectId(id) });
  } catch {
    notFound();
  }
  if (!brand) notFound();

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Brands", href: "/admin/brands" }, { label: brand.name }]} />
      <BrandModelsPanel
        brandId={id}
        brandName={brand.name}
        brandSlug={brand.slug}
      />
    </div>
  );
}
