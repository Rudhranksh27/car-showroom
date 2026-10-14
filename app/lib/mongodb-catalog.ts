import { MongoClient } from "mongodb";
import type { BrandDoc, ModelDoc, VariantDoc } from "./catalog-types";

declare global {
  var _mongoCatalogClientPromise: Promise<MongoClient> | undefined;
}

function getCatalogClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  global._mongoCatalogClientPromise ??= new MongoClient(uri).connect();
  return global._mongoCatalogClientPromise;
}

function getCatalogDb() {
  return getCatalogClientPromise().then((client) =>
    client.db(process.env.MONGODB_CATALOG_DB),
  );
}

export async function getBrandsCollection() {
  const db = await getCatalogDb();
  const col = db.collection<BrandDoc>("brands");
  await col.createIndex({ slug: 1 }, { unique: true });
  return col;
}

export async function getModelsCollection() {
  const db = await getCatalogDb();
  const col = db.collection<ModelDoc>("models");
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ brandId: 1 });
  return col;
}

export async function getVariantsCollection() {
  const db = await getCatalogDb();
  const col = db.collection<VariantDoc>("variants");
  await col.createIndex({ modelId: 1 });
  return col;
}

export function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
