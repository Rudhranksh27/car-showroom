import { getCarById } from "./cars";
import type { Car } from "./cars";
import { getModelsCollection, getVariantsCollection } from "./mongodb-catalog";
import { findBookable } from "./sub-variants";

// Resolves the car being bought: a static demo car, or a catalog model (by slug) with an optional variant.
export async function resolveCheckoutCar(id: string, variantName?: string): Promise<Car | null> {
  const staticCar = getCarById(id);
  if (staticCar) return variantName ? { ...staticCar, name: variantName } : staticCar;

  try {
    const model = await (await getModelsCollection()).findOne({ slug: id });
    if (!model || model.published === false) return null;

    const variants = await (await getVariantsCollection()).find({ modelId: model._id.toString() }).toArray();
    // The wanted name can be a variant or one of its sub-variants.
    const bookable = variantName ? findBookable(model.name, variants, variantName) : null;
    if (variantName && !bookable) return null;

    return {
      id: model.slug,
      name: bookable ? bookable.name : model.name,
      brand: model.brandName,
      category: model.type,
      price: bookable ? bookable.price : `₹${model.priceMin.toFixed(2)} Lakh`,
      image: model.image ?? "",
      alt: model.name,
    };
  } catch {
    return null;
  }
}
