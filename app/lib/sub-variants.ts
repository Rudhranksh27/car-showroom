import type { SubVariantDoc, VariantDoc } from "./catalog-types";

export const PAINT_OPTIONS = ["Single Tone", "Dual Tone"];

const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const text = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Every colour a sub-variant is offered in (supports the older single `color` field). */
export const subColors = (s: SubVariantDoc): string[] =>
  s.colors?.length
    ? s.colors
    : // Older data stored several colours in one string, separated by commas, pipes or runs of spaces.
      [...new Set((s.color ?? "").split(/\s{2,}|[,;|\n]+/).map((c) => c.trim()).filter(Boolean))];

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
    const rawColors = Array.isArray(o.colors) ? o.colors : typeof o.colors === "string" ? o.colors.split(",") : [];
    const colors = [...new Set(rawColors.map((c) => text(c, 40)).filter(Boolean))].slice(0, 20);
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
      ...(colors.length ? { colors } : {}),
      ...(price ? { price } : {}),
      ...(description ? { description } : {}),
    });
  }
  return result;
}

/** Full display name used for bookings, e.g. "Maruti Suzuki Brezza ZXi MT". */
export function fullCarName(modelName: string, name: string) {
  if (name.startsWith(modelName)) return name;
  // Drop words the variant name repeats from the end of the model name ("Maruti Brezza" + "Brezza ZXI").
  const m = modelName.split(/\s+/), n = name.split(/\s+/);
  for (let k = Math.min(m.length, n.length); k > 0; k--) {
    if (m.slice(-k).join(" ").toLowerCase() === n.slice(0, k).join(" ").toLowerCase()) return `${modelName} ${n.slice(k).join(" ")}`.trim();
  }
  return `${modelName} ${name}`;
}

/** Finds a variant or sub-variant by its plain or full name, with the price/name to book it under. */
export function findBookable(modelName: string, variants: VariantDoc[], wantedRaw: string) {
  // A colour can ride along as "<sub-variant id>~<colour>".
  const [wanted, wantedColor] = wantedRaw.split("~");
  for (const v of variants) {
    if (v.name === wanted || fullCarName(modelName, v.name) === wanted) {
      return { name: fullCarName(modelName, v.name), price: v.price, variant: v, sub: undefined };
    }
  }
  for (const v of variants) {
    for (const sub of v.subVariants ?? []) {
      const base = fullCarName(modelName, sub.name);
      if (sub.id === wanted || sub.name === wanted || base === wanted) {
        const color = subColors(sub).find((c) => c.toLowerCase() === wantedColor?.trim().toLowerCase()) ?? (subColors(sub).length === 1 ? subColors(sub)[0] : "");
        const name = color ? `${base} (${color})` : base;
        return { name, price: sub.price || v.price, variant: v, sub };
      }
    }
  }
  return null;
}
