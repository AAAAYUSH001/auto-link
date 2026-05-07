import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const FATHER_WHATSAPP_NUMBER = "917004780803";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function emi(principal: number, annualRate: number, months: number) {
  const rate = annualRate / 12 / 100;
  return Math.round((principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1));
}

export function whatsappUrl(carName: string, phone = FATHER_WHATSAPP_NUMBER) {
  const message = `Hello Auto Link, I am interested in the ${carName} listed on your website.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
