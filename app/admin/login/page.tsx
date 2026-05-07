"use client";

import { FormEvent, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CarFront, LockKeyhole, LogIn } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    setLoading(false);

    if (!data.ok) {
      setError(data.error || "Wrong password.");
      return;
    }

    window.location.href = next;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-volt text-ink">
            <CarFront className="h-7 w-7" />
          </div>
          <Badge className="mb-3">Admin Login</Badge>
          <h1 className="text-3xl font-black">Auto Link</h1>
          <p className="mt-2 text-sm text-white/58">Enter password to upload cars and manage leads.</p>
        </div>

        <form className="space-y-4" onSubmit={login}>
          <label>
            <span className="mb-2 block text-sm font-medium text-white/72">Password</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-white/45" />
              <input
                suppressHydrationWarning
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-lg border border-white/12 bg-black/30 px-4 pl-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-volt"
                placeholder="Enter admin password"
                required
              />
            </div>
          </label>

          {error && <p className="rounded-lg border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="h-4 w-4" /> {loading ? "Checking..." : "Login"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

function LoginShell() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-volt text-ink">
            <CarFront className="h-7 w-7" />
          </div>
          <p className="text-sm text-white/58">Loading admin login...</p>
        </div>
      </Card>
    </main>
  );
}
