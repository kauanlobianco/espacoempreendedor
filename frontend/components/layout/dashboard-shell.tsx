"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

import { SiteLogo } from "@/components/branding/site-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
}

export function DashboardShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navContent = (
    <nav className="space-y-1">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-orange/10 text-brand-orange"
                : "text-brand-night/75 hover:bg-brand-paper hover:text-brand-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(249,115,22,0.08), transparent 30%)",
        }}
      />
      <div className="mx-auto flex max-w-[1400px] gap-5 px-4 py-4 md:px-6">
        {/* Sidebar */}
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-2xl border border-brand-line/70 bg-white/90 p-4 shadow-soft lg:flex">
          <div className="mb-5">
            <SiteLogo href={user?.role === "STUDENT" ? "/aluno/fila" : "/professor/dashboard"} />
          </div>

          <div className="flex-1 overflow-y-auto">{navContent}</div>

          <div className="mt-4 rounded-xl border border-brand-line/50 bg-brand-paper/60 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
              {user?.role === "STUDENT" ? "Aluno extensionista" : "Professor"}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-brand-ink">{user?.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-between text-muted-foreground hover:text-destructive"
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

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="mb-5 flex items-center justify-between rounded-2xl border border-brand-line/60 bg-white/85 px-4 py-3.5 shadow-soft md:px-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                Área interna
              </p>
              <h1 className="text-xl font-semibold text-brand-ink">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium text-brand-ink">{user?.email}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {user?.role === "STUDENT" ? "Aluno extensionista" : "Professor"}
                </p>
              </div>
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      className="lg:hidden"
                      aria-label="Abrir menu"
                    />
                  }
                >
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] bg-white">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {navContent}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-muted-foreground"
                      onClick={logout}
                    >
                      Sair
                      <LogOut className="size-3.5" />
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <div className="space-y-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
