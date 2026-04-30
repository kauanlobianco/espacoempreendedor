"use client";

import { FormEvent, useMemo, useState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";

import { SiteLogo } from "@/components/branding/site-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SiteAccessPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(() => {
    if (typeof window === "undefined") return "/";
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.startsWith("/") ? next : "/";
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/site-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Credencial invalida.");
        return;
      }

      window.location.assign(nextPath);
    } catch {
      setError("Nao foi possivel validar a credencial agora.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--brand-paper)] px-4 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-lift md:p-8">
        <div className="space-y-7">
          <div className="space-y-5">
            <SiteLogo size="md" />
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-orange-ghost)] px-3 py-1 text-[12px] font-semibold text-[var(--brand-orange-deep)]">
                <LockKeyhole className="size-3.5" />
                Projeto privado
              </div>
              <h1 className="font-display text-[2.3rem] leading-none tracking-[-0.04em] text-[var(--brand-ink)]">
                Acesso restrito
              </h1>
              <p className="text-sm leading-6 text-[var(--brand-mute)]">
                O Espaço do Empreendedor ainda está em desenvolvimento e não está disponível para o público geral.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[var(--brand-ink)]">
                Credencial de acesso
              </label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoFocus
                autoComplete="current-password"
                placeholder="Digite a credencial"
                aria-invalid={Boolean(error)}
              />
              {error ? <p className="text-[12px] text-[var(--brand-red)]">{error}</p> : null}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Validando..." : "Entrar no site"}
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
