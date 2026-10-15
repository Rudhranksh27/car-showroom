import { MongoClient } from "mongodb";

declare global {
  var _mongoAdminClientPromise: Promise<MongoClient> | undefined;
}

function getAdminClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  global._mongoAdminClientPromise ??= new MongoClient(uri).connect();
  return global._mongoAdminClientPromise;
}

export async function getAdminsCollection() {
  const client = await getAdminClientPromise();
  const collection = client
    .db(process.env.MONGODB_ADMIN_DB)
    .collection<AdminDocument>("admins");

  await collection.createIndex({ email: 1 }, { unique: true });
  return collection;
}

export type AdminDocument = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};
