import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { seedState } from "./mock-data";
import { getMongoDb } from "./mongo";
import type { AppSettings, AppState } from "./types";

const COLLECTIONS = [
  "users",
  "providers",
  "categories",
  "services",
  "requests",
  "reviews",
  "notifications",
  "media",
  "payments",
] as const;

type CollectionName = (typeof COLLECTIONS)[number];

function dbPath() {
  return path.resolve(process.cwd(), "../../data/store.json");
}

function emptySession(state: AppState): AppState {
  return { ...state, currentUserId: null };
}

function mergeState(parsed: Partial<AppState>): AppState {
  const merged = emptySession({
    ...seedState,
    ...parsed,
    settings: { ...seedState.settings, ...parsed.settings },
  });
  return {
    ...merged,
    media: merged.media.map((item) => ({ ...item, isActive: item.isActive ?? true })),
  };
}

function withMongoId<T extends { id: string }>(item: T) {
  return { ...item, _id: item.id };
}

function withoutMongoId<T>(item: T & { _id?: unknown }): T {
  const { _id: _ignored, ...rest } = item;
  return rest as T;
}

export function readStoreFile(): AppState {
  const file = dbPath();
  if (!existsSync(file)) {
    writeStoreFile(seedState);
    return emptySession(seedState);
  }
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as AppState;
    return mergeState(parsed);
  } catch {
    return emptySession(seedState);
  }
}

export function writeStoreFile(state: AppState): AppState {
  const file = dbPath();
  mkdirSync(path.dirname(file), { recursive: true });
  const next = emptySession(state);
  writeFileSync(file, JSON.stringify(next, null, 2));
  return next;
}

async function readStoreFromMongo(): Promise<AppState | null> {
  const db = await getMongoDb();
  const users = await db.collection("users").countDocuments();
  if (users === 0) return null;

  const entries = await Promise.all(
    COLLECTIONS.map(async (name) => {
      const docs = await db.collection(name).find({}).toArray();
      return [name, docs.map((doc) => withoutMongoId(doc))] as const;
    }),
  );

  const settingsDoc = await db.collection("settings").findOne({ _id: "app" as never });
  const settings = settingsDoc
    ? withoutMongoId(settingsDoc as unknown as AppSettings & { id?: string; _id?: unknown })
    : seedState.settings;

  const collected = Object.fromEntries(entries) as Pick<AppState, CollectionName>;
  return mergeState({
    ...collected,
    settings,
    currentUserId: null,
  });
}

async function writeStoreToMongo(state: AppState): Promise<void> {
  const db = await getMongoDb();
  const next = emptySession(state);

  await Promise.all(
    COLLECTIONS.map(async (name) => {
      const collection = db.collection(name);
      await collection.deleteMany({});
      const rows = next[name];
      if (rows.length) {
        await collection.insertMany(rows.map((item) => withMongoId(item)));
      }
    }),
  );

  await db.collection("settings").replaceOne(
    { _id: "app" as never },
    { _id: "app", ...next.settings },
    { upsert: true },
  );
}

export async function readStore(): Promise<AppState> {
  const fileState = readStoreFile();
  try {
    const mongoState = await readStoreFromMongo();
    if (mongoState) return mongoState;
    await writeStoreToMongo(fileState);
    return fileState;
  } catch (error) {
    console.error("MongoDB read failed, using store.json", error);
    return fileState;
  }
}

export async function writeStore(state: AppState): Promise<AppState> {
  const next = writeStoreFile(state);
  try {
    await writeStoreToMongo(next);
  } catch (error) {
    console.error("MongoDB write failed, store.json was saved", error);
  }
  return next;
}

export async function resetStore(): Promise<AppState> {
  return writeStore(seedState);
}

export async function syncFileToMongo(): Promise<AppState> {
  const fileState = readStoreFile();
  await writeStoreToMongo(fileState);
  return fileState;
}
