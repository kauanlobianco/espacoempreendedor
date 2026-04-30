"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Award, ChevronLeft, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/feedback/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { coursesService } from "@/services/courses";
import { formatDate } from "@/lib/formatters";

export default function CertificadoPage() {
  const { slug } = useParams<{ slug: string }>();

  const certQuery = useQuery({
    queryKey: ["certificate", slug],
    queryFn: () => coursesService.getCertificate(slug),
  });

  if (certQuery.isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl border border-brand-line bg-white/70" />;
  }

  if (certQuery.isError || !certQuery.data) {
    return (
      <EmptyState
        title="Certificado não disponível"
        description="Você precisa passar na avaliação para obter o certificado."
        primaryHref={`/aluno/capacitacao/${slug}/avaliacao`}
        primaryLabel="Fazer avaliação"
      />
    );
  }

  const cert = certQuery.data;

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/aluno/capacitacao/${slug}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
        >
          <ChevronLeft className="size-4" /> Voltar ao curso
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
        >
          <Printer className="size-4" /> Imprimir
        </button>
      </div>

      {/* Certificate */}
      <div
        id="certificate"
        className="relative overflow-hidden rounded-3xl border-2 border-brand-orange/30 bg-white p-10 shadow-lg print:shadow-none"
      >
        {/* Decorative corners */}
        <div className="absolute left-0 top-0 size-24 rounded-br-full bg-brand-orange/5" />
        <div className="absolute bottom-0 right-0 size-24 rounded-tl-full bg-brand-orange/5" />

        <div className="relative text-center">
          <div className="flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-brand-orange/15">
              <Award className="size-8 text-brand-orange" />
            </div>
          </div>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Espaço Empreendedor — Extensão Universitária
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold text-brand-ink">
            Declaração de Conclusão
          </h1>

          <p className="mt-6 text-sm text-muted-foreground">Certificamos que</p>

          <p className="mt-2 font-display text-2xl font-bold text-brand-orange">
            {cert.studentName}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-brand-ink/80">
            concluiu com aprovação o curso
          </p>

          <p className="mt-2 text-base font-semibold text-brand-ink">
            {cert.courseTitle}
          </p>

          <div className="mx-auto mt-6 flex w-fit items-center gap-6 rounded-2xl bg-brand-paper/60 px-6 py-3 text-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Nota na avaliação</p>
              <p className="text-lg font-bold text-brand-orange">
                {cert.score}/{cert.total}
              </p>
            </div>
            <div className="h-10 w-px bg-brand-line/60" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Data de conclusão</p>
              <p className="font-semibold text-brand-ink">{formatDate(cert.completedAt)}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-brand-line/40 pt-6">
            <p className="text-xs text-muted-foreground">
              Este documento comprova a participação e aprovação no programa de capacitação do Espaço
              Empreendedor, projeto de extensão universitária voltado ao apoio ao microempreendedor
              individual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
