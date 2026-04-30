"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Lock,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/feedback/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { coursesService } from "@/services/courses";
import type { CourseModuleSummary } from "@/types/api";

const STATUS_ICON = {
  NOT_STARTED: <Clock className="size-4 text-muted-foreground" />,
  IN_PROGRESS: <BookOpen className="size-4 text-brand-orange" />,
  COMPLETED: <CheckCircle2 className="size-4 text-emerald-600" />,
};

const STATUS_LABEL = {
  NOT_STARTED: "Não iniciado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
};

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-paper">
      <div
        className="h-full rounded-full bg-brand-orange transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ModuleRow({ mod, courseSlug, index }: { mod: CourseModuleSummary; courseSlug: string; index: number }) {
  return (
    <Link href={`/aluno/capacitacao/${courseSlug}/modulo/${mod.slug}`}>
      <div
        className={cn(
          "group flex items-start gap-4 rounded-2xl border p-5 transition-all hover:shadow-md",
          mod.status === "COMPLETED"
            ? "border-emerald-200 bg-emerald-50/60 hover:border-emerald-300"
            : mod.status === "IN_PROGRESS"
              ? "border-brand-orange/40 bg-orange-50/40 hover:border-brand-orange/60"
              : "border-brand-line/60 bg-white/80 hover:border-brand-orange/40",
        )}
      >
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
            mod.status === "COMPLETED"
              ? "bg-emerald-100 text-emerald-700"
              : mod.status === "IN_PROGRESS"
                ? "bg-brand-orange/15 text-brand-orange"
                : "bg-brand-paper text-muted-foreground",
          )}
        >
          {mod.status === "COMPLETED" ? (
            <CheckCircle2 className="size-4" />
          ) : (
            String(index + 1)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-brand-ink">{mod.title}</span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{mod.description}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {STATUS_ICON[mod.status]}
          <span className="hidden sm:inline">{STATUS_LABEL[mod.status]}</span>
        </div>

        <ChevronRight className="size-4 shrink-0 text-brand-line transition-colors group-hover:text-brand-orange" />
      </div>
    </Link>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const courseQuery = useQuery({
    queryKey: ["course", slug],
    queryFn: () => coursesService.getCourse(slug),
  });

  if (courseQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-36 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          ))}
        </div>
      </div>
    );
  }

  if (courseQuery.isError || !courseQuery.data) {
    return <EmptyState title="Curso não encontrado" description="Não foi possível carregar este curso." />;
  }

  const course = courseQuery.data;
  const allDone = course.completedModules === course.totalModules;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Capacitação"
        title={course.title}
        description={course.description}
      />

      {/* Progress card */}
      <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Progresso
            </p>
            <p className="text-2xl font-bold text-brand-ink">
              {course.completedModules}/{course.totalModules} módulos
            </p>
          </div>

          <div className="flex gap-3">
            {course.quizPassed ? (
              <Link
                href={`/aluno/capacitacao/${slug}/certificado`}
                className={cn(buttonVariants({ size: "sm" }), "gap-2")}
              >
                <Trophy className="size-4" /> Ver certificado
              </Link>
            ) : allDone ? (
              <Link
                href={`/aluno/capacitacao/${slug}/avaliacao`}
                className={cn(buttonVariants({ size: "sm" }), "gap-2")}
              >
                <GraduationCap className="size-4" /> Fazer avaliação
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar value={course.completedModules} max={course.totalModules} />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {Math.round((course.completedModules / course.totalModules) * 100)}% concluído
          </p>
        </div>

        {course.quizPassed && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Trophy className="size-4 shrink-0" />
            <span>
              Avaliação concluída com nota {course.bestScore}/{10}. Parabéns!
            </span>
          </div>
        )}

        {course.attemptCount > 0 && !course.quizPassed && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <Clock className="size-4 shrink-0" />
            <span>
              Você fez {course.attemptCount} tentativa(s). Nota mínima: {course.passingScore}/10.
            </span>
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-brand-ink">Módulos</h2>
        {course.modules.map((mod, i) => (
          <ModuleRow key={mod.slug} mod={mod} courseSlug={slug} index={i} />
        ))}
      </div>

      {/* Quiz CTA */}
      {!course.quizPassed && (
        <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-5 shadow-soft">
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              allDone ? "bg-brand-orange/15" : "bg-brand-paper",
            )}>
              {allDone ? (
                <GraduationCap className="size-5 text-brand-orange" />
              ) : (
                <Lock className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-brand-ink">Avaliação Final</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {allDone
                  ? `10 questões de múltipla escolha. Acerte ${course.passingScore} de 10 para concluir o curso.`
                  : `Conclua todos os ${course.totalModules} módulos para desbloquear a avaliação.`}
              </p>
            </div>
            {allDone && (
              <Link
                href={`/aluno/capacitacao/${slug}/avaliacao`}
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Iniciar
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
