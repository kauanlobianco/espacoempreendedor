"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Trophy, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { coursesService } from "@/services/courses";
import type { QuizResult } from "@/types/api";

export default function AvaliacaoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [currentQ, setCurrentQ] = useState(0);

  const quizQuery = useQuery({
    queryKey: ["quiz", slug],
    queryFn: () => coursesService.getQuiz(slug),
  });

  const submitMutation = useMutation({
    mutationFn: (ans: number[]) => coursesService.submitQuiz(slug, ans),
    onSuccess: (data) => setResult(data),
    onError: () => toast.error("Erro ao enviar avaliação."),
  });

  const questions = quizQuery.data ?? [];
  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered === questions.length;

  function handleSubmit() {
    if (!allAnswered) return;
    const ans = questions.map((_, i) => answers[i] ?? 0);
    submitMutation.mutate(ans);
  }

  if (quizQuery.isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl border border-brand-line bg-white/70" />;
  }

  if (quizQuery.isError || !questions.length) {
    return <EmptyState title="Avaliação não encontrada" description="Não foi possível carregar a avaliação." />;
  }

  // Result screen
  if (result) {
    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <div className={cn(
          "rounded-2xl border p-8 text-center shadow-soft",
          result.passed
            ? "border-emerald-200 bg-emerald-50/60"
            : "border-red-200 bg-red-50/60",
        )}>
          <div className="flex justify-center">
            {result.passed ? (
              <Trophy className="size-14 text-emerald-600" />
            ) : (
              <AlertCircle className="size-14 text-red-500" />
            )}
          </div>
          <h1 className={cn(
            "mt-4 font-display text-3xl font-bold",
            result.passed ? "text-emerald-800" : "text-red-800",
          )}>
            {result.passed ? "Parabéns! Você passou!" : "Não foi desta vez"}
          </h1>
          <p className={cn(
            "mt-2 text-lg font-semibold",
            result.passed ? "text-emerald-700" : "text-red-700",
          )}>
            {result.score}/{result.total} questões corretas
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.passed
              ? "Você concluiu o curso com sucesso."
              : `Mínimo necessário: ${result.passingScore} questões. Você pode tentar novamente.`}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            {result.passed ? (
              <Link
                href={`/aluno/capacitacao/${slug}/certificado`}
                className={cn(buttonVariants({ size: "sm" }), "gap-2")}
              >
                <Trophy className="size-4" /> Ver certificado
              </Link>
            ) : (
              <Button size="sm" onClick={() => { setResult(null); setAnswers({}); setCurrentQ(0); }}>
                Tentar novamente
              </Button>
            )}
            <Link
              href={`/aluno/capacitacao/${slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Voltar ao curso
            </Link>
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-brand-ink">Gabarito</h2>
          {result.feedback.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border p-4",
                item.isCorrect ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50",
              )}
            >
              <div className="flex items-start gap-3">
                {item.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-ink">{item.question}</p>
                  {!item.isCorrect && (
                    <p className="mt-1 text-xs text-red-700">
                      Sua resposta: {questions.find((q) => q.id === item.id)?.options[item.chosen]}
                    </p>
                  )}
                  <p className={cn("mt-1 text-xs", item.isCorrect ? "text-emerald-700" : "text-brand-ink/70")}>
                    {item.isCorrect ? "Correto! " : `Resposta certa: ${questions.find((q) => q.id === item.id)?.options[item.correct]}. `}
                    {item.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const q = questions[currentQ];

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/aluno/capacitacao/${slug}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
        >
          <ChevronLeft className="size-4" /> Voltar ao curso
        </Link>
        <span className="text-sm text-muted-foreground">
          {totalAnswered}/{questions.length} respondidas
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-paper">
        <div
          className="h-full rounded-full bg-brand-orange transition-all"
          style={{ width: `${(totalAnswered / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Questão {currentQ + 1} de {questions.length}
        </p>
        <p className="mt-3 text-base font-medium leading-relaxed text-brand-ink">
          {q.question}
        </p>

        <div className="mt-5 space-y-2.5">
          {q.options.map((opt, optIdx) => {
            const selected = answers[currentQ] === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [currentQ]: optIdx }))}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left text-sm transition-all",
                  selected
                    ? "border-brand-orange bg-brand-orange/10 font-medium text-brand-orange"
                    : "border-brand-line/60 bg-brand-paper/60 text-brand-ink/90 hover:border-brand-orange/40 hover:bg-orange-50/40",
                )}
              >
                <span className={cn(
                  "mr-2 inline-flex size-5 items-center justify-center rounded-full border text-xs font-bold",
                  selected ? "border-brand-orange bg-brand-orange text-white" : "border-brand-line/60",
                )}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
          disabled={currentQ === 0}
          className="gap-1"
        >
          <ChevronLeft className="size-4" /> Anterior
        </Button>

        <div className="flex flex-wrap justify-center gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentQ(i)}
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-medium transition-all",
                i === currentQ
                  ? "bg-brand-orange text-white"
                  : answers[i] !== undefined
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-brand-paper text-muted-foreground hover:bg-brand-paper/80",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentQ < questions.length - 1 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentQ((p) => p + 1)}
            className="gap-1"
          >
            Próxima <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!allAnswered || submitMutation.isPending}
          >
            {submitMutation.isPending ? "Enviando…" : "Enviar avaliação"}
          </Button>
        )}
      </div>

      {!allAnswered && currentQ === questions.length - 1 && (
        <p className="text-center text-xs text-muted-foreground">
          Responda todas as questões antes de enviar.
        </p>
      )}
    </section>
  );
}
