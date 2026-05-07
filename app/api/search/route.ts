import { NextResponse } from "next/server";
import { cars as defaultCars } from "@/lib/data";
import { readJsonFile } from "@/lib/file-store";

import type { Car } from "@/lib/data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const savedCars = await readJsonFile<Car[]>("cars.json", []);
  const deletedCarIds = await readJsonFile<string[]>("deleted-cars.json", []);
  const deletedIds = new Set(deletedCarIds);
  const cars = [...savedCars, ...defaultCars.filter((car) => !deletedIds.has(car.id))];

  const results = cars
    .map((car) => {
      const haystack = `${car.title} ${car.brand} ${car.model} ${car.body} ${car.fuel} ${car.transmission} ${car.ownership} ${car.description}`.toLowerCase();
      const semanticBoost =
        (q.includes("family") && car.body === "SUV" ? 20 : 0) +
        (q.includes("automatic") && car.transmission === "Automatic" ? 20 : 0) +
        (q.includes("mileage") && ["Petrol", "CNG"].includes(car.fuel) ? 12 : 0) +
        (q.includes("luxury") && car.price > 800000 ? 12 : 0);
      const lexical = q.split(/\s+/).filter(Boolean).reduce((score, token) => score + (haystack.includes(token) ? 8 : 0), 0);
      return { car, score: car.valueScore + lexical + semanticBoost };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ car, score }) => ({ ...car, score }));

  return NextResponse.json({ results });
}
