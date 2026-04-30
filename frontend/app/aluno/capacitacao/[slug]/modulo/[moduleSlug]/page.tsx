"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { coursesService } from "@/services/courses";

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="prose prose-sm prose-headings:font-display prose-headings:text-brand-ink prose-p:text-brand-ink/90 prose-strong:text-brand-ink prose-li:text-brand-ink/90 max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-6 mb-2 text-lg font-semibold text-brand-ink">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-4 mb-1.5 text-base font-semibold text-brand-ink">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("| ")) {
          return null;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={i} className="ml-4 text-sm leading-6 text-brand-ink/90">
              {renderInline(line.slice(2))}
            </li>
          );
        }
        if (line.startsWith("1. ") || /^\d+\. /.test(line)) {
          return (
            <li key={i} className="ml-4 list-decimal text-sm leading-6 text-brand-ink/90">
              {renderInline(line.replace(/^\d+\.\s/, ""))}
            </li>
          );
        }
        if (line.startsWith("❌ ") || line.startsWith("✅ ")) {
          return (
            <p key={i} className="text-sm leading-6">
              {line}
            </p>
          );
        }
        if (line.trim() === "") {
          return <div key={i} className="h-2" />;
        }
        return (
          <p key={i} className="text-sm leading-7 text-brand-ink/90">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-brand-ink">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ModulePage() {
  const { slug, moduleSlug } = useParams<{ slug: string; moduleSlug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const moduleQuery = useQuery({
    queryKey: ["course-module", slug, moduleSlug],
    queryFn: () => coursesService.getModule(slug, moduleSlug),
  });

  const completeMutation = useMutation({
    mutationFn: () => coursesService.completeModule(slug, moduleSlug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["course", slug] });
      void queryClient.invalidateQueries({ queryKey: ["course-module", slug, moduleSlug] });

      const mod = moduleQuery.data;
      if (mod?.isLastModule) {
        toast.success("Módulo concluído! Você completou todos os módulos.");
        router.push(`/aluno/capacitacao/${slug}`);
      } else if (mod?.next) {
        toast.success("Módulo concluído!");
        router.push(`/aluno/capacitacao/${slug}/modulo/${mod.next.slug}`);
      }
    },
    onError: () => toast.error("Erro ao marcar módulo como concluído."),
  });

  if (moduleQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white/70" />
        <div className="h-96 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
      </div>
    );
  }

  if (moduleQuery.isError || !moduleQuery.data) {
    return <EmptyState title="Módulo não encontrado" description="Não foi possível carregar este módulo." />;
  }

  const mod = moduleQuery.data;
  const isCompleted = mod.status === "COMPLETED";

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {/* Breadcrumb nav */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/aluno/capacitacao/${slug}`} className="hover:text-brand-ink">
          Capacitação
        </Link>
        <span>/</span>
        <span className="text-brand-ink">{mod.title}</span>
      </div>

      {/* Module header */}
      <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Módulo {mod.order}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-brand-ink">
              {mod.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
          </div>
          {isCompleted && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              Concluído
            </div>
          )}
        </div>
      </div>

      {/* Video placeholder */}
      {mod.videoUrl && (
        <div className="overflow-hidden rounded-2xl border border-brand-line/60 bg-black shadow-soft">
          <div className="aspect-video w-full">
            <iframe
              src={mod.videoUrl}
              className="h-full w-full"
              allowFullScreen
              title={mod.title}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="rounded-2xl border border-brand-line/60 bg-white/80 px-6 py-5 shadow-soft">
        <MarkdownContent content={mod.content} />
      </div>

      {/* Key takeaways */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 px-6 py-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
          <Lightbulb className="size-4" />
          O que você precisa saber
        </div>
        <ul className="mt-3 space-y-2">
          {mod.keyTakeaways.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-900/80">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div>
          {mod.prev && (
            <Link
              href={`/aluno/capacitacao/${slug}/modulo/${mod.prev.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
            >
              <ArrowLeft className="size-4" />
              Anterior
            </Link>
          )}
        </div>

        <div className="flex gap-3">
          {isCompleted ? (
            mod.isLastModule ? (
              <Link
                href={`/aluno/capacitacao/${slug}`}
                className={cn(buttonVariants({ size: "sm" }), "gap-2")}
              >
                <GraduationCap className="size-4" />
                Ver avaliação
              </Link>
            ) : (
              <Link
                href={`/aluno/capacitacao/${slug}/modulo/${mod.next!.slug}`}
                className={cn(buttonVariants({ size: "sm" }), "gap-2")}
              >
                Próximo módulo
                <ArrowRight className="size-4" />
              </Link>
            )
          ) : (
            <Button
              size="sm"
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              className="gap-2"
            >
              <CheckCircle2 className="size-4" />
              {completeMutation.isPending ? "Salvando…" : "Marcar como concluído"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
