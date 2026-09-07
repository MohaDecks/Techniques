import { readFileSync } from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB_NAME ?? "techni";
const file = path.resolve(process.cwd(), "data/store.json");
const store = JSON.parse(readFileSync(file, "utf8"));

const collections = [
  "users",
  "providers",
  "categories",
  "services",
  "requests",
  "reviews",
  "notifications",
  "media",
  "payments",
];

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

for (const name of collections) {
  const rows = store[name] ?? [];
  await db.collection(name).deleteMany({});
  if (rows.length) {
    await db.collection(name).insertMany(rows.map((item) => ({ ...item, _id: item.id })));
  }
}

await db.collection("settings").replaceOne(
  { _id: "app" },
  { _id: "app", ...store.settings },
  { upsert: true },
);

const counts = Object.fromEntries(
  await Promise.all(
    [...collections, "settings"].map(async (name) => [name, await db.collection(name).countDocuments()]),
  ),
);

console.log(`Seeded MongoDB database "${dbName}"`);
console.log(counts);
await client.close();
