import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "subtle" }) {
  return (
    <button
      suppressHydrationWarning
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-signal/70 disabled:opacity-50",
        variant === "primary" && "bg-volt text-ink shadow-glow hover:-translate-y-0.5 hover:bg-white",
        variant === "ghost" && "border border-white/15 bg-white/5 text-white hover:bg-white/12",
        variant === "subtle" && "bg-white/10 text-white hover:bg-white/15",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-lg", className)} {...props} />;
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium text-white/82",
        className
      )}
      {...props}
    />
  );
}
