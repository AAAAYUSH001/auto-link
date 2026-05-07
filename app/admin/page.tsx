"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Camera,
  CarFront,
  ImagePlus,
  IndianRupee,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  UserRound
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { cars as defaultCars, type Car } from "@/lib/data";

const inputClass =
  "h-12 w-full rounded-lg border border-white/12 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-volt";

const textareaClass =
  "min-h-28 w-full rounded-lg border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-volt";

const labelClass = "mb-2 block text-sm font-medium text-white/72";

type LeadType = "Buyer" | "Seller";

type Lead = {
  id: number;
  type: LeadType;
  date: string;
  source: string;
  name: string;
  contact: string;
  address: string;
  vehicle: string;
  requirement: string;
  status: string;
  remarks: string;
  photoUrl?: string;
};

const leadStatuses = [
  "Waiting for response",
  "Deal done",
  "No deal",
  "Follow up",
  "Sold to someone else",
  "Customer not interested",
  "Need more options"
];

export default function AdminPage() {
  const [carName, setCarName] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [km, setKm] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [ownership, setOwnership] = useState("");
  const [insurance, setInsurance] = useState("");
  const [location, setLocation] = useState("Ranchi");
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [savingCar, setSavingCar] = useState(false);
  const [message, setMessage] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [listedCars, setListedCars] = useState<Car[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      const [leadsResponse, carsResponse] = await Promise.all([
        fetch("/api/admin/leads", { cache: "no-store" }),
        fetch("/api/admin/cars", { cache: "no-store" })
      ]);
      const leadsData = await leadsResponse.json();
      const carsData = await carsResponse.json();
      const deletedIds = new Set(carsData.deletedCarIds ?? []);
      setLeads(leadsData.leads ?? []);
      setListedCars([...(carsData.cars ?? []), ...defaultCars.filter((car) => !deletedIds.has(car.id))]);
    }

    loadAdminData().catch(() => {
      setLeads([]);
      setListedCars(defaultCars);
    });
  }, []);

  async function generateDescription() {
    setGenerating(true);
    const response = await fetch("/api/ai/listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: brand || carName.split(" ")[0] || "Car",
        model: carName || "Used car",
        year: Number(year) || new Date().getFullYear(),
        fuel: fuel || "Petrol",
        km: Number(km) || 0,
        condition: `${ownership || "Verified"} ${transmission || ""} ${insurance || ""}`.trim()
      })
    });
    const data = await response.json();
    const listing = data.listing;
    const text = data.ok && listing?.description
      ? `${listing.description}\n\nHighlights:\n${(listing.highlights ?? []).map((item: string) => `- ${item}`).join("\n")}`
      : data.error || "Could not generate description. Please check Gemini API key and model.";
    setDescription(text);
    setGenerating(false);
  }

  async function saveCar(formData: FormData) {
    setSavingCar(true);
    setMessage("");
    const response = await fetch("/api/admin/cars", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    setSavingCar(false);

    if (data.ok) {
      setMessage("Car saved. It will now show on the public car listings.");
      setListedCars((current) => [data.car, ...current]);
      setCarName("");
      setBrand("");
      setYear("");
      setPrice("");
      setKm("");
      setFuel("");
      setTransmission("");
      setOwnership("");
      setInsurance("");
      setLocation("Ranchi");
      setDescription("");
    } else {
      setMessage("Could not save car. Please try again.");
    }
  }

  async function deleteCar(id: string) {
    if (!window.confirm("Remove this car from the main page?")) return;

    const response = await fetch(`/api/admin/cars?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (data.ok) {
      setListedCars((current) => current.filter((car) => car.id !== id));
      setMessage("Car removed from the main page.");
    } else {
      setMessage("Could not remove car. Please try again.");
    }
  }

  async function addLead(type: LeadType, formData: FormData) {
    formData.set("type", type);
    const response = await fetch("/api/admin/leads", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (data.ok) {
      setLeads((current) => [data.lead, ...current]);
    }
  }

  async function deleteLead(id: number) {
    if (!window.confirm("Delete this customer lead?")) return;

    const response = await fetch(`/api/admin/leads?id=${id}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (data.ok) {
      setLeads((current) => current.filter((lead) => lead.id !== id));
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge className="mb-3">Admin</Badge>
            <h1 className="text-4xl font-black">Upload Car</h1>
            <p className="mt-2 text-white/62">Simple form to add cars and manage buyer/seller leads.</p>
          </div>
          <Button type="button" variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>

        <Card className="p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-volt p-3 text-ink">
              <CarFront className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Car Details</h2>
              <p className="text-sm text-white/55">Fill important details, then generate description with Gemini.</p>
            </div>
          </div>

          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              saveCar(new FormData(event.currentTarget));
              event.currentTarget.reset();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Car Name">
                <input name="carName" className={inputClass} placeholder="Hyundai Creta SX" value={carName} onChange={(event) => setCarName(event.target.value)} required />
              </Field>
              <Field label="Brand">
                <input name="brand" className={inputClass} placeholder="Hyundai" value={brand} onChange={(event) => setBrand(event.target.value)} />
              </Field>
              <Field label="Model Year">
                <input name="year" className={inputClass} placeholder="2020" type="number" value={year} onChange={(event) => setYear(event.target.value)} />
              </Field>
              <Field label="Price">
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-white/45" />
                  <input name="price" className={`${inputClass} pl-10`} placeholder="975000" type="number" value={price} onChange={(event) => setPrice(event.target.value)} />
                </div>
              </Field>
              <Field label="KM Driven">
                <input name="km" className={inputClass} placeholder="42000" type="number" value={km} onChange={(event) => setKm(event.target.value)} />
              </Field>
              <Field label="Fuel Type">
                <select name="fuel" className={inputClass} value={fuel} onChange={(event) => setFuel(event.target.value)}>
                  <option value="" disabled>Select fuel</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>CNG</option>
                  <option>Electric</option>
                </select>
              </Field>
              <Field label="Transmission">
                <select name="transmission" className={inputClass} value={transmission} onChange={(event) => setTransmission(event.target.value)}>
                  <option value="" disabled>Select transmission</option>
                  <option>Manual</option>
                  <option>Automatic</option>
                </select>
              </Field>
              <Field label="Ownership">
                <select name="ownership" className={inputClass} value={ownership} onChange={(event) => setOwnership(event.target.value)}>
                  <option value="" disabled>Select ownership</option>
                  <option>First owner</option>
                  <option>Second owner</option>
                  <option>Third owner</option>
                </select>
              </Field>
              <Field label="Insurance">
                <input name="insurance" className={inputClass} placeholder="Valid till Sep 2026" value={insurance} onChange={(event) => setInsurance(event.target.value)} />
              </Field>
              <Field label="Location">
                <input name="location" className={inputClass} placeholder="Ranchi" value={location} onChange={(event) => setLocation(event.target.value)} />
              </Field>
            </div>

            <Field label="Car Photos">
              <div className="grid gap-3 sm:grid-cols-2">
                <UploadBox name="photos" icon={<ImagePlus className="mb-3 h-8 w-8 text-volt" />} title="Upload photos" copy="Front, back, side, interior" />
                <UploadBox name="photos" icon={<Camera className="mb-3 h-8 w-8 text-signal" />} title="Click picture" copy="Open camera on phone" capture />
              </div>
            </Field>

            <Field label="Gemini Description">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row">
                <Button type="button" onClick={generateDescription} disabled={generating}>
                  <Bot className="h-4 w-4" /> {generating ? "Generating..." : "Generate Description"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setDescription("")}>
                  Clear
                </Button>
              </div>
              <textarea
                className={textareaClass}
                name="description"
                placeholder="Generated description will appear here..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
              <Button type="submit" className="sm:flex-1">
                <Save className="h-4 w-4" /> {savingCar ? "Saving..." : "Save Car"}
              </Button>
              <Button type="button" variant="ghost" className="sm:flex-1">
                <Upload className="h-4 w-4" /> Save as Draft
              </Button>
            </div>
            {message && <p className="rounded-lg border border-volt/25 bg-volt/10 p-3 text-sm text-volt">{message}</p>}
          </form>
        </Card>

        <Card className="mt-8 p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-brass p-3 text-ink">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Remove Cars From Main Page</h2>
              <p className="text-sm text-white/55">Delete a mistaken listing so it stops showing publicly.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {listedCars.length === 0 ? (
              <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/60">No cars listed right now.</p>
            ) : (
              listedCars.map((car) => (
                <div key={car.id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{car.title}</p>
                    <p className="text-sm text-white/55">
                      {car.year} | {car.city} | INR {car.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" onClick={() => deleteCar(car.id)}>
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="mt-8 grid gap-8">
          <LeadSection type="Buyer" leads={leads} onAdd={addLead} onDelete={deleteLead} />
          <LeadSection type="Seller" leads={leads} onAdd={addLead} onDelete={deleteLead} />
        </div>
      </div>
    </main>
  );
}

function LeadSection({
  type,
  leads,
  onAdd,
  onDelete
}: {
  type: LeadType;
  leads: Lead[];
  onAdd: (type: LeadType, formData: FormData) => void;
  onDelete: (id: number) => void;
}) {
  const filteredLeads = useMemo(() => leads.filter((lead) => lead.type === type), [leads, type]);
  const isBuyer = type === "Buyer";
  const sourceOptions = isBuyer
    ? ["Manual", "WhatsApp", "Phone call", "Website", "Walk-in"]
    : ["Manual", "WhatsApp", "Phone call", "Website", "Walk-in", "Picture upload"];

  return (
    <Card className="p-5 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <div className={isBuyer ? "rounded-lg bg-signal p-3 text-ink" : "rounded-lg bg-brass p-3 text-ink"}>
          {isBuyer ? <UserRound className="h-6 w-6" /> : <CarFront className="h-6 w-6" />}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{type} Leads</h2>
          <p className="text-sm text-white/55">
            {isBuyer ? "What kind of car buyer wants to buy." : "What kind of car seller wants to sell."}
          </p>
        </div>
      </div>

      <form
        className="grid gap-4 rounded-lg border border-white/10 bg-black/20 p-4 lg:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(type, new FormData(event.currentTarget));
          event.currentTarget.reset();
        }}
      >
        <Field label="Date">
          <input name="date" type="date" className={inputClass} defaultValue={new Date().toISOString().slice(0, 10)} />
        </Field>
        <Field label="Source">
          <select name="source" className={inputClass} defaultValue="Manual">
            {sourceOptions.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </Field>
        <Field label="Customer Name">
          <input name="name" className={inputClass} placeholder="Customer name" />
        </Field>
        <Field label="Contact No">
          <input name="contact" className={inputClass} placeholder="Phone number" />
        </Field>
        <Field label="Address">
          <input name="address" className={inputClass} placeholder="Ranchi address" />
        </Field>
        <Field label={isBuyer ? "Car Buyer Wants" : "Car Seller Wants To Sell"}>
          <input name="vehicle" className={inputClass} placeholder={isBuyer ? "SUV under 10 lakh" : "Baleno 2021 petrol"} />
        </Field>
        <Field label="Deal Status">
          <select name="status" className={inputClass} defaultValue="Waiting for response">
            {leadStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </Field>
        {!isBuyer && (
          <Field label="Upload / Click Picture">
            <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/18 bg-black/30 px-4 text-sm text-white/70 hover:border-volt/60">
              <Camera className="h-4 w-4 text-volt" />
              Add picture
              <input name="photo" type="file" accept="image/*" capture="environment" className="hidden" />
            </label>
          </Field>
        )}
        <div className="lg:col-span-3">
          <Field label="Remarks">
            <textarea name="remarks" className={textareaClass} placeholder="Deal remarks, response, next follow-up, no deal reason..." />
          </Field>
        </div>
        <div className="lg:col-span-3">
          <Field label="Extra Requirement">
            <textarea name="requirement" className={textareaClass} placeholder={isBuyer ? "Budget, fuel, brand choice, urgent or not..." : "Expected price, condition, documents, loan pending..."} />
          </Field>
        </div>
        <Button type="submit" className="lg:col-span-3">
          <Plus className="h-4 w-4" /> Add {type} Lead
        </Button>
      </form>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-white/10 text-white/56">
            <tr>
              {["Date", "Source", "Customer", "Contact", "Address", "Vehicle", "Status", "Remarks", "Delete"].map((heading) => (
                <th key={heading} className="p-3 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-white/8">
                <td className="p-3">{lead.date}</td>
                <td className="p-3">{lead.source}</td>
                <td className="p-3 font-medium">{lead.name || "-"}</td>
                <td className="p-3">{lead.contact || "-"}</td>
                <td className="p-3">{lead.address || "-"}</td>
                <td className="p-3">{lead.vehicle || "-"}</td>
                <td className="p-3">
                  <Badge>{lead.status}</Badge>
                </td>
                <td className="p-3 text-white/66">{lead.remarks || lead.requirement || "-"}</td>
                <td className="p-3">
                  <Button type="button" variant="ghost" onClick={() => onDelete(lead.id)}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function UploadBox({ name, icon, title, copy, capture = false }: { name: string; icon: React.ReactNode; title: string; copy: string; capture?: boolean }) {
  return (
    <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/18 bg-black/25 p-5 text-center transition hover:border-volt/60 hover:bg-volt/10">
      {icon}
      <span className="font-medium">{title}</span>
      <span className="mt-1 text-sm text-white/50">{copy}</span>
      <input name={name} type="file" multiple={!capture} accept="image/*" capture={capture ? "environment" : undefined} className="hidden" />
    </label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}
