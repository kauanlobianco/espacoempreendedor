"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GraduationCap, KeyRound, Users } from "lucide-react";

import { SiteLogo } from "@/components/branding/site-logo";
import { Button } from "@/components/ui/button";
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(249,115,22,0.08), transparent 36%)",
        }}
      />

      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between rounded-3xl border border-brand-line/60 bg-brand-ink p-7 text-white md:p-9">
          <SiteLogo invert />

          <div className="my-8 space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              Acesso interno
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-[34px]">
              Alunos e professores operam daqui.
            </h1>
            <p className="text-sm leading-6 text-white/70">
              Se você já tem senha, faça login normalmente. Se seu cadastro de aluno acabou de ser aprovado, use o primeiro acesso para criar a senha apenas com o e-mail institucional.
            </p>
          </div>

          <div className="space-y-2">
            {[
              { icon: GraduationCap, label: "Aluno extensionista - fila, casos e atendimentos" },
              { icon: Users, label: "Professor - supervisão e acompanhamento dos alunos" },
              { icon: KeyRound, label: "Primeiro acesso - criar senha pelo e-mail" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl bg-white/8 px-3 py-2.5 text-sm text-white/80"
              >
                <Icon className="size-4 shrink-0 text-brand-orange" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-xs text-white/50">
            <Link href="/" className="block hover:text-white/80">
              ← Voltar ao site público
            </Link>
            <Link href="/cadastro" className="block hover:text-white/80">
              Novo aluno? Fazer cadastro
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-line/60 bg-white/90 p-7 md:p-9">
          <div className="mb-7 flex gap-2 rounded-2xl bg-brand-paper p-1">
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                mode === "login" ? "bg-white text-brand-ink shadow-soft" : "text-muted-foreground"
              }`}
              onClick={() => setMode("login")}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                mode === "first-access"
                  ? "bg-white text-brand-ink shadow-soft"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMode("first-access")}
            >
              Primeiro acesso
            </button>
          </div>

          {mode === "login" ? (
            <form
              className="space-y-5"
              onSubmit={loginForm.handleSubmit((values) => loginMutation.mutate(values))}
            >
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
                  Entrar
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-brand-ink">
                  Faça seu login
                </h2>
                <p className="text-sm text-muted-foreground">Área restrita a membros do projeto.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-brand-ink">E-mail</label>
                <Input placeholder="voce@instituicao.br" {...loginForm.register("email")} />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-brand-ink">Senha</label>
                <Input type="password" placeholder="Sua senha" {...loginForm.register("password")} />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Entrando..." : "Entrar na plataforma"}
              </Button>
            </form>
          ) : (
            <form
              className="space-y-5"
              onSubmit={firstAccessForm.handleSubmit((values) => firstAccessMutation.mutate(values))}
            >
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
                  Primeiro acesso do aluno
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-brand-ink">
                  Crie sua senha
                </h2>
                <p className="text-sm text-muted-foreground">
                  Depois da aprovação do professor, informe apenas seu e-mail institucional e defina a nova senha.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-brand-ink">E-mail institucional</label>
                <Input placeholder="seu.email@id.uff.br" {...firstAccessForm.register("email")} />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-brand-ink">Nova senha</label>
                <Input type="password" {...firstAccessForm.register("password")} />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-brand-ink">Confirmar senha</label>
                <Input type="password" {...firstAccessForm.register("confirmPassword")} />
                {firstAccessForm.formState.errors.confirmPassword ? (
                  <p className="text-xs text-destructive">
                    {firstAccessForm.formState.errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={firstAccessMutation.isPending}
              >
                {firstAccessMutation.isPending ? "Criando senha..." : "Concluir primeiro acesso"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
