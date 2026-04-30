"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Lock,
  Trophy,
} from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { buttonVariants } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { coursesService } from "@/services/courses";
import type { CourseModuleSummary } from "@/types/api";

const STATUS_ICON = {
  NOT_STARTED: <Clock className="size-4 text-muted-foreground" />,
  IN_PROGRESS: <BookOpen className="size-4 text-brand-orange" />,
  COMPLETED: <CheckCircle2 className="size-4 text-emerald-600" />,
};

const STATUS_LABEL = {
  NOT_STARTED: "Nao iniciado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluido",
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

function ModuleRow({
  mod,
  courseSlug,
  index,
}: {
  mod: CourseModuleSummary;
  courseSlug: string;
  index: number;
}) {
  return (
    <Link href={`/aluno/capacitacao/${encodeURIComponent(courseSlug)}/modulo/${encodeURIComponent(mod.slug)}`}>
      <div
        className={cn(
          "group grid gap-4 rounded-2xl border p-5 transition-all hover:shadow-md md:grid-cols-[2.5rem_1fr_auto_auto]",
          mod.status === "COMPLETED"
            ? "border-emerald-200 bg-emerald-50/60 hover:border-emerald-300"
            : mod.status === "IN_PROGRESS"
              ? "border-brand-orange/40 bg-orange-50/40 hover:border-brand-orange/60"
              : "border-brand-line/60 bg-white/80 hover:border-brand-orange/40",
        )}
      >
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
            mod.status === "COMPLETED"
              ? "bg-emerald-100 text-emerald-700"
              : mod.status === "IN_PROGRESS"
                ? "bg-brand-orange/15 text-brand-orange"
                : "bg-brand-paper text-muted-foreground",
          )}
        >
          {mod.status === "COMPLETED" ? <CheckCircle2 className="size-4" /> : String(index + 1)}
        </div>

        <div className="min-w-0">
          <h2 className="font-display text-base font-semibold leading-tight text-brand-ink">
            {mod.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{mod.description}</p>
          <p className="mt-2 text-xs leading-5 text-brand-night/70">
            Objetivo: {mod.objective}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {STATUS_ICON[mod.status]}
          <span>{STATUS_LABEL[mod.status]}</span>
        </div>

        <ChevronRight className="hidden size-4 shrink-0 self-center text-brand-line transition-colors group-hover:text-brand-orange md:block" />
      </div>
    </Link>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const courseSlug = Array.isArray(slug) ? slug[0] : slug;
  const decodedSlug = decodeURIComponent(courseSlug ?? "");

  const courseQuery = useQuery({
    queryKey: ["course", decodedSlug],
    queryFn: () => coursesService.getCourse(decodedSlug),
    enabled: Boolean(decodedSlug),
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
    const errorStatus = axios.isAxiosError(courseQuery.error)
      ? courseQuery.error.response?.status
      : null;
    const isAuthError = errorStatus === 401 || errorStatus === 403;
    const isNotFound = errorStatus === 404;

    return (
      <EmptyState
        title={
          isAuthError
            ? "Sessao expirada"
            : isNotFound
              ? "Curso nao encontrado"
              : "Nao foi possivel carregar o curso"
        }
        description={
          isAuthError
            ? "Entre novamente para acessar a capacitacao do aluno extensionista."
            : isNotFound
              ? `A API respondeu, mas nao encontrou o curso "${decodedSlug}". Confira se o backend publicado no Render esta atualizado.`
              : getErrorMessage(
                  courseQuery.error,
                  "A API de capacitacao nao respondeu como esperado. Confira se a URL do frontend aponta para o backend publicado correto.",
                )
        }
        primaryHref={isAuthError ? "/login" : "/aluno/capacitacao"}
        primaryLabel={isAuthError ? "Entrar novamente" : "Voltar aos cursos"}
      />
    );
  }

  const course = courseQuery.data;
  const allDone = course.completedModules === course.totalModules;
  const progress = Math.round((course.completedModules / course.totalModules) * 100);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Capacitacao"
        title={course.title}
        description={course.description}
      />

      <div className="rounded-2xl border border-brand-line/60 bg-white/85 p-6 shadow-soft">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-night/70">
                {course.totalModules} modulos
              </span>
              <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-night/70">
                {course.totalQuestions} questoes
              </span>
              <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-night/70">
                Nota minima {course.passingScore}/{course.totalQuestions}
              </span>
            </div>

            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Progresso
                  </p>
                  <p className="mt-1 text-2xl font-bold text-brand-ink">
                    {course.completedModules}/{course.totalModules} modulos
                  </p>
                </div>
                <p className="text-sm font-semibold text-brand-orange">{progress}%</p>
              </div>
              <div className="mt-3">
                <ProgressBar value={course.completedModules} max={course.totalModules} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {course.quizPassed ? (
              <Link
                href={`/aluno/capacitacao/${encodeURIComponent(decodedSlug)}/certificado`}
                className={cn(buttonVariants({ size: "sm" }), "gap-2")}
              >
                <Trophy className="size-4" />
                Ver certificado
              </Link>
            ) : allDone ? (
              <Link
                href={`/aluno/capacitacao/${encodeURIComponent(decodedSlug)}/avaliacao`}
                className={cn(buttonVariants({ size: "sm" }), "gap-2")}
              >
                <GraduationCap className="size-4" />
                Fazer avaliacao
              </Link>
            ) : null}
          </div>
        </div>

        {course.quizPassed ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Trophy className="size-4 shrink-0" />
            <span>
              Avaliacao concluida com nota {course.bestScore}/{course.totalQuestions}.
            </span>
          </div>
        ) : null}

        {course.attemptCount > 0 && !course.quizPassed ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <Clock className="size-4 shrink-0" />
            <span>
              Voce fez {course.attemptCount} tentativa(s). Nota minima: {course.passingScore}/{course.totalQuestions}.
            </span>
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-brand-ink">Modulos</h2>
        {course.modules.map((mod, index) => (
          <ModuleRow key={mod.slug} mod={mod} courseSlug={decodedSlug} index={index} />
        ))}
      </div>

      {!course.quizPassed ? (
        <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-5 shadow-soft">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                allDone ? "bg-brand-orange/15" : "bg-brand-paper",
              )}
            >
              {allDone ? (
                <GraduationCap className="size-5 text-brand-orange" />
              ) : (
                <Lock className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-brand-ink">Avaliacao final</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {allDone
                  ? `${course.totalQuestions} questoes de multipla escolha. Acerte ${course.passingScore} para concluir o curso.`
                  : `Conclua todos os ${course.totalModules} modulos para desbloquear a avaliacao.`}
              </p>
            </div>
            {allDone ? (
              <Link
                href={`/aluno/capacitacao/${encodeURIComponent(decodedSlug)}/avaliacao`}
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Iniciar
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
