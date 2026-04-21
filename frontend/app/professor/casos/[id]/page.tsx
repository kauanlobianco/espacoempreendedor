import { CaseDetailScreen } from "@/features/cases/case-detail-screen";

export default async function ProfessorCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CaseDetailScreen caseId={id} role="PROFESSOR" />;
}
