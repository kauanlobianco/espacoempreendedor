import { EmptyState } from "@/components/feedback/empty-state";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
      <EmptyState
        title="Página não encontrada"
        description="O endereço que você abriu não existe ou foi movido."
        primaryHref="/"
        primaryLabel="Ir para o início"
      />
    </main>
  );
}
