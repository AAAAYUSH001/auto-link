import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const age = Math.max(0, new Date().getFullYear() - Number(body.year ?? 2020));
  const originalPrice = Number(body.originalPrice ?? 1000000);
  const km = Number(body.km ?? 40000);
  const depreciation = Math.min(0.72, age * 0.07 + km / 1000000);
  const estimate = Math.round(originalPrice * (1 - depreciation));

  return NextResponse.json({
    estimate,
    confidence: "demo",
    factors: ["Vehicle age", "KM driven", "Fuel demand", "Local Ranchi resale trend", "Ownership and insurance status"]
  });
}
