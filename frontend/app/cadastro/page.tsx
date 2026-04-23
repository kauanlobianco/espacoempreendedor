"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowUpRight,
  GraduationCap,
  IdCard,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { SiteLogo } from "@/components/branding/site-logo";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/client";
import { authService } from "@/services/auth";

const schema = z.object({
  fullName: z.string().min(3, "Digite o nome completo."),
  cpf: z
    .string()
    .regex(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Use 11 dígitos ou 000.000.000-00."),
  email: z.string().email("Digite um e-mail institucional válido."),
  enrollment: z.string().min(5, "Informe sua matrícula UFF."),
});

type RegisterValues = z.infer<typeof schema>;

const STEPS = [
  {
    title: "Você envia seus dados",
    description: "Nome, CPF, e-mail institucional e matrícula UFF.",
  },
  {
    title: "Um professor aprova",
    description: "A aprovação acontece na área interna, pelo orientador do projeto.",
  },
  {
    title: "Você cria sua senha",
    description: "No primeiro acesso, basta o e-mail institucional e uma nova senha.",
  },
];

export default function CadastroAlunoPage() {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", cpf: "", email: "", enrollment: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterValues) => authService.registerStudent(values),
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Não foi possível enviar o cadastro agora."));
    },
  });

  return (
    <main className="min-h-screen bg-[var(--brand-paper)]">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        <section className="relative overflow-hidden bg-[var(--brand-ink)] px-8 py-12 text-white md:px-14 md:py-16 lg:px-16 xl:px-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full opacity-50 radial-orange-orb"
          />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[640px] flex-col justify-between gap-12">
            <div className="flex items-start justify-between gap-6">
              <SiteLogo invert size="md" wordmarkOnly className="pt-1" />
              <Link
                href="/login"
                className="hidden items-center gap-1.5 text-[12.5px] font-semibold text-white/55 hover:text-white md:inline-flex"
              >
                Já tenho acesso
              </Link>
            </div>

            <div className="space-y-6">
              <Eyebrow tone="orange">Cadastro de aluno</Eyebrow>
              <h1 className="font-display text-[44px] leading-[1.05] tracking-[-0.035em] md:text-[56px]">
                Entre para a equipe{" "}
                <em className="not-italic text-[var(--brand-orange)]">extensionista.</em>
              </h1>
              <p className="max-w-md text-[15px] leading-relaxed text-white/70">
                O cadastro é aberto a alunos da UFF vinculados ao projeto. Depois da aprovação do
                professor, você cria sua senha no primeiro acesso.
              </p>

              <div className="grid max-w-md gap-2.5 pt-2">
                {STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-3.5 rounded-2xl border border-white/8 bg-white/5 px-4 py-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[color:rgba(232,93,31,0.18)] text-[12px] font-bold text-[var(--brand-orange)]">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-[13.5px] font-semibold text-white">{step.title}</div>
                      <div className="text-[12.5px] text-white/55">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-white/50">
              <Link href="/" className="hover:text-white/80">
                ← Voltar ao site público
              </Link>
              <Link href="/login" className="hover:text-white/80">
                Já fui aprovado. Fazer login
              </Link>
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-12 md:px-16 md:py-16 lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 space-y-2">
              <Eyebrow>Novo cadastro</Eyebrow>
              <h2 className="font-display text-[40px] leading-tight tracking-[-0.03em] text-[var(--brand-ink)]">
                Preencha seus dados
              </h2>
              <p className="text-[14.5px] text-[var(--brand-mute)]">
                Dados acadêmicos são usados apenas para validar o vínculo com o projeto.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <FieldWithIcon
                label="Nome completo"
                icon={<UserRound className="size-4" />}
                error={form.formState.errors.fullName?.message}
              >
                <Input
                  placeholder="Como aparece na matrícula"
                  autoComplete="name"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  {...form.register("fullName")}
                />
              </FieldWithIcon>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWithIcon
                  label="CPF"
                  icon={<IdCard className="size-4" />}
                  error={form.formState.errors.cpf?.message}
                >
                  <Input
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    {...form.register("cpf")}
                  />
                </FieldWithIcon>

                <FieldWithIcon
                  label="Matrícula UFF"
                  icon={<GraduationCap className="size-4" />}
                  error={form.formState.errors.enrollment?.message}
                >
                  <Input
                    placeholder="Seu nº de matrícula"
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    {...form.register("enrollment")}
                  />
                </FieldWithIcon>
              </div>

              <FieldWithIcon
                label="E-mail institucional"
                icon={<Mail className="size-4" />}
                error={form.formState.errors.email?.message}
              >
                <Input
                  type="email"
                  placeholder="seu.email@id.uff.br"
                  autoComplete="email"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  {...form.register("email")}
                />
              </FieldWithIcon>

              <Button
                type="submit"
                size="lg"
                className="w-full justify-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Enviando cadastro..." : "Enviar cadastro"}
                <ArrowUpRight className="size-4" />
              </Button>

              <div className="flex items-start gap-2.5 rounded-2xl border border-[color:var(--brand-soft-line)] bg-[var(--brand-orange-ghost)] px-4 py-3 text-[12.5px] leading-5 text-[var(--brand-night)]">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--brand-orange-deep)]" />
                <span>
                  Seus dados são usados apenas para validar o vínculo com o projeto. A aprovação é
                  feita por um professor responsável.
                </span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function FieldWithIcon({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12.5px] font-semibold tracking-wide text-[var(--brand-night)]">
        {label}
      </label>
      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 transition-colors focus-within:border-[var(--brand-orange)] focus-within:ring-3 focus-within:ring-[color:rgba(232,93,31,0.18)] ${
          error
            ? "border-[var(--brand-red)]/60"
            : "border-[color:var(--brand-line)]"
        }`}
      >
        <span className="text-[var(--brand-mute)]">{icon}</span>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      {error ? <p className="text-xs text-[var(--brand-red)]">{error}</p> : null}
    </div>
  );
}
