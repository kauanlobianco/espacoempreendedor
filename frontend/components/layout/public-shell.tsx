"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteLogo } from "@/components/branding/site-logo";
import { PUBLIC_NAV } from "@/lib/constants/domain";
import { cn } from "@/lib/utils";

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-brand-line/20 bg-background/88 backdrop-blur-[20px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-6">
          <Link
            href="/"
            className="shrink-0 text-xl font-bold tracking-[-0.04em] text-brand-ink md:text-[2rem]"
          >
            Espaco do Empreendedor
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-transparent pb-1 text-[15px] font-medium text-brand-ink transition-colors hover:text-brand-orange",
                  pathname === item.href && "border-brand-orange text-brand-orange",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/quero-ajuda"
              className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-orange-deep to-brand-orange px-6 text-[15px] font-semibold text-white shadow-soft transition hover:brightness-105"
            >
              Pedir ajuda
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 bg-[#f6f3ee]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
          <div className="space-y-3">
            <SiteLogo href="/" />
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Atendimento universitário com orientação humana e linguagem simples para quem tem dúvidas sobre MEI.
            </p>
          </div>
          <div className="space-y-2 text-sm text-brand-night/85">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
              Acesso rápido
            </p>
            <Link href="/informacoes/abrir-mei" className="block hover:text-brand-orange">
              Abrir MEI
            </Link>
            <Link href="/informacoes/golpes" className="block hover:text-brand-orange">
              Golpes e cobranças
            </Link>
            <Link href="/sobre" className="block hover:text-brand-orange">
              Sobre o projeto
            </Link>
            <Link href="/login" className="block hover:text-brand-orange">
              Área interna
            </Link>
          </div>
          <div className="space-y-2 text-sm text-brand-night/85">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
              Contato
            </p>
            <p>R. Mario Santos Braga, 30 - Centro, Niterói</p>
            <a href="mailto:empreendedor.uff@gmail.com" className="block hover:text-brand-orange">
              empreendedor.uff@gmail.com
            </a>
            <p>Serviço gratuito, com orientação baseada em fontes oficiais.</p>
          </div>
        </div>
        <div className="bg-white/55">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
            <span>© {new Date().getFullYear()} Espaço do Empreendedor · Projeto de extensão universitária</span>
            <span>Orientação clara. Sem juridiquês.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
