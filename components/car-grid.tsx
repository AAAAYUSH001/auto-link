"use client";

import { useEffect, useState } from "react";
import { CarCard } from "@/components/car-card";
import type { Car } from "@/lib/data";

export function CarGrid({ initialCars }: { initialCars: Car[] }) {
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSavedCars() {
      const response = await fetch("/api/cars", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Could not load cars");
      }
      const data = await response.json();
      setAvailableCars(data.cars ?? initialCars);
      setLoaded(true);
    }

    loadSavedCars().catch(() => {
      setAvailableCars(initialCars);
      setLoaded(true);
    });
  }, [initialCars]);

  if (!loaded) {
    return <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/60">Loading cars...</p>;
  }

  if (availableCars.length === 0) {
    return <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/60">No cars listed right now.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {availableCars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
