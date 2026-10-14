import { notFound } from "next/navigation";
import { ObjectId, type WithId } from "mongodb";
import { getBrandsCollection, getModelsCollection } from "../../../../../../lib/mongodb-catalog";
import type { BrandDoc, ModelDoc } from "../../../../../../lib/catalog-types";
import ModelVariantsPanel from "../../../../../components/ModelVariantsPanel";
import AdminBreadcrumb from "../../../../../components/AdminBreadcrumb";

type Params = { params: Promise<{ id: string; modelId: string }> };

export default async function ModelDetailPage({ params }: Params) {
  const { id: brandId, modelId } = await params;

  let brand: WithId<BrandDoc> | null = null;
  let model: WithId<ModelDoc> | null = null;

  try {
    const [brandsCol, modelsCol] = await Promise.all([getBrandsCollection(), getModelsCollection()]);
    [brand, model] = await Promise.all([
      brandsCol.findOne({ _id: new ObjectId(brandId) }),
      modelsCol.findOne({ _id: new ObjectId(modelId) }),
    ]);
  } catch {
    notFound();
  }
  if (!brand || !model) notFound();

  return (
    <div>
      <AdminBreadcrumb items={[
        { label: "Brands", href: "/admin/brands" },
        { label: brand.name, href: `/admin/brands/${brandId}` },
        { label: model.name },
      ]} />
      <ModelVariantsPanel
        modelId={modelId}
        modelName={model.name}
        modelSlug={model.slug}
      />
    </div>
  );
}
