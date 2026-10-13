import bcrypt from "bcryptjs";
import { closeMongoConnection, getAdminsCollection } from "../app/lib/mongodb";

async function main() {
  const email = "admin@yoursite.com";
  const admins = await getAdminsCollection();
  const result = await admins.updateOne(
    { email },
    {
      $setOnInsert: {
        name: "Super Admin",
        email,
        password: await bcrypt.hash("Admin@123", 10),
        role: "SUPER_ADMIN",
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  if (result.upsertedCount > 0) {
    console.log("Super admin account created");
    console.log(`Email: ${email}`);
    console.log("Password: Admin@123");
  } else {
    console.log(`Super admin already exists in the admin database: ${email}`);
  }
}

async function runSeed() {
  try {
    await main();
  } catch (error) {
    console.error("Seed failed", error);
    process.exitCode = 1;
  } finally {
    try {
      await closeMongoConnection();
    } catch (error) {
      console.error("Failed to close MongoDB connection", error);
      process.exitCode = 1;
    }
  }
}

void runSeed();
