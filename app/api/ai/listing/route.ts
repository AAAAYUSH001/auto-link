import { NextResponse } from "next/server";
import { z } from "zod";

const listingSchema = z.object({
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  fuel: z.string(),
  km: z.number(),
  color: z.string().optional(),
  condition: z.string().optional()
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = listingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Vehicle details are required." }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ ok: true, listing: fallbackListing(parsed.data), fallback: true });
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: { responseMimeType: "application/json" },
        contents: [
          {
            parts: [
              {
                text: `Generate premium used-car listing JSON with title, description, highlights, hashtags, seoTitle, seoDescription for this vehicle:\n${JSON.stringify(parsed.data)}`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ ok: true, listing: fallbackListing(parsed.data), fallback: true, geminiError: data.error?.message ?? "Gemini request failed." });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsedListing = JSON.parse(text);

    if (!parsedListing.description) {
      return NextResponse.json({ ok: true, listing: fallbackListing(parsed.data), fallback: true, geminiError: "Gemini returned an empty description." });
    }

    return NextResponse.json({ ok: true, listing: parsedListing });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      listing: fallbackListing(parsed.data),
      fallback: true,
      geminiError: error instanceof Error ? error.message : "Gemini request failed."
    });
  }
}

function fallbackListing(car: z.infer<typeof listingSchema>) {
  return {
    title: `${car.year} ${car.brand} ${car.model}`,
    description: `Verified ${car.year} ${car.brand} ${car.model} with ${car.km.toLocaleString("en-IN")} km driven, ${car.fuel} engine, ${car.condition ?? "inspected"} condition, and Auto Link paperwork support in Ranchi.`,
    highlights: ["RC verification ready", "Insurance check supported", "WhatsApp negotiation enabled", "Transparent 2% fee"],
    hashtags: ["#AutoLink", "#UsedCarsRanchi", `#${car.brand.replace(/\s/g, "")}`],
    seoTitle: `${car.brand} ${car.model} used car in Ranchi`,
    seoDescription: `Buy verified ${car.year} ${car.brand} ${car.model} through Auto Link with transparent negotiation.`
  };
}
