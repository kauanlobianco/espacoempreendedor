"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  ShieldAlert,
  Target,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { coursesService } from "@/services/courses";
import type { CourseCallout, CourseCalloutType, CourseModuleActivity } from "@/types/api";

const CALLOUT_META: Record<
  CourseCalloutType,
  { label: string; icon: ReactNode; className: string }
> = {
  attention: {
    label: "Atencao",
    icon: <AlertTriangle className="size-4" />,
    className: "bg-amber-50 text-amber-950 border-amber-200",
  },
  practice: {
    label: "Na pratica",
    icon: <ClipboardCheck className="size-4" />,
    className: "bg-emerald-50 text-emerald-950 border-emerald-200",
  },
  "common-error": {
    label: "Erro comum",
    icon: <ShieldAlert className="size-4" />,
    className: "bg-rose-50 text-rose-950 border-rose-200",
  },
  "attendance-tip": {
    label: "Como orientar no atendimento",
    icon: <MessageCircle className="size-4" />,
    className: "bg-orange-50 text-orange-950 border-orange-200",
  },
  escalation: {
    label: "Quando chamar o professor",
    icon: <Target className="size-4" />,
    className: "bg-sky-50 text-sky-950 border-sky-200",
  },
  "official-source": {
    label: "Fonte oficial a consultar",
    icon: <ExternalLink className="size-4" />,
    className: "bg-zinc-50 text-zinc-950 border-zinc-200",
  },
};

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-brand-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-3 text-[15px] leading-7 text-brand-ink/90">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={index} className="h-1" />;

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-4 text-xl font-semibold tracking-tight text-brand-ink">
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-3 text-base font-semibold text-brand-ink">
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={index} className="flex gap-2">
              <span className="mt-3 size-1.5 shrink-0 rounded-full bg-brand-orange" />
              <p>{renderInline(trimmed.slice(2))}</p>
            </div>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <div key={index} className="flex gap-2">
              <span className="mt-1.5 min-w-6 shrink-0 font-semibold text-brand-orange">
                {trimmed.match(/^\d+/)?.[0]}.
              </span>
              <p>{renderInline(trimmed.replace(/^\d+\.\s/, ""))}</p>
            </div>
          );
        }

        if (trimmed.startsWith("|")) {
          return (
            <p
              key={index}
              className="overflow-x-auto rounded-xl bg-brand-paper/70 px-3 py-2 font-mono text-xs leading-6 text-brand-night/80"
            >
              {trimmed}
            </p>
          );
        }

        return <p key={index}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

function CalloutCard({ callout }: { callout: CourseCallout }) {
  const meta = CALLOUT_META[callout.type];

  return (
    <article className={cn("rounded-2xl border p-5", meta.className)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
        {meta.icon}
        {meta.label}
      </div>
      <h3 className="mt-3 text-base font-semibold">{callout.title}</h3>
      <p className="mt-2 text-sm leading-6 opacity-85">{callout.body}</p>
    </article>
  );
}

function ActivityCard({ activity }: { activity: CourseModuleActivity }) {
  return (
    <Card className="border-brand-orange/25 bg-brand-orange/5 shadow-soft">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
          <ClipboardCheck className="size-4" />
          Miniatividade
        </div>
        <p className="text-base font-semibold leading-7 text-brand-ink">{activity.prompt}</p>

        {activity.options?.length ? (
          <div className="grid gap-2">
            {activity.options.map((option, index) => (
              <div key={option} className="rounded-xl bg-white/80 px-4 py-3 text-sm text-brand-night/85">
                <span className="mr-2 font-semibold text-brand-orange">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </div>
            ))}
          </div>
        ) : null}

        {activity.expectedAnswer ? (
          <details className="rounded-2xl bg-white/80 p-4 text-sm leading-6 text-brand-night/85">
            <summary className="cursor-pointer font-semibold text-brand-ink">
              Ver resposta esperada
            </summary>
            <p className="mt-3">{activity.expectedAnswer}</p>
          </details>
        ) : null}
      </CardContent>
    </Card>
  );
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
        toast.success("Modulo concluido. A avaliacao final ja pode ser acessada.");
        router.push(`/aluno/capacitacao/${slug}`);
      } else if (mod?.next) {
        toast.success("Modulo concluido.");
        router.push(`/aluno/capacitacao/${slug}/modulo/${mod.next.slug}`);
      }
    },
    onError: () => toast.error("Erro ao marcar modulo como concluido."),
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
    return (
      <EmptyState
        title="Modulo nao encontrado"
        description="Nao foi possivel carregar este modulo."
      />
    );
  }

  const mod = moduleQuery.data;
  const isCompleted = mod.status === "COMPLETED";

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/aluno/capacitacao/${slug}`} className="hover:text-brand-ink">
          Capacitacao
        </Link>
        <span>/</span>
        <span className="text-brand-ink">{mod.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          <Card className="border-brand-line/60 bg-white/90 shadow-soft">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                    Modulo {mod.order}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">
                    {mod.title}
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {mod.description}
                  </p>
                </div>

                {isCompleted ? (
                  <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="size-3.5" />
                    Concluido
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl bg-brand-paper/70 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
                  <Target className="size-4 text-brand-orange" />
                  Objetivo de aprendizagem
                </div>
                <p className="mt-2 text-sm leading-6 text-brand-night/85">{mod.objective}</p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-[15px] leading-7 text-brand-night/85">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-ink">
                  <BookOpen className="size-4 text-brand-orange" />
                  Introducao
                </div>
                <p>{mod.intro}</p>
              </div>
            </CardContent>
          </Card>

          {mod.videoUrl ? (
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
          ) : null}

          <Card className="border-brand-line/60 bg-white/90 shadow-soft">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                  Conteudo principal
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink">
                  Estudo guiado
                </h2>
              </div>
              <MarkdownContent content={mod.content} />
            </CardContent>
          </Card>

          {mod.callouts.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {mod.callouts.map((callout) => (
                <CalloutCard key={`${callout.type}-${callout.title}`} callout={callout} />
              ))}
            </div>
          ) : null}

          <ActivityCard activity={mod.activity} />

          <Card className="border-brand-line/60 bg-white/90 shadow-soft">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
                <Lightbulb className="size-4 text-brand-orange" />
                Resumo do modulo
              </div>
              <div className="grid gap-3">
                {mod.summary.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-brand-paper/70 p-4 text-sm leading-6 text-brand-night/85">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand-line/60 bg-white/90 shadow-soft">
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                  Perguntas de fixacao
                </p>
                <h2 className="mt-2 text-xl font-semibold text-brand-ink">
                  Confira se o conceito ficou claro
                </h2>
              </div>
              <div className="space-y-3">
                {mod.fixationQuestions.map((item, index) => (
                  <details key={item.question} className="rounded-2xl bg-brand-paper/70 p-4">
                    <summary className="cursor-pointer text-sm font-semibold leading-6 text-brand-ink">
                      {index + 1}. {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-brand-night/85">{item.answer}</p>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-brand-line/60 bg-white/90 shadow-soft">
            <CardContent className="space-y-4 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                Navegacao
              </p>
              <div className="grid gap-2">
                {mod.prev ? (
                  <Link
                    href={`/aluno/capacitacao/${slug}/modulo/${mod.prev.slug}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "justify-start gap-2")}
                  >
                    <ArrowLeft className="size-4" />
                    Modulo anterior
                  </Link>
                ) : null}

                {isCompleted ? (
                  mod.isLastModule ? (
                    <Link
                      href={`/aluno/capacitacao/${slug}`}
                      className={cn(buttonVariants({ size: "sm" }), "justify-start gap-2")}
                    >
                      <GraduationCap className="size-4" />
                      Ver avaliacao
                    </Link>
                  ) : (
                    <Link
                      href={`/aluno/capacitacao/${slug}/modulo/${mod.next!.slug}`}
                      className={cn(buttonVariants({ size: "sm" }), "justify-start gap-2")}
                    >
                      Proximo modulo
                      <ArrowRight className="size-4" />
                    </Link>
                  )
                ) : (
                  <Button
                    size="sm"
                    onClick={() => completeMutation.mutate()}
                    disabled={completeMutation.isPending}
                    className="justify-start gap-2"
                  >
                    <CheckCircle2 className="size-4" />
                    {completeMutation.isPending ? "Salvando..." : "Marcar concluido"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand-line/60 bg-white/90 shadow-soft">
            <CardContent className="space-y-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                Fontes do modulo
              </p>
              <div className="space-y-2">
                {mod.sources.map((source) => (
                  <p key={source} className="rounded-xl bg-brand-paper/70 px-3 py-2 text-xs leading-5 text-brand-night/80">
                    {source}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}
