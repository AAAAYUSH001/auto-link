import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  type: z.string().default("inquiry"),
  carId: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid lead payload" }, { status: 400 });
  }

  const lead = {
    id: crypto.randomUUID(),
    ...parsed.data,
    source: parsed.data.type === "whatsapp_click" ? "WhatsApp" : "Website",
    createdAt: new Date().toISOString()
  };

  console.info("Auto Link lead", lead);
  return NextResponse.json({ ok: true, lead });
}
