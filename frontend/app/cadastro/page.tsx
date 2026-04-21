"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PageHeader } from "@/components/feedback/page-header";
import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <PublicShell>
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-10 md:px-6 md:py-16">
        <PageHeader
          eyebrow="Cadastro de aluno"
          title="Entre na equipe extensionista"
          description="Preencha seus dados de aluno UFF. Um professor aprova seu cadastro e, depois disso, você cria sua senha no primeiro acesso."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-brand-line bg-white/90 shadow-soft">
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-ink">Nome completo</label>
                  <Input {...form.register("fullName")} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-ink">CPF</label>
                    <Input placeholder="000.000.000-00" {...form.register("cpf")} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-ink">Matrícula UFF</label>
                    <Input {...form.register("enrollment")} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-ink">E-mail institucional</label>
                  <Input placeholder="seu.email@id.uff.br" {...form.register("email")} />
                </div>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  Enviar cadastro
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-brand-line bg-brand-ink text-white shadow-brand">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
                Como funciona
              </p>
              <h2 className="font-heading text-5xl uppercase leading-none">
                Cadastro, aprovação e acesso.
              </h2>
              <div className="space-y-3 text-sm leading-6 text-white/75">
                <p>1. Você envia nome, CPF, e-mail institucional e matrícula UFF.</p>
                <p>2. Um professor aprova o cadastro na área interna.</p>
                <p>3. No primeiro acesso, você informa apenas o e-mail e cria sua senha.</p>
              </div>
              <Link href="/login" className="text-sm font-semibold text-brand-orange">
                Já foi aprovado? Ir para login
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicShell>
  );
}
