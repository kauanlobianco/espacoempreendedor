"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  KeyRound,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";

import { SiteLogo } from "@/components/branding/site-logo";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { getDefaultRouteForRole } from "@/lib/auth/session";
import { authService } from "@/services/auth";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

const firstAccessSchema = z
  .object({
    email: z.string().email("Digite um e-mail válido."),
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme a senha."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type FirstAccessValues = z.infer<typeof firstAccessSchema>;

const ROLE_HIGHLIGHTS = [
  {
    icon: GraduationCap,
    title: "Aluno extensionista",
    description: "Fila, casos atribuídos e registro de atendimentos.",
  },
  {
    icon: Users,
    title: "Professor orientador",
    description: "Supervisão, validação e horas extensionistas.",
  },
  {
    icon: KeyRound,
    title: "Primeiro acesso",
    description: "Crie sua senha com o e-mail institucional.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, ready, user } = useAuth();
  const [mode, setMode] = useState<"login" | "first-access">("login");

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const firstAccessForm = useForm<FirstAccessValues>({
    resolver: zodResolver(firstAccessSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (ready && user) router.replace(getDefaultRouteForRole(user.role));
  }, [ready, router, user]);

  const loginMutation = useMutation({
    mutationFn: (values: LoginValues) => authService.login(values.email, values.password),
    onSuccess: (data) => {
      login(data);
      toast.success("Sessão iniciada.");
      router.replace(getDefaultRouteForRole(data.user.role));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Não foi possível entrar agora."));
    },
  });

  const firstAccessMutation = useMutation({
    mutationFn: (values: FirstAccessValues) =>
      authService.firstAccess({ email: values.email, password: values.password }),
    onSuccess: (data) => {
      login(data);
      toast.success("Senha criada com sucesso.");
      router.replace(getDefaultRouteForRole(data.user.role));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Não foi possível concluir o primeiro acesso."));
    },
  });

  return (
    <main className="min-h-screen bg-[var(--brand-paper)]">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* Painel institucional */}
        <section className="relative overflow-hidden bg-[var(--brand-ink)] px-8 py-12 text-white md:px-14 md:py-16 lg:px-16 xl:px-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full opacity-50 radial-orange-orb"
          />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[640px] flex-col justify-between gap-12">
            <div className="flex items-start justify-between gap-6">
              <SiteLogo
                invert
                size="md"
                wordmarkOnly
                className="pt-1"
              />
              <Link
                href="/"
                className="hidden items-center gap-1.5 text-[12.5px] font-semibold text-white/55 hover:text-white md:inline-flex"
              >
                Voltar ao site público
              </Link>
            </div>

            <div className="space-y-6">
              <Eyebrow tone="orange">Acesso interno</Eyebrow>
              <h1 className="font-display text-[44px] leading-[1.05] tracking-[-0.035em] md:text-[56px]">
                Onde alunos e<br />
                professores{" "}
                <em className="not-italic text-[var(--brand-orange)]">operam o dia-a-dia.</em>
              </h1>
              <p className="max-w-md text-[15px] leading-relaxed text-white/70">
                Se você já tem senha, entre normalmente. Se seu cadastro foi aprovado agora,
                use primeiro acesso para criar sua senha com o e-mail institucional.
              </p>

              <div className="grid max-w-md gap-2.5 pt-2">
                {ROLE_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3.5 rounded-2xl border border-white/8 bg-white/5 px-4 py-3"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:rgba(232,93,31,0.18)] text-[var(--brand-orange)]">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <div className="text-[13.5px] font-semibold text-white">{title}</div>
                      <div className="text-[12.5px] text-white/55">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-white/50">
              <Link href="/" className="hover:text-white/80">
                ← Voltar ao site público
              </Link>
              <Link href="/cadastro" className="hover:text-white/80">
                Novo aluno? Fazer cadastro
              </Link>
            </div>
          </div>
        </section>

        {/* Formulário */}
        <section className="flex items-center px-6 py-12 md:px-16 md:py-16 lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 inline-flex gap-1 rounded-2xl border border-[color:var(--brand-soft-line)] bg-white p-1 shadow-soft">
              <button
                type="button"
                className={`rounded-xl px-5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                  mode === "login"
                    ? "bg-[var(--brand-ink)] text-white"
                    : "text-[var(--brand-mute)]"
                }`}
                onClick={() => setMode("login")}
              >
                Entrar
              </button>
              <button
                type="button"
                className={`rounded-xl px-5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                  mode === "first-access"
                    ? "bg-[var(--brand-ink)] text-white"
                    : "text-[var(--brand-mute)]"
                }`}
                onClick={() => setMode("first-access")}
              >
                Primeiro acesso
              </button>
            </div>

            {mode === "login" ? (
              <form
                className="space-y-6"
                onSubmit={loginForm.handleSubmit((values) => loginMutation.mutate(values))}
              >
                <div className="space-y-2">
                  <Eyebrow>Entrar</Eyebrow>
                  <h2 className="font-display text-[40px] leading-tight tracking-[-0.03em] text-[var(--brand-ink)]">
                    Faça seu login
                  </h2>
                  <p className="text-[14.5px] text-[var(--brand-mute)]">
                    Área restrita a membros do projeto.
                  </p>
                </div>

                <div className="space-y-4">
                  <FieldWithIcon
                    label="E-mail institucional"
                    icon={<Mail className="size-4" />}
                    error={loginForm.formState.errors.email?.message}
                  >
                    <Input
                      type="email"
                      placeholder="voce@id.uff.br"
                      autoComplete="email"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      {...loginForm.register("email")}
                    />
                  </FieldWithIcon>

                  <FieldWithIcon
                    label="Senha"
                    icon={<ShieldCheck className="size-4" />}
                    error={loginForm.formState.errors.password?.message}
                  >
                    <Input
                      type="password"
                      placeholder="Sua senha"
                      autoComplete="current-password"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      {...loginForm.register("password")}
                    />
                  </FieldWithIcon>

                  <div className="flex items-center justify-between text-[13px]">
                    <label className="inline-flex items-center gap-2 text-[var(--brand-night)]">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-[color:var(--brand-line)] accent-[var(--brand-orange)]"
                      />
                      Manter sessão neste navegador
                    </label>
                    <Link
                      href="/login?reset=1"
                      className="font-semibold text-[var(--brand-orange-deep)] hover:text-[var(--brand-orange)]"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full justify-center"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Entrando..." : "Entrar na plataforma"}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <form
                className="space-y-6"
                onSubmit={firstAccessForm.handleSubmit((values) =>
                  firstAccessMutation.mutate(values),
                )}
              >
                <div className="space-y-2">
                  <Eyebrow>Primeiro acesso</Eyebrow>
                  <h2 className="font-display text-[40px] leading-tight tracking-[-0.03em] text-[var(--brand-ink)]">
                    Crie sua senha
                  </h2>
                  <p className="text-[14.5px] text-[var(--brand-mute)]">
                    Depois da aprovação do professor, informe seu e-mail institucional e
                    defina sua nova senha.
                  </p>
                </div>

                <div className="space-y-4">
                  <FieldWithIcon
                    label="E-mail institucional"
                    icon={<Mail className="size-4" />}
                    error={firstAccessForm.formState.errors.email?.message}
                  >
                    <Input
                      type="email"
                      placeholder="seu.email@id.uff.br"
                      autoComplete="email"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      {...firstAccessForm.register("email")}
                    />
                  </FieldWithIcon>

                  <FieldWithIcon
                    label="Nova senha"
                    icon={<KeyRound className="size-4" />}
                    error={firstAccessForm.formState.errors.password?.message}
                  >
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      {...firstAccessForm.register("password")}
                    />
                  </FieldWithIcon>

                  <FieldWithIcon
                    label="Confirmar senha"
                    icon={<ShieldCheck className="size-4" />}
                    error={firstAccessForm.formState.errors.confirmPassword?.message}
                  >
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      {...firstAccessForm.register("confirmPassword")}
                    />
                  </FieldWithIcon>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full justify-center"
                    disabled={firstAccessMutation.isPending}
                  >
                    {firstAccessMutation.isPending
                      ? "Criando senha..."
                      : "Concluir primeiro acesso"}
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              </form>
            )}
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
      {error ? (
        <p className="text-xs text-[var(--brand-red)]">{error}</p>
      ) : null}
    </div>
  );
}
