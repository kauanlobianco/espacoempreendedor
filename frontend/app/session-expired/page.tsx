import { EmptyState } from "@/components/feedback/empty-state";

export default function SessionExpiredPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
      <EmptyState
        title="Sessão expirada"
        description="Seu acesso venceu ou deixou de ser válido. Entre novamente para continuar."
        primaryHref="/login"
        primaryLabel="Fazer login"
      />
    </main>
  );
}
