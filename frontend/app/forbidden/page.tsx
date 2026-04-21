import { EmptyState } from "@/components/feedback/empty-state";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
      <EmptyState
        title="Acesso negado"
        description="Sua conta não tem permissão para abrir essa área. Volte para a página inicial ou entre com o perfil correto."
        primaryHref="/"
        primaryLabel="Voltar ao início"
      />
    </main>
  );
}
