import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  global._mongoClientPromise ??= new MongoClient(uri).connect();
  return global._mongoClientPromise;
}

export async function getUsersCollection() {
  const client = await getClientPromise();
  const collection = client
    .db(process.env.MONGODB_DB)
    .collection<UserDocument>("users");

  await collection.createIndex({ email: 1 }, { unique: true });
  return collection;
}

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};
