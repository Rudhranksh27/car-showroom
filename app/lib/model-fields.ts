// Shared parsing for the optional model detail fields (admin create/update).

const NUMBER_FIELDS = [
  "modelYear", "length", "width", "height", "wheelbase",
  "seatingCapacity", "doors", "bootSpace",
] as const;
const STRING_FIELDS = [
  "segment", "overview", "image", "brochureUrl", "websiteUrl", "launchDate",
] as const;
const LIST_FIELDS = ["transmissions", "exteriorImages", "interiorImages"] as const;
const BOOLEAN_FIELDS = ["discontinued", "published"] as const;

export type ModelExtras = { set: Record<string, unknown>; unset: Record<string, ""> };

/**
 * Splits a request body into fields to `$set` and fields to `$unset`.
 * Keys absent from the body are left untouched; blank values are unset.
 */
export function parseModelExtras(body: Record<string, unknown>): ModelExtras {
  const set: Record<string, unknown> = {};
  const unset: Record<string, ""> = {};

  for (const key of STRING_FIELDS) {
    if (!(key in body)) continue;
    const v = body[key];
    if (typeof v === "string" && v.trim()) set[key] = v.trim();
    else unset[key] = "";
  }
  for (const key of NUMBER_FIELDS) {
    if (!(key in body)) continue;
    const v = body[key];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) set[key] = v;
    else unset[key] = "";
  }
  for (const key of LIST_FIELDS) {
    if (!(key in body)) continue;
    const v = body[key];
    const items = Array.isArray(v)
      ? v.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean)
      : [];
    if (items.length) set[key] = items;
    else unset[key] = "";
  }
  if ("highlights" in body) {
    const raw = Array.isArray(body.highlights) ? body.highlights : [];
    const items = raw
      .map((h) => {
        if (typeof h === "string") return { title: h.trim(), description: "" };
        const o = (h ?? {}) as Record<string, unknown>;
        return {
          title: typeof o.title === "string" ? o.title.trim() : "",
          description: typeof o.description === "string" ? o.description.trim() : "",
        };
      })
      .filter((h) => h.title)
      .map((h) => (h.description ? h : { title: h.title }));
    if (items.length) set.highlights = items;
    else unset.highlights = "";
  }
  for (const key of BOOLEAN_FIELDS) {
    if (typeof body[key] === "boolean") set[key] = body[key];
  }
  return { set, unset };
}
