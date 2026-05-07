"use server";

import { z } from "zod";

const leadSchema = z.object({
  type: z.string(),
  name: z.string().min(2),
  phone: z.string().min(8),
  message: z.string().min(3),
  carId: z.string().optional()
});

export async function captureLead(formData: FormData) {
  const payload = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, error: "Please add your name, phone, and requirement." };
  }

  console.info("Lead captured", parsed.data);
  return { ok: true, message: "Lead captured. Auto Link will contact you shortly." };
}
