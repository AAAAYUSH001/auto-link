import { NextResponse } from "next/server";
import { cars as defaultCars } from "@/lib/data";
import { readJsonFile } from "@/lib/file-store";

import type { Car } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  const savedCars = await readJsonFile<Car[]>("cars.json", []);
  const deletedCarIds = await readJsonFile<string[]>("deleted-cars.json", []);
  const deletedIds = new Set(deletedCarIds);
  const publicCars = defaultCars.filter((car) => !deletedIds.has(car.id));

  return NextResponse.json({
    cars: [...savedCars, ...publicCars],
    deletedCarIds
  });
}
