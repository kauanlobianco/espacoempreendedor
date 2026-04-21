import { DashboardShell } from "@/components/layout/dashboard-shell";
import { STUDENT_NAV } from "@/lib/constants/domain";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Área do aluno" nav={STUDENT_NAV}>
      {children}
    </DashboardShell>
  );
}
