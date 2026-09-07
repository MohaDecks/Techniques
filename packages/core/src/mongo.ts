import { MongoClient, type Db } from "mongodb";
import { MONGO_DB_NAME } from "./constants";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

const globalForMongo = globalThis as typeof globalThis & {
  farsamoMongo?: { client: MongoClient; connecting: Promise<MongoClient> };
};

export async function getMongoDb(): Promise<Db> {
  if (!globalForMongo.farsamoMongo) {
    const client = new MongoClient(uri);
    globalForMongo.farsamoMongo = {
      client,
      connecting: client.connect(),
    };
  }
  const connected = await globalForMongo.farsamoMongo.connecting;
  return connected.db(MONGO_DB_NAME);
}
