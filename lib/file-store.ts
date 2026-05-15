import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const storageDir = path.join(process.cwd(), "storage");
const uploadDir = path.join(process.cwd(), "public", "uploads");

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
let jsonStoreReady: Promise<void> | null = null;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  if (shouldUseDatabaseStore()) {
    try {
      await ensureJsonStoreTable();
      const record = await prisma.jsonStore.findUnique({ where: { key: fileName } });
      return (record?.data as T | undefined) ?? fallback;
    } catch (error) {
      console.error(`Could not read ${fileName} from database store`, error);
      return fallback;
    }
  }

  try {
    const text = await readFile(path.join(storageDir, fileName), "utf8");
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(fileName: string, data: T) {
  if (shouldUseDatabaseStore()) {
    await ensureJsonStoreTable();
    await prisma.jsonStore.upsert({
      where: { key: fileName },
      update: { data: data as object },
      create: { key: fileName, data: data as object }
    });
    return;
  }

  await mkdir(storageDir, { recursive: true });
  await writeFile(path.join(storageDir, fileName), JSON.stringify(data, null, 2), "utf8");
}

export async function saveUpload(file: File | null, folder: string) {
  if (!file || file.size === 0) return "";

  if (hasCloudinaryConfig()) {
    return uploadToCloudinary(file, folder);
  }

  if (isServerlessRuntime()) {
    return fileToDataUrl(file);
  }

  await mkdir(path.join(uploadDir, folder), { recursive: true });
  const extension = path.extname(file.name) || ".jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
  const relativeUrl = `/uploads/${folder}/${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadDir, folder, safeName), bytes);
  return relativeUrl;
}

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function shouldUseDatabaseStore() {
  return Boolean(process.env.DATABASE_URL && (isServerlessRuntime() || process.env.USE_DATABASE_STORE === "true"));
}

function isServerlessRuntime() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

async function ensureJsonStoreTable() {
  jsonStoreReady ??= prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "JsonStore" (
      "key" TEXT PRIMARY KEY,
      "data" JSONB NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).then(() => undefined);

  return jsonStoreReady;
}

async function uploadToCloudinary(file: File, folder: string) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const bytes = Buffer.from(await file.arrayBuffer());

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `sinha-autolink/${folder}`,
        resource_type: "image",
        overwrite: false
      },
      (error, result?: UploadApiResponse) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result?.secure_url ?? "");
      }
    );

    stream.end(bytes);
  });
}

async function fileToDataUrl(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "image/jpeg";
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}
