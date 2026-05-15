import { NextResponse } from "next/server";
import { cars as defaultCars, type Car } from "@/lib/data";
import { readJsonFile, saveUpload, writeJsonFile } from "@/lib/file-store";

export const runtime = "nodejs";

const fileName = "cars.json";
const deletedFileName = "deleted-cars.json";

export async function GET() {
  const cars = await readJsonFile<Car[]>(fileName, []);
  const deletedCarIds = await readJsonFile<string[]>(deletedFileName, []);
  return NextResponse.json({ cars, deletedCarIds });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const existing = await readJsonFile<Car[]>(fileName, []);
  const title = String(formData.get("carName") || "Used Car");
  const car = await buildCarFromForm(formData, {
    id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
    views: 0,
    valueScore: 88
  });

  const nextCars = [car, ...existing];
  await writeJsonFile(fileName, nextCars);

  return NextResponse.json({ ok: true, car });
}

export async function PUT(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("id") || "");

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing car id" }, { status: 400 });
  }

  const existing = await readJsonFile<Car[]>(fileName, []);
  const currentCar = existing.find((car) => car.id === id) ?? defaultCars.find((car) => car.id === id);

  if (!currentCar) {
    return NextResponse.json({ ok: false, error: "Car not found" }, { status: 404 });
  }

  const car = await buildCarFromForm(formData, currentCar);
  const nextCars = [car, ...existing.filter((item) => item.id !== id)];
  await writeJsonFile(fileName, nextCars);

  const deletedCarIds = await readJsonFile<string[]>(deletedFileName, []);
  if (deletedCarIds.includes(id)) {
    await writeJsonFile(deletedFileName, deletedCarIds.filter((deletedId) => deletedId !== id));
  }

  return NextResponse.json({ ok: true, car });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing car id" }, { status: 400 });
  }

  const existing = await readJsonFile<Car[]>(fileName, []);
  const nextCars = existing.filter((car) => car.id !== id);
  await writeJsonFile(fileName, nextCars);

  const deletedCarIds = await readJsonFile<string[]>(deletedFileName, []);
  const isDefaultCar = defaultCars.some((car) => car.id === id);
  const nextDeletedCarIds = isDefaultCar && !deletedCarIds.includes(id)
    ? [id, ...deletedCarIds]
    : deletedCarIds;
  await writeJsonFile(deletedFileName, nextDeletedCarIds);

  return NextResponse.json({ ok: true });
}

async function buildCarFromForm(formData: FormData, base: Pick<Car, "id" | "views" | "valueScore"> & Partial<Car>): Promise<Car> {
  const photos = formData.getAll("photos").filter((value): value is File => value instanceof File);
  const image = await saveUpload(photos[0] ?? null, "cars");
  const title = String(formData.get("carName") || base.title || "Used Car");
  const brand = String(formData.get("brand") || base.brand || title.split(" ")[0] || "Car");
  const year = Number(formData.get("year") || base.year || new Date().getFullYear());

  return {
    id: base.id,
    title,
    brand,
    model: title,
    year,
    price: Number(formData.get("price") || base.price || 0),
    km: Number(formData.get("km") || base.km || 0),
    fuel: normalizeFuel(String(formData.get("fuel") || base.fuel || "Petrol")),
    transmission: normalizeTransmission(String(formData.get("transmission") || base.transmission || "Manual")),
    ownership: String(formData.get("ownership") || base.ownership || "First owner"),
    body: base.body || "Car",
    city: String(formData.get("location") || base.city || "Ranchi"),
    color: base.color || "Listed",
    insurance: String(formData.get("insurance") || base.insurance || "Ask dealer"),
    image: image || base.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=85",
    video: base.video || "",
    views: base.views,
    valueScore: base.valueScore,
    negotiable: base.negotiable ?? true,
    featured: base.featured ?? false,
    description: String(formData.get("description") || base.description || "Contact Auto Link for full vehicle details."),
    badges: base.badges?.length ? base.badges : ["RC Verification", "Insurance Check", "Dealer Contact"]
  };
}

function normalizeFuel(value: string): Car["fuel"] {
  if (value === "Diesel" || value === "CNG" || value === "Electric") return value;
  return "Petrol";
}

function normalizeTransmission(value: string): Car["transmission"] {
  return value === "Automatic" ? "Automatic" : "Manual";
}
