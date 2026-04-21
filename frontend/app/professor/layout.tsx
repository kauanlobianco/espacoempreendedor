import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PROFESSOR_NAV } from "@/lib/constants/domain";

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Área do professor" nav={PROFESSOR_NAV}>
      {children}
    </DashboardShell>
  );
}
