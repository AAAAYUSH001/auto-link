"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Eye, Fuel, Gauge, MessageCircle, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import type { Car } from "@/lib/data";
import { emi, formatInr, whatsappUrl } from "@/lib/utils";

export function CarCard({ car }: { car: Car }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      whileHover={{ y: -8 }}
    >
      <Card className="group overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={car.image}
            alt={car.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {car.featured && <Badge className="border-volt/30 bg-volt/20 text-volt">Featured</Badge>}
            {car.negotiable && <Badge className="border-brass/30 bg-brass/20 text-brass">Negotiable</Badge>}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <h3 className="text-xl font-semibold">{car.title}</h3>
              <p className="text-sm text-white/68">{car.city} • {car.color}</p>
            </div>
            <Badge className="bg-black/40">
              <Eye className="h-3.5 w-3.5" /> {car.views.toLocaleString("en-IN")}
            </Badge>
          </div>
        </div>
        <div className="space-y-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-2xl font-bold">{formatInr(car.price)}</p>
              <p className="text-sm text-smoke">EMI from {formatInr(emi(car.price * 0.82, 9.4, 60))}/mo</p>
            </div>
            <div className="rounded-lg border border-signal/25 bg-signal/10 px-3 py-2 text-center">
              <p className="text-xs text-signal">AI Value</p>
              <p className="font-bold">{car.valueScore}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-white/75">
            <span className="rounded-lg bg-white/7 p-2"><Gauge className="mb-1 h-4 w-4 text-signal" />{car.km.toLocaleString("en-IN")} km</span>
            <span className="rounded-lg bg-white/7 p-2"><Fuel className="mb-1 h-4 w-4 text-brass" />{car.fuel}</span>
            <span className="rounded-lg bg-white/7 p-2"><Sparkles className="mb-1 h-4 w-4 text-volt" />{car.transmission}</span>
          </div>
          <p className="line-clamp-3 text-sm leading-6 text-white/66">{car.description}</p>
          <div className="flex flex-wrap gap-2">
            {car.badges.map((badge) => (
              <Badge key={badge}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-volt" /> {badge}
              </Badge>
            ))}
          </div>
          <a href={whatsappUrl(car.title)} target="_blank" rel="noreferrer" onClick={() => fetch("/api/leads", { method: "POST", body: JSON.stringify({ carId: car.id, type: "whatsapp_click" }) })}>
            <Button className="w-full">
              <MessageCircle className="h-4 w-4" /> Contact Dealer
            </Button>
          </a>
        </div>
      </Card>
    </motion.article>
  );
}
