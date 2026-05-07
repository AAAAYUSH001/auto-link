"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  CarFront,
  CheckCircle2,
  LockKeyhole,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Upload
} from "lucide-react";
import { AiAssistant } from "@/components/ai-assistant";
import { CarGrid } from "@/components/car-grid";
import { FinanceCalculator } from "@/components/finance-calculator";
import { Badge, Button, Card } from "@/components/ui";
import { cars } from "@/lib/data";
import { FATHER_WHATSAPP_NUMBER } from "@/lib/utils";

const trust = ["RC Verified", "Insurance Checked", "Service History", "Loan Available", "Ownership Verified"];
const brands = [
  "BMW",
  "Maruti Suzuki",
  "Mercedes-Benz",
  "Porsche",
  "Hyundai",
  "Ford",
  "Honda",
  "Toyota",
  "Mahindra",
  "Tata",
  "Kia",
  "Skoda",
  "Volkswagen",
  "Nissan",
  "Renault",
  "Audi"
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />

      <section id="finder" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
          <Card className="p-6 sm:p-8">
            <SectionTitle
              eyebrow="Find The Best Car In Ranchi"
              title="Tell us your budget and we will shortlist the right car."
              copy="Simple buying help for Ranchi customers: choose budget, car type, fuel, and contact the dealer directly for the best available option."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {["Family SUV under 10 lakh", "Best mileage under 5 lakh", "Automatic car for city drive", "First owner verified car"].map((item) => (
                <a
                  key={item}
                  href={`https://wa.me/${FATHER_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Auto Link, please help me find: ${item} in Ranchi.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/12 bg-black/28 p-4 text-sm text-white/78 transition hover:border-volt/50 hover:bg-volt/10"
                >
                  <Search className="mb-3 h-5 w-5 text-volt" />
                  {item}
                </a>
              ))}
            </div>
            <a href={`https://wa.me/${FATHER_WHATSAPP_NUMBER}?text=Hello Auto Link, I want to find the best car in Ranchi.`} target="_blank" rel="noreferrer">
              <Button className="mt-5 w-full sm:w-auto">
                <MessageCircle className="h-4 w-4" /> Find My Best Car
              </Button>
            </a>
          </Card>
          <AiAssistant />
        </div>
      </section>

      <section id="cars" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Cars Available"
          title="Verified used cars with clear price, documents, and dealer contact."
          copy="No complicated marketplace noise. Browse the car, check key details, and contact Auto Link to buy or negotiate."
        />
        <CarGrid initialCars={cars} />
      </section>

      <section id="sell" className="border-y border-white/10 bg-white/[0.035]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Sell Your Car"
              title="Want to sell your car in Ranchi? Send details on WhatsApp."
              copy="Share photos, model, year, KM driven, ownership, insurance status, and expected price. Auto Link will review and contact you."
            />
            <Card className="grid gap-4 p-5 sm:grid-cols-2">
              {["Car photos", "Model and year", "KM driven", "Ownership details", "Insurance status", "Expected price"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-black/30 p-4">
                  <CheckCircle2 className="h-5 w-5 text-volt" />
                  <span className="text-sm text-white/78">{item}</span>
                </div>
              ))}
            </Card>
            <a
              href={`https://wa.me/${FATHER_WHATSAPP_NUMBER}?text=Hello Auto Link, I want to sell my car. Please guide me.`}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="mt-5">
                <Upload className="h-4 w-4" /> Sell Your Car
              </Button>
            </a>
          </div>
          <FinanceCalculator />
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <SectionTitle
              eyebrow="Trust & Verification"
              title="Transparent 2% fee. Verified paperwork. Cleaner used car deals."
              copy="Customers see what matters: RC, insurance, ownership, service history, loan support, and a direct dealer contact path."
            />
            <div className="flex flex-wrap gap-2">
              {trust.map((item) => (
                <Badge key={item}>
                  <ShieldCheck className="mr-1 h-3.5 w-3.5 text-volt" />
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Verified Cars", "Important documents checked before deal discussion.", ShieldCheck],
              ["Best Match Help", "We help buyers choose the right car for budget and use.", Sparkles],
              ["Local Ranchi Focus", "Built for Ranchi and nearby Jharkhand customers.", BadgeCheck]
            ].map(([title, copy, Icon]) => (
              <Card key={title as string} className="p-5">
                <Icon className="mb-5 h-7 w-7 text-signal" />
                <h3 className="font-semibold">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{copy as string}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <FooterAdminLink />
      <MobileNav />
    </main>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/72 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2 text-ink">
            <CarFront className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black tracking-wide">AUTO LINK</p>
            <p className="text-xs text-white/50">Driven By Trust</p>
          </div>
        </a>
        <div className="hidden items-center gap-6 text-sm text-white/66 md:flex">
          <a href="#finder">Find Best Car</a>
          <a href="#cars">Browse Cars</a>
          <a href="#sell">Sell</a>
          <a href="#trust">Trust</a>
        </div>
        <a href="tel:+917004780803">
          <Button variant="ghost">
            <PhoneCall className="h-4 w-4" /> Contact Dealer
          </Button>
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pb-14 pt-20">
      <BrandLogoWall />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/45" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
          <Badge className="mb-5 border-signal/30 bg-signal/15 text-signal">Used cars in Ranchi</Badge>
          <h1 className="max-w-4xl text-balance text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">
            Find Your Perfect Car Without Dealer Chaos.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Trusted used cars. Transparent 2% fee. Direct dealer contact.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#finder">
              <Button className="w-full sm:w-auto">
                <Search className="h-4 w-4" /> Find Best Car In Ranchi
              </Button>
            </a>
            <a href="#cars">
              <Button className="w-full sm:w-auto" variant="ghost">
                <CarFront className="h-4 w-4" /> Browse Cars
              </Button>
            </a>
            <a href={`https://wa.me/${FATHER_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
              <Button className="w-full sm:w-auto" variant="subtle">
                <MessageCircle className="h-4 w-4" /> Contact Dealer
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Verified Cars", "RC Checked", "Insurance Verified", "Fast Transfer", "Trusted Dealer"].map((item) => (
              <Badge key={item}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-volt" />
                {item}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BrandLogoWall() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_10%,rgba(40,240,212,0.18),transparent_34rem),linear-gradient(135deg,#050506,#141416_48%,#050506)]">
      <div className="absolute inset-0 opacity-45">
        <div className="grid h-full min-w-[920px] rotate-[-10deg] grid-cols-4 gap-4 px-6 py-12 sm:grid-cols-5 lg:grid-cols-6">
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <motion.div
              key={`${brand}-${index}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: (index % 12) * 0.035 }}
              className="flex h-24 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] px-4 text-center text-sm font-black uppercase tracking-wide text-white/70 shadow-glow backdrop-blur-sm"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-signal">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-black leading-tight sm:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-base leading-7 text-white/64">{copy}</p>}
    </div>
  );
}

function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-lg border border-white/12 bg-ink/88 p-2 text-xs text-white/70 shadow-lift backdrop-blur-xl md:hidden">
      {[
        ["Find", "#finder", Search],
        ["Cars", "#cars", CarFront],
        ["Sell", "#sell", Upload],
        ["Trust", "#trust", ShieldCheck]
      ].map(([label, href, Icon]) => (
        <a key={label as string} href={href as string} className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-white/8">
          <Icon className="h-4 w-4" />
          {label as string}
        </a>
      ))}
    </nav>
  );
}

function FooterAdminLink() {
  return (
    <footer className="mx-auto flex max-w-7xl justify-center px-4 pb-24 pt-2 sm:px-6 md:pb-8 lg:px-8">
      <a
        href="/admin/login"
        className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-white/45 transition hover:border-white/20 hover:text-white/75"
      >
        <LockKeyhole className="h-3.5 w-3.5" />
        Admin Login
      </a>
    </footer>
  );
}
