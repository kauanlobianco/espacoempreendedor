"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";

import { SiteLogo } from "@/components/branding/site-logo";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PUBLIC_NAV } from "@/lib/constants/domain";
import { cn } from "@/lib/utils";

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu ao navegar e trava o scroll do fundo enquanto aberto
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : Boolean(pathname?.startsWith(href));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-[color:var(--brand-soft-line)] bg-[color:rgba(250,246,239,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:gap-8 md:px-6 md:py-4">
          <SiteLogo size="sm" />

          <nav className="hidden items-center gap-1 lg:flex">
            {PUBLIC_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                    active
                      ? "text-[var(--brand-ink)]"
                      : "text-[var(--brand-mute)] hover:text-[var(--brand-ink)]",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 -bottom-[1px] h-[2px] rounded-full bg-[var(--brand-orange)]"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="hidden items-center text-[13px] font-semibold text-[var(--brand-mute)] hover:text-[var(--brand-ink)] lg:inline-flex"
            >
              Área interna
            </Link>
            <Link
              href="/quero-ajuda"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--brand-ink)] px-4 text-[13px] font-semibold text-white shadow-soft transition hover:bg-[var(--brand-night)] sm:px-5 sm:text-sm"
            >
              Pedir ajuda
              <ArrowUpRight className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--brand-soft-line)] bg-white text-[var(--brand-ink)] transition hover:bg-[var(--brand-paper-deep)] lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen ? (
          <div className="border-t border-[color:var(--brand-soft-line)] bg-[var(--brand-paper,#faf6ef)] lg:hidden">
            <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
              {PUBLIC_NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center justify-between rounded-2xl px-4 text-[15px] font-semibold transition-colors",
                      active
                        ? "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]"
                        : "text-[var(--brand-night)] hover:bg-white",
                    )}
                  >
                    {item.label}
                    <ArrowRight className="size-4 opacity-50" />
                  </Link>
                );
              })}
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center justify-between rounded-2xl border-t border-[color:var(--brand-soft-line)] px-4 pt-1 text-[14px] font-semibold text-[var(--brand-mute)] hover:text-[var(--brand-ink)]"
              >
                Área interna
                <ArrowRight className="size-4 opacity-50" />
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="mt-20 bg-[var(--brand-ink)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-12 md:px-6">
          <div className="space-y-5 md:col-span-5">
            <SiteLogo href="/" invert size="md" />
            <p className="max-w-sm text-[14.5px] leading-relaxed text-white/70">
              Atendimento universitário com orientação humana e linguagem simples para
              quem tem dúvidas sobre MEI. Serviço gratuito da extensão UFF.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/quero-ajuda"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--brand-orange-deep)]"
              >
                Pedir ajuda
                <ArrowUpRight className="size-3.5" />
              </Link>
              <Link
                href="/acompanhar"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/10"
              >
                Acompanhar pedido
              </Link>
            </div>
          </div>

          <div className="space-y-3 md:col-span-3">
            <Eyebrow tone="white">Acesso rápido</Eyebrow>
            <ul className="space-y-2 text-[14px] text-white/80">
              <li><Link href="/informacoes/abrir-mei" className="inline-flex min-h-8 items-center hover:text-[var(--brand-orange)]">Abrir MEI</Link></li>
              <li><Link href="/informacoes/ja-sou-mei" className="inline-flex min-h-8 items-center hover:text-[var(--brand-orange)]">Já sou MEI</Link></li>
              <li><Link href="/informacoes/nota-fiscal" className="inline-flex min-h-8 items-center hover:text-[var(--brand-orange)]">Nota fiscal e DAS</Link></li>
              <li><Link href="/informacoes/golpes" className="inline-flex min-h-8 items-center hover:text-[var(--brand-orange)]">Golpes e cobranças</Link></li>
              <li><Link href="/mulheres-empreendedoras" className="inline-flex min-h-8 items-center hover:text-[var(--brand-orange)]">Mulheres empreendedoras</Link></li>
              <li><Link href="/sobre" className="inline-flex min-h-8 items-center hover:text-[var(--brand-orange)]">Sobre o projeto</Link></li>
              <li><Link href="/login" className="inline-flex min-h-8 items-center hover:text-[var(--brand-orange)]">Área interna</Link></li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-4">
            <Eyebrow tone="white">Contato</Eyebrow>
            <ul className="space-y-2 text-[14px] text-white/80">
              <li>R. Mario Santos Braga, 30 — Centro, Niterói</li>
              <li>
                <a
                  href="mailto:empreendedor.uff@gmail.com"
                  className="hover:text-[var(--brand-orange)]"
                >
                  empreendedor.uff@gmail.com
                </a>
              </li>
              <li className="text-white/55">
                Serviço gratuito, com orientação baseada em fontes oficiais.
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[12.5px] text-white/55 md:flex-row md:items-center md:justify-between md:px-6">
            <span>© {new Date().getFullYear()} Espaço do Empreendedor · Projeto de extensão universitária</span>
            <span>Orientação clara. Sem juridiquês.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
