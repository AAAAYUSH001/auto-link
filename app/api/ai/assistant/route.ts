import { NextResponse } from "next/server";
import { cars as defaultCars } from "@/lib/data";
import { readJsonFile } from "@/lib/file-store";

import type { Car } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { query } = await request.json().catch(() => ({ query: "" }));
  const savedCars = await readJsonFile<Car[]>("cars.json", []);
  const deletedCarIds = await readJsonFile<string[]>("deleted-cars.json", []);
  const deletedIds = new Set(deletedCarIds);
  const cars = [...savedCars, ...defaultCars.filter((car) => !deletedIds.has(car.id))];
  const inventory = cars.map((car) => `${car.title}: ${car.price}, ${car.fuel}, ${car.transmission}, ${car.body}, ${car.km}km`).join("\n");

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ answer: fallbackAnswer(cars, query), fallback: true });
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Auto Link's concise car buying assistant for Ranchi/Jharkhand. Recommend only from provided inventory, mention budget fit, paperwork trust, and WhatsApp next step.\n\nInventory:\n${inventory}\n\nBuyer request: ${query}`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ answer: fallbackAnswer(cars, query), fallback: true, geminiError: data.error?.message ?? "Gemini request failed." });
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? fallbackAnswer(cars, query);
    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({
      answer: fallbackAnswer(cars, query),
      fallback: true,
      geminiError: error instanceof Error ? error.message : "Gemini request failed."
    });
  }
}

function fallbackAnswer(cars: Car[], query: string) {
  const underBudget = cars.filter((car) => /10|ten|lakh|family|suv/i.test(query) ? car.price <= 1000000 : true);
  const pick = underBudget.sort((a, b) => b.valueScore - a.valueScore)[0] ?? cars[0];

  if (!pick) {
    return "No cars are listed right now. Please contact Auto Link on WhatsApp for current availability.";
  }

  return `Best match right now: ${pick.title}. It has a ${pick.valueScore}/100 value score, ${pick.fuel} engine, ${pick.transmission.toLowerCase()} transmission, and verified paperwork support. Contact Auto Link on WhatsApp for the next step.`;
}
