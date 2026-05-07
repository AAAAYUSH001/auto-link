"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Card } from "@/components/ui";
import { emi, formatInr } from "@/lib/utils";

export function FinanceCalculator() {
  const [price, setPrice] = useState(900000);
  const [down, setDown] = useState(180000);
  const [months, setMonths] = useState(60);
  const monthly = useMemo(() => emi(price - down, 9.4, months), [price, down, months]);
  const controls: Array<[string, number, number, number, (value: number) => void]> = [
    ["Car price", price, 300000, 2500000, setPrice],
    ["Down payment", down, 50000, 900000, setDown],
    ["Tenure months", months, 12, 84, setMonths]
  ];

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-volt p-3 text-ink"><Calculator className="h-5 w-5" /></div>
        <div>
          <h3 className="text-xl font-semibold">Finance & EMI Calculator</h3>
          <p className="text-sm text-white/60">Loan eligibility estimate for verified buyers.</p>
        </div>
      </div>
      <div className="space-y-5">
        {controls.map(([label, value, min, max, setter]) => (
          <label key={label as string} className="block">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-white/65">{label}</span>
              <span className="font-semibold">{label === "Tenure months" ? value : formatInr(value)}</span>
            </div>
            <input
              aria-label={label}
              type="range"
              min={min}
              max={max}
              step={label === "Tenure months" ? 12 : 25000}
              value={value}
              onChange={(event) => setter(Number(event.target.value))}
              className="w-full accent-volt"
            />
          </label>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-signal/20 bg-signal/10 p-4">
        <p className="text-sm text-signal">Estimated EMI</p>
        <p className="text-3xl font-bold">{formatInr(monthly)} / month</p>
      </div>
    </Card>
  );
}
