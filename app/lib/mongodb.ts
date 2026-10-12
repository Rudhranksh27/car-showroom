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
  const collection = client.db(getUsersDatabaseName()).collection<UserDocument>("users");

  await collection.createIndex({ email: 1 }, { unique: true });
  return collection;
}

export async function getAdminsCollection() {
  const client = await getClientPromise();
  const collection = client.db(getAdminsDatabaseName()).collection<AdminDocument>("admins");

  await collection.createIndex({ email: 1 }, { unique: true });
  return collection;
}

function getUsersDatabaseName() {
  const databaseName = process.env.MONGODB_DB;
  if (!databaseName) {
    throw new Error("MONGODB_DB is not configured");
  }
  return databaseName;
}

function getAdminsDatabaseName() {
  const databaseName = process.env.MONGODB_ADMIN_DB?.trim();
  if (!databaseName) {
    throw new Error("MONGODB_ADMIN_DB is not configured");
  }
  if (databaseName === process.env.MONGODB_DB?.trim()) {
    throw new Error("MONGODB_ADMIN_DB must be different from MONGODB_DB");
  }
  return databaseName;
}

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: Date;
};

export type AdminDocument = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "SUPER_ADMIN";
  createdAt: Date;
};

export async function closeMongoConnection() {
  if (!global._mongoClientPromise) return;

  const client = await global._mongoClientPromise;
  global._mongoClientPromise = undefined;
  await client.close();
}
