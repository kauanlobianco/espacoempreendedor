"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, Menu, Search } from "lucide-react";
import { toast } from "sonner";

import { SiteLogo } from "@/components/branding/site-logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { casesService } from "@/services/cases";
import type { CaseListItem } from "@/types/api";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  badge?: number | string;
  icon?: ReactNode;
}

interface Crumb {
  label: string;
  href?: string;
}

function inferPageTitle(
  pathname: string | null,
  title: string | undefined,
  breadcrumbs: Crumb[] | undefined,
  activeNavLabel: string | undefined,
  roleLabel: string,
) {
  if (title) return title;
  if (breadcrumbs?.length) return breadcrumbs[breadcrumbs.length - 1]?.label;
  if (pathname?.includes("/aluno/casos/")) return "Detalhe do caso";
  if (pathname?.includes("/professor/casos/")) return "Detalhe do caso";
  if (pathname?.includes("/professor/alunos/")) return "Detalhe do aluno";
  if (pathname?.includes("/aluno/relatorio-extensao/novo")) return "Novo relatorio";
  if (pathname?.includes("/aluno/relatorio-extensao/")) return "Relatorio de extensao";
  if (pathname?.includes("/professor/relatorios/")) return "Relatorio";
  return activeNavLabel ?? roleLabel;
}

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function scoreCaseMatch(item: CaseListItem, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const queryDigits = normalizeDigits(query);
  const fullName = item.request.fullName.toLowerCase();
  const cpfDigits = normalizeDigits(item.request.cpf ?? "");

  if (queryDigits && cpfDigits) {
    if (cpfDigits === queryDigits) return 1000;
    if (cpfDigits.startsWith(queryDigits)) return 900;
  }

  if (fullName === normalizedQuery) return 800;
  if (fullName.startsWith(normalizedQuery)) return 700;
  if (fullName.includes(normalizedQuery)) return 600;

  return -1;
}

export function DashboardShell({
  title,
  nav,
  breadcrumbs,
  actions,
  children,
}: {
  title?: string;
  nav: NavItem[];
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [globalSearch, setGlobalSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const role = user?.role;
  const roleLabel =
    role === "STUDENT"
      ? "Aluno extensionista"
      : role === "PROFESSOR"
        ? "Professor orientador"
        : "Membro";
  const areaLabel =
    role === "STUDENT"
      ? "Area do aluno"
      : role === "PROFESSOR"
        ? "Area do professor"
        : "Area interna";
  const homeHref =
    role === "STUDENT" ? "/aluno/fila" : role === "PROFESSOR" ? "/professor/dashboard" : "/";

  const activeNav = useMemo(
    () => nav.find((item) => item.href === pathname || pathname?.startsWith(`${item.href}/`)),
    [nav, pathname],
  );
  const pageTitle = inferPageTitle(pathname, title, breadcrumbs, activeNav?.label, roleLabel);

  const navContent = (
    <nav className="space-y-0.5">
      {nav.map((item) => {
        const active = item.href === pathname || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group/nav relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors",
              active
                ? "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]"
                : "text-[var(--brand-night)]/80 hover:bg-[var(--brand-paper-deep)] hover:text-[var(--brand-ink)]",
            )}
          >
            {active ? (
              <span
                aria-hidden
                className="absolute inset-y-2 -left-3 w-[3px] rounded-full bg-[var(--brand-orange)]"
              />
            ) : null}
            {item.icon ? (
              <span
                className={cn(
                  "flex size-5 items-center justify-center text-[var(--brand-mute)] group-hover/nav:text-[var(--brand-ink)]",
                  active && "text-[var(--brand-orange-deep)]",
                )}
              >
                {item.icon}
              </span>
            ) : null}
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge ? (
              <Pill tone={active ? "orange" : "ghost"} size="sm">
                {item.badge}
              </Pill>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  async function handleGlobalSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = globalSearch.trim();
    if (!query) return;

    try {
      setIsSearching(true);
      const response = await casesService.list({ pageSize: 100 });
      const ranked = response.items
        .map((item) => ({ item, score: scoreCaseMatch(item, query) }))
        .filter((entry) => entry.score >= 0)
        .sort((left, right) => right.score - left.score);

      const target = ranked[0]?.item;

      if (!target) {
        toast.error("Nenhum caso encontrado para esse nome ou CPF.");
        return;
      }

      const caseBasePath = role === "PROFESSOR" ? "/professor/casos" : "/aluno/casos";
      router.push(`${caseBasePath}/${target.id}`);
      setGlobalSearch("");
    } catch {
      toast.error("Nao foi possivel buscar os casos agora.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-paper)]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[480px] opacity-70 bg-dash-glow"
      />

      <div className="lg:grid lg:min-h-screen lg:grid-cols-[244px_minmax(0,1fr)]">
        <aside className="hidden h-screen flex-col border-r border-[color:var(--brand-soft-line)] bg-white lg:flex">
          <div className="border-b border-[color:var(--brand-soft-line)] px-5 py-5">
            <SiteLogo href={homeHref} size="sm" />
          </div>

          <div className="px-5 py-5">
            <Eyebrow tone="mute">{roleLabel}</Eyebrow>
            <div className="mt-4">{navContent}</div>
          </div>

          <div className="mt-auto border-t border-[color:var(--brand-soft-line)] px-5 py-4">
            <div className="flex items-center gap-3">
              <Avatar name={user?.email ?? "?"} size="md" tone="orange" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[var(--brand-ink)]">
                  {user?.email}
                </p>
                <p className="text-[11px] text-[var(--brand-mute)]">{roleLabel}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full justify-between text-[var(--brand-mute)] hover:text-[var(--brand-red)]"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Sair
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-30 border-b border-[color:var(--brand-soft-line)] bg-[var(--brand-paper)]/96 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <Sheet>
                  <SheetTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="lg:hidden"
                        aria-label="Abrir menu"
                      />
                    }
                  >
                    <Menu className="size-4" />
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] bg-white">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {navContent}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-[var(--brand-mute)]"
                        onClick={() => {
                          logout();
                          router.push("/login");
                        }}
                      >
                        Sair
                        <LogOut className="size-3.5" />
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="min-w-0">
                  <nav className="flex min-w-0 flex-wrap items-center gap-1 text-[11.5px] font-medium text-[var(--brand-mute)]">
                    <Link href={homeHref} className="hover:text-[var(--brand-ink)]">
                      {areaLabel}
                    </Link>
                    <span className="flex items-center gap-1">
                      <ChevronRight className="size-3 text-[var(--brand-mute)]/60" />
                      <span className="text-[var(--brand-ink)]">{pageTitle}</span>
                    </span>
                  </nav>
                  <h1 className="mt-1 truncate text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--brand-ink)] md:text-[1.3rem]">
                    {pageTitle}
                  </h1>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 md:w-auto">
                <form
                  onSubmit={handleGlobalSearch}
                  className="relative hidden md:block md:w-[300px] lg:w-[360px]"
                >
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--brand-mute)]" />
                  <Input
                    aria-label="Buscar por nome ou CPF"
                    placeholder="Buscar por nome ou CPF"
                    className="h-10 rounded-full bg-white pl-9 pr-4"
                    value={globalSearch}
                    onChange={(event) => setGlobalSearch(event.target.value)}
                    disabled={isSearching}
                  />
                </form>
                {actions}
              </div>
            </div>
          </div>

          <div className="space-y-6 px-4 py-5 md:px-6 lg:px-8 lg:py-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
