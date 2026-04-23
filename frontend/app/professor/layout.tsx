import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PROFESSOR_NAV } from "@/lib/constants/domain";

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell nav={PROFESSOR_NAV}>{children}</DashboardShell>;
}
