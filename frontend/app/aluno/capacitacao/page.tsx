"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookOpen, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { getErrorMessage } from "@/lib/api/client";
import { coursesService } from "@/services/courses";

export default function CapacitacaoPage() {
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesService.list(),
  });

  const courses = coursesQuery.data ?? [];
  const errorStatus = axios.isAxiosError(coursesQuery.error)
    ? coursesQuery.error.response?.status
    : null;

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Área do aluno"
        title="Capacitação"
        description="Prepare-se para atender microempreendedores com segurança e base técnica oficial."
      />

      {coursesQuery.isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          ))}
        </div>
      ) : coursesQuery.isError ? (
        <EmptyState
          title={
            errorStatus === 401
              ? "Sessao expirada"
              : "Nao foi possivel carregar os cursos"
          }
          description={
            errorStatus === 401
              ? "Entre novamente para acessar a capacitacao do aluno extensionista."
              : getErrorMessage(
                  coursesQuery.error,
                  "A API de capacitacao nao respondeu como esperado. Confira se o backend publicado esta atualizado e se a URL da API do frontend aponta para o servico correto.",
                )
          }
          primaryHref={errorStatus === 401 ? "/login" : undefined}
          primaryLabel={errorStatus === 401 ? "Entrar novamente" : undefined}
        />
      ) : courses.length === 0 ? (
        <EmptyState
          title="Nenhum curso disponivel"
          description="A API respondeu, mas ainda nao retornou cursos publicados para este ambiente."
        />
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link key={course.slug} href={`/aluno/capacitacao/${course.slug}`}>
              <div className="group flex items-start gap-5 rounded-2xl border border-brand-line/60 bg-white/80 p-6 shadow-soft transition-all hover:border-brand-orange/40 hover:shadow-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
                  <GraduationCap className="size-6 text-brand-orange" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-semibold leading-tight text-brand-ink">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-3.5" />
                      {course.totalModules} módulos
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      Avaliação final com {course.totalQuestions} questões
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-5 shrink-0 text-brand-line transition-colors group-hover:text-brand-orange" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
