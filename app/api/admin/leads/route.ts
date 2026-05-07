import { NextResponse } from "next/server";
import { readJsonFile, saveUpload, writeJsonFile } from "@/lib/file-store";

export const runtime = "nodejs";

export type StoredLead = {
  id: number;
  type: "Buyer" | "Seller";
  date: string;
  source: string;
  name: string;
  contact: string;
  address: string;
  vehicle: string;
  requirement: string;
  status: string;
  remarks: string;
  photoUrl: string;
};

const fileName = "leads.json";

export async function GET() {
  const leads = await readJsonFile<StoredLead[]>(fileName, []);
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const existing = await readJsonFile<StoredLead[]>(fileName, []);
  const photo = formData.get("photo") instanceof File ? formData.get("photo") as File : null;
  const photoUrl = await saveUpload(photo, "leads");

  const lead: StoredLead = {
    id: Date.now(),
    type: String(formData.get("type") || "Buyer") === "Seller" ? "Seller" : "Buyer",
    date: String(formData.get("date") || new Date().toISOString().slice(0, 10)),
    source: String(formData.get("source") || "Manual"),
    name: String(formData.get("name") || ""),
    contact: String(formData.get("contact") || ""),
    address: String(formData.get("address") || ""),
    vehicle: String(formData.get("vehicle") || ""),
    requirement: String(formData.get("requirement") || ""),
    status: String(formData.get("status") || "Waiting for response"),
    remarks: String(formData.get("remarks") || ""),
    photoUrl
  };

  const nextLeads = [lead, ...existing];
  await writeJsonFile(fileName, nextLeads);

  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, error: "Missing lead id" }, { status: 400 });
  }

  const existing = await readJsonFile<StoredLead[]>(fileName, []);
  const nextLeads = existing.filter((lead) => lead.id !== id);
  await writeJsonFile(fileName, nextLeads);

  return NextResponse.json({ ok: true });
}
