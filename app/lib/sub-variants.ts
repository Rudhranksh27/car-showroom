import type { SubVariantDoc, VariantDoc } from "./catalog-types";

export const PAINT_OPTIONS = ["Single Tone", "Dual Tone"];

const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const text = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Validates admin input; returns clean sub-variants with unique ids, or an error message. */
export function sanitizeSubVariants(raw: unknown): SubVariantDoc[] | string {
  if (!Array.isArray(raw)) return "Sub-variants must be a list";
  if (raw.length > 50) return "Too many sub-variants";

  const used = new Set<string>();
  const result: SubVariantDoc[] = [];

  for (const item of raw) {
    const o = (item ?? {}) as Record<string, unknown>;
    const name = text(o.name);
    const engine = text(o.engine);
    const fuel = text(o.fuel, 40);
    const transmission = text(o.transmission, 80);
    const paint = text(o.paint, 40);
    if (!name) return "Every sub-variant needs a name";
    if (!engine || !fuel || !transmission || !paint) {
      return `"${name}" needs engine, fuel, transmission and paint`;
    }

    const base = slug(name) || "sub-variant";
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);

    const price = text(o.price, 60);
    const description = text(o.description, 300);
    result.push({
      id, name, engine, fuel, transmission, paint,
      ...(price ? { price } : {}),
      ...(description ? { description } : {}),
    });
  }
  return result;
}

/** Full display name used for bookings, e.g. "Maruti Suzuki Brezza ZXi MT". */
export const fullCarName = (modelName: string, name: string) =>
  name.startsWith(modelName) ? name : `${modelName} ${name}`;

/** Finds a variant or sub-variant by its plain or full name, with the price/name to book it under. */
export function findBookable(modelName: string, variants: VariantDoc[], wanted: string) {
  for (const v of variants) {
    if (v.name === wanted || fullCarName(modelName, v.name) === wanted) {
      return { name: fullCarName(modelName, v.name), price: v.price, variant: v, sub: undefined };
    }
  }
  for (const v of variants) {
    for (const sub of v.subVariants ?? []) {
      if (sub.name === wanted || fullCarName(modelName, sub.name) === wanted) {
        return { name: fullCarName(modelName, sub.name), price: sub.price || v.price, variant: v, sub };
      }
    }
  }
  return null;
}
